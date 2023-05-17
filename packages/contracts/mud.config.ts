import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    Direction: ["North", "East", "South", "West"],
    TerrainType: ["None", "TallGrass", "Boulder"],
  },
  tables: {
    MapConfig: {
      keySchema: {},
      dataStruct: false,
      valueSchema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
    },
    Movable: "bool",
    Obstruction: "bool",
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
