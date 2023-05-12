import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { terrainTypes, TerrainType } from "./terrainTypes";
import { hexToArray } from "@latticexyz/utils";

export const useMapConfig = () => {
  const {
    components: { MapConfig },
    singletonEntity,
  } = useMUD();

  const mapConfig = useComponentValue(MapConfig, singletonEntity);

  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  const { width, height, terrain } = mapConfig;
  const terrainValues = Array.from(hexToArray(terrain)).map((value, index) => ({
    x: index % width,
    y: Math.floor(index / width),
    value,
    type: value in TerrainType ? terrainTypes[value as TerrainType] : null,
  }));

  return { width, height, terrain, terrainValues };
};
