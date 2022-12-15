import { defineCoordComponent } from "@latticexyz/std-client";
import { world } from "./world";

export const components = {
  Position: defineCoordComponent(world, {
    metadata: {
      contractId: "component.Position",
    },
  }),
};

export const clientComponents = {};
