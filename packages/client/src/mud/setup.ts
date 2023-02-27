import { setupMUDNetwork } from "@latticexyz/std-client";
import { SystemTypes } from "contracts/types/SystemTypes";
import { config } from "./config";
import { contractComponents, clientComponents } from "./components";
import { world } from "./world";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import { EntityID, getComponentValue } from "@latticexyz/recs";
import { createFaucetService, SingletonID } from "@latticexyz/network";
import { ethers } from "ethers";
import { uuid } from "@latticexyz/utils";
import { Has, HasValue, runQuery } from "@latticexyz/recs";
import { filter, first } from "rxjs";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export const setup = async () => {
  const result = await setupMUDNetwork<typeof contractComponents, SystemTypes>(
    config,
    world,
    contractComponents,
    SystemAbis,
    {
      fetchSystemCalls: true,
    }
  );

  result.startSync();

  // For LoadingState updates
  const singletonEntity = world.registerEntity({ id: SingletonID });

  // Register player entity
  const address = result.network.connectedAddress.get();
  if (!address) throw new Error("Not connected");

  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  const components = {
    ...result.components,
    ...clientComponents,
  };

  // Request drip from faucet
  if (!config.devMode && config.faucetServiceUrl) {
    const faucet = createFaucetService(config.faucetServiceUrl);
    console.info("[Dev Faucet]: Player Address -> ", address);

    const requestDrip = async () => {
      const balance = await result.network.signer.get()?.getBalance();
      console.info(`[Dev Faucet]: Player Balance -> ${balance}`);
      const playerIsBroke = balance?.lte(ethers.utils.parseEther("1"));
      console.info(`[Dev Faucet]: Player is broke -> ${playerIsBroke}`);
      if (playerIsBroke) {
        console.info("[Dev Faucet]: Dripping funds to player");
        // Double drip
        address &&
          (await faucet?.dripDev({ address })) &&
          (await faucet?.dripDev({ address }));
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    setInterval(requestDrip, 20000);
  }

  const moveTo = async (x: number, y: number) => {
    const mapConfig = getComponentValue(components.MapConfig, singletonEntity);
    if (!mapConfig) {
      console.warn("moveTo called before mapConfig loaded/initialized");
      return;
    }

    const wrappedX = (x + mapConfig.width) % mapConfig.width;
    const wrappedY = (y + mapConfig.height) % mapConfig.height;

    const obstructed = runQuery([
      Has(components.Obstruction),
      HasValue(components.Position, { x: wrappedX, y: wrappedY }),
    ]);
    if (obstructed.size > 0) {
      console.warn("cannot move to obstructed space");
      return;
    }

    const inEncounter =
      getComponentValue(components.Encounter, playerEntity)?.value != null;
    if (inEncounter) {
      console.warn("cannot move while in encounter");
      return;
    }

    const positionId = uuid();
    components.Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x: wrappedX, y: wrappedY },
    });

    try {
      const tx = await result.systems["system.Move"].executeTyped({ x, y });
      await tx.wait();
    } finally {
      components.Position.removeOverride(positionId);
    }
  };

  const moveBy = async (deltaX: number, deltaY: number) => {
    const playerPosition = getComponentValue(components.Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }
    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };

  const joinGame = async (x: number, y: number) => {
    const canJoinGame =
      getComponentValue(components.Player, playerEntity)?.value !== true;

    if (!canJoinGame) {
      throw new Error("already joined game");
    }

    const positionId = uuid();
    components.Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
    const playerId = uuid();
    components.Player.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });

    try {
      const tx = await result.systems["system.JoinGame"].executeTyped({ x, y });
      await tx.wait();
    } finally {
      components.Position.removeOverride(positionId);
      components.Player.removeOverride(playerId);
    }
  };

  const throwBall = async (encounterId: EntityID, monsterId: EntityID) => {
    const tx = await result.systems["system.EncounterThrow"].executeTyped(
      encounterId,
      monsterId
    );

    return new Promise<{ status: "caught" | "fled" | "missed"; tx: typeof tx }>(
      (resolve) => {
        result.systemCallStreams["system.EncounterThrow"]
          .pipe(filter((systemCall) => systemCall.tx.hash === tx.hash))
          .pipe(first())
          .subscribe((systemCall) => {
            const isCaught = systemCall.updates.some(
              (update) =>
                update.component.metadata?.contractId === "component.OwnedBy"
            );
            if (isCaught) {
              resolve({ status: "caught", tx });
              return;
            }

            const hasFled = systemCall.updates.some(
              (update) =>
                update.component.metadata?.contractId === "component.Encounter"
            );
            if (hasFled) {
              resolve({ status: "fled", tx });
              return;
            }

            resolve({ status: "missed", tx });
          });
      }
    );
  };

  const fleeEncounter = async (encounterId: EntityID) => {
    const tx = await result.systems["system.EncounterFlee"].executeTyped(
      encounterId
    );
    return new Promise<{ tx: typeof tx }>((resolve) => {
      result.systemCallStreams["system.EncounterFlee"]
        .pipe(filter((systemCall) => systemCall.tx.hash === tx.hash))
        .pipe(first())
        .subscribe(() => {
          resolve({ tx });
        });
    });
  };

  return {
    ...result,
    world,
    singletonEntityId: SingletonID,
    singletonEntity,
    playerEntityId,
    playerEntity,
    components,
    api: {
      moveTo,
      moveBy,
      joinGame,
      throwBall,
      fleeEncounter,
    },
  };
};
