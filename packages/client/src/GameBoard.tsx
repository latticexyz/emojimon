import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { hexToArray } from "@latticexyz/utils";
import { TerrainStyle, TerrainType, terrainTypes } from "./terrainTypes";
import { EncounterScreen } from "./EncounterScreen";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { MonsterType, monsterTypes } from "./monsterTypes";
 
type GameBoardProps = {
  terrainStyle: TerrainStyle ;
}

export const GameBoard = (props: GameBoardProps) => {
  useKeyboardMovement();
 
  const {
    components: { Encounter, MapConfig, Monster, Player, Position },
    network: { playerEntity, singletonEntity },
    systemCalls: { spawn },
  } = useMUD();

  const { terrainStyle } = props;

  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;
 
  const players = useEntityQuery([Has(Player), Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? "🤠" : "🥸",
    };
  });
 
  const mapConfig = useComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error("map config not set or not ready, only use this hook after loading state === LIVE");
  }
 
  const { width, height, terrain: terrainData } = mapConfig;
  const terrain = Array.from(hexToArray(terrainData)).map((value, index) => {
    // Hacky toggle for 2 terrain types
    if (value === 1 && terrainStyle === TerrainStyle.FireAndWater) {
      value = 3
    }

    if (value === 2 && terrainStyle === TerrainStyle.FireAndWater) {
      value = 4
    }

    const { emoji } = value in TerrainType ? terrainTypes[value as TerrainType] : { emoji: "" };
    return {
      x: index % width,
      y: Math.floor(index / width),
      emoji,
    };
  });
 
  const encounter = useComponentValue(Encounter, playerEntity);
  const monsterType = useComponentValue(Monster, encounter ? (encounter.monster as Entity) : undefined)?.value;
  const monster = monsterType != null && monsterType in MonsterType ? monsterTypes[monsterType as MonsterType] : null;
 
  return (
    <GameMap
      width={width}
      height={height}
      terrain={terrain}
      terrainStyle={terrainStyle}
      onTileClick={canSpawn ? spawn : undefined}
      players={players}
      encounter={
        encounter ? (
          <EncounterScreen monsterName={monster?.name ?? "MissingNo"} monsterEmoji={monster?.emoji ?? "💱"} />
        ) : undefined
      }
    />
  );
};
