import {
  defineBoolComponent,
  defineCoordComponent,
} from "@latticexyz/std-client";
import { world } from "./world";

export const components = {
  Movable: defineBoolComponent(world, {
    metadata: {
      contractId: "component.Movable",
    },
  }),
  Player: defineBoolComponent(world, {
    metadata: {
      contractId: "component.Player",
    },
  }),
  Position: defineCoordComponent(world, {
    metadata: {
      contractId: "component.Position",
    },
  }),
};

export const clientComponents = {};
