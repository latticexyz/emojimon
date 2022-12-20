import { useComponentValueStream } from "@latticexyz/std-client";
import { useMUD } from "./MUDContext";
import { useMapConfig } from "./useMapConfig";
import { useJoinGame } from "./useJoinGame";
import { useMovement } from "./useMovement";

export const GameBoard = () => {
  const {
    components: { Position },
    playerEntity,
  } = useMUD();

  const mapConfig = useMapConfig();
  const rows = new Array(mapConfig.height).fill(0).map((_, i) => i);
  const columns = new Array(mapConfig.width).fill(0).map((_, i) => i);

  const { canJoinGame, joinGame } = useJoinGame();
  const playerPosition = useComponentValueStream(Position, playerEntity);
  useMovement();

  return (
    <div className="inline-grid p-2 bg-lime-500">
      {rows.map((y) =>
        columns.map((x) => {
          const terrain = mapConfig.terrainValues.find(
            (t) => t.x === x && t.y === y
          )?.type;

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
              <div className="flex flex-wrap gap-1 items-center justify-center relative">
                {terrain ? (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                    {terrain.emoji}
                  </div>
                ) : null}
                <div className="relative">
                  {playerPosition?.x === x && playerPosition?.y === y ? (
                    <>🤠</>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
