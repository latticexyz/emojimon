import { defineNumberComponent } from "@latticexyz/std-client";
import { world } from "./world";

export const components = {
  Counter: defineNumberComponent(world, {
    metadata: {
      contractId: "component.Counter",
    },
  }),
};

export const clientComponents = {};
