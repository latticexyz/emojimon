export enum TerrainType {
  TallGrass = 1,
  Fire = 2,
  Water = 3,
  Boulder,
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
