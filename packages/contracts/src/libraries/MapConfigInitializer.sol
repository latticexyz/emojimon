// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { MapConfigComponent, ID as MapConfigComponentID, MapConfig } from "components/MapConfigComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { ObstructionComponent, ID as ObstructionComponentID } from "components/ObstructionComponent.sol";
import { EncounterTriggerComponent, ID as EncounterTriggerComponentID } from "components/EncounterTriggerComponent.sol";
import { TerrainType } from "../TerrainType.sol";

library MapConfigInitializer {
  function init(IWorld world) internal {
    MapConfigComponent mapConfig = MapConfigComponent(world.getComponent(MapConfigComponentID));
    PositionComponent position = PositionComponent(world.getComponent(PositionComponentID));
    ObstructionComponent obstruction = ObstructionComponent(world.getComponent(ObstructionComponentID));
    EncounterTriggerComponent encounterTrigger = EncounterTriggerComponent(
      world.getComponent(EncounterTriggerComponentID)
    );

    // Alias these to make it easier to draw the terrain map
    TerrainType O = TerrainType.None;
    TerrainType T = TerrainType.TallGrass;
    TerrainType B = TerrainType.Boulder;

    TerrainType[20][20] memory map = [
      [O, O, O, O, O, O, T, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, O, T, O, O, O, O, O, T, O, O, O, O, B, O, O, O, O, O, O],
      [O, T, T, T, T, O, O, O, O, O, O, O, O, O, O, T, T, O, O, O],
      [O, O, T, T, T, T, O, O, O, O, B, O, O, O, O, O, T, O, O, O],
      [O, O, O, O, T, T, O, O, O, O, O, O, O, O, O, O, O, T, O, O],
      [O, O, O, B, B, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, T, O, O, O, B, B, O, O, O, O, T, O, O, O, O, O, B, O, O],
      [O, O, T, T, O, O, O, O, O, T, O, B, O, O, T, O, B, O, O, O],
      [O, O, T, O, O, O, O, T, T, T, O, B, B, O, O, O, O, O, O, O],
      [O, O, O, O, O, O, O, T, T, T, O, B, T, O, T, T, O, O, O, O],
      [O, B, O, O, O, B, O, O, T, T, O, B, O, O, T, T, O, O, O, O],
      [O, O, B, O, O, O, T, O, T, T, O, O, B, T, T, T, O, O, O, O],
      [O, O, B, B, O, O, O, O, T, O, O, O, B, O, T, O, O, O, O, O],
      [O, O, O, B, B, O, O, O, O, O, O, O, O, B, O, T, O, O, O, O],
      [O, O, O, O, B, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, O, O, O, O, O, O, O, O, O, B, B, O, O, T, O, O, O, O, O],
      [O, O, O, O, T, O, O, O, T, B, O, O, O, T, T, O, B, O, O, O],
      [O, O, O, T, O, T, T, T, O, O, O, O, O, T, O, O, O, O, O, O],
      [O, O, O, T, T, T, T, O, O, O, O, T, O, O, O, T, O, O, O, O],
      [O, O, O, O, O, T, O, O, O, O, O, O, O, O, O, O, O, O, O, O]
    ];

    uint32 height = uint32(map.length);
    uint32 width = uint32(map[0].length);
    bytes memory terrain = new bytes(width * height);

    for (uint32 y = 0; y < height; y++) {
      for (uint32 x = 0; x < width; x++) {
        TerrainType terrainType = map[y][x];
        if (terrainType == TerrainType.None) continue;

        terrain[(y * width) + x] = bytes1(uint8(terrainType));

        if (terrainType == TerrainType.Boulder) {
          uint256 entity = world.getUniqueEntityId();
          position.set(entity, Coord(int32(x), int32(y)));
          obstruction.set(entity);
        } else if (terrainType == TerrainType.TallGrass) {
          uint256 entity = world.getUniqueEntityId();
          position.set(entity, Coord(int32(x), int32(y)));
          encounterTrigger.set(entity);
        }
      }
    }

    mapConfig.set(MapConfig({ width: width, height: height, terrain: terrain }));
  }
}
