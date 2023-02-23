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

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export const setup = async () => {
  const result = await setupMUDNetwork<typeof contractComponents, SystemTypes>(
    config,
    world,
    contractComponents,
    SystemAbis
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
    const positionId = uuid();
    components.Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
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
    },
  };
};
