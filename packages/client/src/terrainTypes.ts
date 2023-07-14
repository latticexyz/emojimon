export enum TerrainType {
  TallGrass = 1,
  Boulder = 2,
  Fire = 3,
  Water = 4,
}

export enum TerrainStyle {
  FieldAndStone,
  FireAndWater
}

type TerrainConfig = {
  emoji: string;
};

export const terrainTypes: Record<TerrainType, TerrainConfig> = {
  [TerrainType.Water]: {
    emoji: "💧",
  },
  [TerrainType.Fire]: {
    emoji: "🔥",
  },
  [TerrainType.TallGrass]: {
    emoji: "🌳",
  },
  [TerrainType.Boulder]: {
    emoji: "🪨",
  },
};
