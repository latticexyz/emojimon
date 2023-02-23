import { useEffect } from "react";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";

export const GameBoard = () => {
  const rows = new Array(20).fill(0).map((_, i) => i);
  const columns = new Array(20).fill(0).map((_, i) => i);

  const {
    components: { Position },
    api: { moveTo, moveBy },
    playerEntity,
  } = useMUD();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        moveBy(0, -1);
      }
      if (e.key === "ArrowDown") {
        moveBy(0, 1);
      }
      if (e.key === "ArrowLeft") {
        moveBy(-1, 0);
      }
      if (e.key === "ArrowRight") {
        moveBy(1, 0);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveBy]);

  const playerPosition = useComponentValue(Position, playerEntity);

  return (
    <div className="inline-grid p-2 bg-lime-500">
      {rows.map((y) =>
        columns.map((x) => (
          <div
            key={`${x},${y}`}
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:ring"
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
            onClick={(event) => {
              event.preventDefault();
              moveTo(x, y);
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
