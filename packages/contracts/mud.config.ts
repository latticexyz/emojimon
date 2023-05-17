import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    Direction: ["North", "East", "South", "West"],
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
  },
  tables: {
    Encounter: {
      schema: {
        player: "bytes32",
        exists: "bool",
        monster: "bytes32",
        catchAttempts: "uint256",
      },
      key: ["player"],
    },
    EncounterTrigger: "bool",
    Encounterable: "bool",
    MapConfig: {
      schema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
      key: [],
      codegen: {
        dataStruct: false,
      },
    },
    MonsterCatchAttempt: {
      type: "offchainTable",
      schema: {
        encounter: "bytes32",
        result: "MonsterCatchResult",
      },
      key: ["encounter"],
      codegen: {
        dataStruct: false,
      },
    },
    Monster: "MonsterType",
    Movable: "bool",
    Obstruction: "bool",
    OwnedBy: "bytes32",
    Player: "bool",
    Position: {
      schema: {
        id: "bytes32",
        x: "int32",
        y: "int32",
      },
      key: ["id"],
      codegen: {
        dataStruct: false,
      },
    },
  },
});
