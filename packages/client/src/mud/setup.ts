import { setupMUDNetwork } from "@latticexyz/std-client";
import { SystemTypes } from "contracts/types/SystemTypes";
import { config } from "./config";
import { components, clientComponents } from "./components";
import { world } from "./world";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import { EntityID, overridableComponent } from "@latticexyz/recs";
import { GodID as singletonEntityId } from "@latticexyz/network";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export const setup = async () => {
  const result = await setupMUDNetwork<typeof components, SystemTypes>(
    config,
    world,
    components,
    SystemAbis,
    {
      fetchSystemCalls: true,
    }
  );

  result.startSync();

  // For LoadingState updates
  const singletonEntity = world.registerEntity({ id: singletonEntityId });

  // Register player entity
  const address = result.network.connectedAddress.get();
  if (!address) throw new Error("Not connected");

  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  // Add support for optimistic rendering
  const componentsWithOverrides = {
    Position: overridableComponent(components.Position),
    Player: overridableComponent(components.Player),
  };

  return {
    ...result,
    world,
    singletonEntityId,
    singletonEntity,
    playerEntityId,
    playerEntity,
    components: {
      ...result.components,
      ...componentsWithOverrides,
      ...clientComponents,
    },
  };
};
