import { defineComponent, Type } from "@latticexyz/recs";
import {
  defineBoolComponent,
  defineCoordComponent,
  defineNumberComponent,
  defineStringComponent,
} from "@latticexyz/std-client";
import { world } from "./world";

export const components = {
  Counter: defineNumberComponent(world, {
    metadata: {
      contractId: "component.Counter",
    },
  }),
  Encounter: defineStringComponent(world, {
    metadata: {
      contractId: "component.Encounter",
    },
  }),
  Encounterable: defineBoolComponent(world, {
    metadata: {
      contractId: "component.Encounterable",
    },
  }),
  EncounterTrigger: defineBoolComponent(world, {
    metadata: {
      contractId: "component.EncounterTrigger",
    },
  }),
  MapConfig: defineComponent(
    world,
    {
      width: Type.Number,
      height: Type.Number,
      terrain: Type.String,
    },
    {
      id: "MapConfig",
      metadata: { contractId: "component.MapConfig" },
    }
  ),
  MonsterType: defineNumberComponent(world, {
    metadata: {
      contractId: "component.MonsterType",
    },
  }),
  Movable: defineBoolComponent(world, {
    metadata: {
      contractId: "component.Movable",
    },
  }),
  Obstruction: defineBoolComponent(world, {
    metadata: {
      contractId: "component.Obstruction",
    },
  }),
  OwnedBy: defineStringComponent(world, {
    metadata: {
      contractId: "component.OwnedBy",
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
