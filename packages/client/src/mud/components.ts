import { defineCoordComponent } from "@latticexyz/std-client";
import { world } from "./world";

export const contractComponents = {
  Position: defineCoordComponent(world, {
    metadata: {
      contractId: "component.Position",
    },
  }),
};

export const clientComponents = {};
