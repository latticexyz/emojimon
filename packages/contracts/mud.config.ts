import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    Direction: ["North", "East", "South", "West"],
  },
  tables: {
    Movable: "bool",
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
