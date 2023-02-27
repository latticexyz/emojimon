import { useComponentValue } from "@latticexyz/react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { useMapConfig } from "./useMapConfig";

export const GameBoard = () => {
  const { width, height } = useMapConfig();
  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);

  const {
    components: { Position, Player },
    api: { joinGame },
    playerEntity,
  } = useMUD();

  useKeyboardMovement();

  const playerPosition = useComponentValue(Position, playerEntity);
  const canJoinGame = useComponentValue(Player, playerEntity)?.value !== true;

  return (
    <div className="inline-grid p-2 bg-lime-500">
      {rows.map((y) =>
        columns.map((x) => (
          <div
            key={`${x},${y}`}
            className={twMerge(
              "w-8 h-8 flex items-center justify-center",
              canJoinGame ? "cursor-pointer hover:ring" : null
            )}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
            onClick={(event) => {
              event.preventDefault();
              if (canJoinGame) {
                joinGame(x, y);
              }
            }}
          >
            {playerPosition?.x === x && playerPosition?.y === y ? (
              <>🤠</>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};
