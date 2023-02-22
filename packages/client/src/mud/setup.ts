import { setupMUDNetwork } from "@latticexyz/std-client";
import { SystemTypes } from "contracts/types/SystemTypes";
import { config } from "./config";
import { contractComponents, clientComponents } from "./components";
import { world } from "./world";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import { EntityID } from "@latticexyz/recs";
import { createFaucetService, SingletonID } from "@latticexyz/network";
import { ethers } from "ethers";

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

  return {
    ...result,
    world,
    singletonEntityId: SingletonID,
    singletonEntity,
    playerEntityId,
    playerEntity,
    components,
  };
};
