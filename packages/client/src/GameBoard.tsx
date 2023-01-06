import { useComponentValueStream } from "@latticexyz/std-client";
import { useMUD } from "./MUDContext";
import { useMapConfig } from "./useMapConfig";
import { useJoinGame } from "./useJoinGame";
import { useMovement } from "./useMovement";
import { useEffect, useMemo, useState } from "react";
import { EncounterScreen } from "./EncounterScreen";
import { EntityID, getComponentValueStrict, Has } from "@latticexyz/recs";
import { useEntityQuery } from "./useEntityQuery";

export const GameBoard = () => {
  const {
    components: { Encounter, Player, Position },
    playerEntity,
  } = useMUD();

  const mapConfig = useMapConfig();
  const rows = new Array(mapConfig.height).fill(0).map((_, i) => i);
  const columns = new Array(mapConfig.width).fill(0).map((_, i) => i);

  const { canJoinGame, joinGame } = useJoinGame();
  const playerPosition = useComponentValueStream(Position, playerEntity);
  useMovement();

  const otherPlayers = useEntityQuery(
    useMemo(() => [Has(Player), Has(Position)], [Player, Position])
  )
    .filter((entity) => entity !== playerEntity)
    .map((entity) => {
      const position = getComponentValueStrict(Position, entity);
      return {
        entity,
        position,
      };
    });

  const encounterId = useComponentValueStream(Encounter, playerEntity)
    ?.value as EntityID | undefined;
  const [showEncounter, setShowEncounter] = useState(false);

  // Reset show encounter when we leave encounter
  useEffect(() => {
    if (!encounterId) {
      setShowEncounter(false);
    }
  }, [encounterId]);

  return (
    <div className="inline-grid p-2 bg-lime-500 relative overflow-hidden">
      {rows.map((y) =>
        columns.map((x) => {
          const terrain = mapConfig.terrainValues.find(
            (t) => t.x === x && t.y === y
          )?.type;

          const hasPlayer = playerPosition?.x === x && playerPosition?.y === y;
          const otherPlayersHere = otherPlayers.filter(
            (p) => p.position.x === x && p.position.y === y
          );

          return (
            <div
              key={`${x},${y}`}
              className={`w-8 h-8 flex items-center justify-center ${
                canJoinGame ? "cursor-pointer hover:ring" : ""
              }`}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
              onClick={(event) => {
                if (canJoinGame) {
                  event.preventDefault();
                  joinGame(x, y);
                }
              }}
            >
              {hasPlayer && encounterId ? (
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
      {encounterId && showEncounter ? (
        <div
          className="-m-2 z-20 bg-black text-white flex items-center justify-center"
          style={{
            gridColumnStart: 1,
            gridColumnEnd: mapConfig.width + 1,
            gridRowStart: 1,
            gridRowEnd: mapConfig.height + 1,
          }}
        >
          <EncounterScreen encounterId={encounterId} />
        </div>
      ) : null}
    </div>
  );
};
