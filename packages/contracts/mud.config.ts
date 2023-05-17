import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    Direction: ["North", "East", "South", "West"],
    TerrainType: ["None", "TallGrass", "Boulder"],
  },
  tables: {
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
    Movable: "bool",
    Obstruction: "bool",
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
