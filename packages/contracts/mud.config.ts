import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    Direction: ["North", "East", "South", "West"],
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
  },
  tables: {
    Encounter: {
      keySchema: {
        player: "bytes32",
      },
      valueSchema: {
        exists: "bool",
        monster: "bytes32",
        catchAttempts: "uint256",
      },
    },
    EncounterTrigger: "bool",
    Encounterable: "bool",
    MapConfig: {
      keySchema: {},
      dataStruct: false,
      valueSchema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
    },
    MonsterCatchAttempt: {
      offchainOnly: true,
      dataStruct: false,
      keySchema: {
        encounter: "bytes32",
      },
      valueSchema: {
        result: "MonsterCatchResult",
      },
    },
    Monster: "MonsterType",
    Movable: "bool",
    Obstruction: "bool",
    OwnedBy: "bytes32",
    Player: "bool",
    Position: {
      dataStruct: false,
      valueSchema: {
        x: "int32",
        y: "int32",
      },
    },
  },
});
