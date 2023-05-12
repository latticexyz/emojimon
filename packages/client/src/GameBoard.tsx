import { useEffect, useState } from "react";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";
import { useMapConfig } from "./useMapConfig";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { EncounterScreen } from "./EncounterScreen";

export const GameBoard = () => {
  const { width, height, terrainValues } = useMapConfig();
  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);

  const {
    components: { Encounter, Position, Player },
    playerEntity,
    api: { spawn },
  } = useMUD();

  useKeyboardMovement();

  const playerPosition = useComponentValue(Position, playerEntity);
  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;
  const encounter = useComponentValue(Encounter, playerEntity);

  const otherPlayers = useEntityQuery([Has(Player), Has(Position)])
    .filter((entity) => entity !== playerEntity)
    .map((entity) => {
      const position = getComponentValueStrict(Position, entity);
      return {
        entity,
        position,
      };
    });

  const [showEncounter, setShowEncounter] = useState(false);
  // Reset show encounter when we leave encounter
  useEffect(() => {
    if (!encounter) {
      setShowEncounter(false);
    }
  }, [encounter]);

  return (
    <div className="inline-grid p-2 bg-lime-500 relative overflow-hidden">
      {rows.map((y) =>
        columns.map((x) => {
          const terrain = terrainValues.find(
            (t) => t.x === x && t.y === y
          )?.type;

          const hasPlayer = playerPosition?.x === x && playerPosition?.y === y;
          const otherPlayersHere = otherPlayers.filter(
            (p) => p.position.x === x && p.position.y === y
          );

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-8 h-8 flex items-center justify-center",
                canSpawn ? "cursor-pointer hover:ring" : null
              )}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
              onClick={async (event) => {
                event.preventDefault();
                if (canSpawn) {
                  await spawn(x, y);
                }
              }}
            >
              {hasPlayer && encounter ? (
                <div
                  className="absolute z-10 animate-battle"
                  style={{
                    boxShadow: "0 0 0 100vmax black",
                  }}
                  onAnimationEnd={() => {
                    setShowEncounter(true);
                  }}
                ></div>
              ) : null}
              <div className="flex flex-wrap gap-1 items-center justify-center relative">
                {terrain ? (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                    {terrain.emoji}
                  </div>
                ) : null}
                <div className="relative">
                  {hasPlayer ? <>🤠</> : null}
                  {otherPlayersHere.map((p) => (
                    <span key={p.entity}>🥸</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}

      {encounter && showEncounter ? (
        <div
          className="relative z-10 -m-2 bg-black text-white flex items-center justify-center"
          style={{
            gridColumnStart: 1,
            gridColumnEnd: width + 1,
            gridRowStart: 1,
            gridRowEnd: height + 1,
          }}
        >
          <EncounterScreen monsters={encounter.monsters as Entity[]} />
        </div>
      ) : null}
    </div>
  );
};
