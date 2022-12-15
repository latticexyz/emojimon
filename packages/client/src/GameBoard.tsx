import { useComponentValueStream } from "@latticexyz/std-client";
import { useMUD } from "./MUDContext";

export const GameBoard = () => {
  const { components, systems, playerEntity } = useMUD();

  const rows = new Array(10).fill(0).map((_, i) => i);
  const columns = new Array(10).fill(0).map((_, i) => i);

  const playerPosition = useComponentValueStream(
    components.Position,
    playerEntity
  );

  return (
    <div className="inline-grid p-2 bg-lime-500">
      {rows.map((y) =>
        columns.map((x) => {
          const key = `${x},${y}`;
          return (
            <div
              key={key}
              className="w-8 h-8 flex items-center justify-center cursor-pointer hover:ring"
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
              onClick={(event) => {
                event.preventDefault();
                systems["system.Move"].executeTyped({ x, y });
              }}
            >
              {playerPosition?.x === x && playerPosition?.y === y ? (
                <>🤠</>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
};
