import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
  },
  tables: {
    Encounter: {
      dataStruct: false,
      keySchema: {
        player: "bytes32",
      },
      schema: {
        actionCount: "uint256",
        monster: "bytes32",
      },
    },
    MonsterCatchAttempt: {
      ephemeral: true,
      dataStruct: false,
      keySchema: {
        encounter: "bytes32",
      },
      schema: {
        monster: "bytes32",
        result: "MonsterCatchResult",
      },
    },
    EncounterTrigger: "bool",
    Encounterable: "bool",
    MapConfig: {
      keySchema: {},
      dataStruct: false,
      schema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
    },
    Monster: "MonsterType",
    Movable: "bool",
    Obstruction: "bool",
    OwnedBy: "bytes32",
    Player: "bool",
    Position: {
      dataStruct: false,
      schema: {
        x: "uint32",
        y: "uint32",
      },
    },
  },
});
