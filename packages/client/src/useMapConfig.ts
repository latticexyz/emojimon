import { getComponentValue } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

export const useMapConfig = () => {
  const {
    components: { MapConfig },
    singletonEntity,
  } = useMUD();
  const mapConfig = getComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error(
      "game config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  return mapConfig;
};
