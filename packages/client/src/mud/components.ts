import { overridableComponent } from "@latticexyz/recs";
import { defineCoordComponent } from "@latticexyz/std-client";
import { world } from "./world";

export const contractComponents = {
  Position: overridableComponent(
    defineCoordComponent(world, {
      metadata: {
        contractId: "component.Position",
      },
    })
  ),
};

export const clientComponents = {};
