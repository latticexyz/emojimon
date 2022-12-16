import { useComponentValueStream } from "@latticexyz/std-client";
import { useMUD } from "./MUDContext";
import { useJoinGame } from "./useJoinGame";
import { useMovement } from "./useMovement";

export const GameBoard = () => {
  const {
    components: { Position },
    playerEntity,
  } = useMUD();

  const rows = new Array(10).fill(0).map((_, i) => i);
  const columns = new Array(10).fill(0).map((_, i) => i);

  const { canJoinGame, joinGame } = useJoinGame();
  const playerPosition = useComponentValueStream(Position, playerEntity);
  useMovement();

  return (
    <div className="inline-grid p-2 bg-lime-500">
      {rows.map((y) =>
        columns.map((x) => (
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
            {playerPosition?.x === x && playerPosition?.y === y ? (
              <>🤠</>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};
