import { Has, HasValue, runQuery } from "@latticexyz/recs";
import { useComponentValueStream } from "@latticexyz/std-client";
import { uuid } from "@latticexyz/utils";
import { useCallback, useEffect } from "react";
import { useMUD } from "./MUDContext";
import { useMapConfig } from "./useMapConfig";

export const useMovement = () => {
  const {
    components: { Encounter, Obstruction, Position },
    systems,
    playerEntity,
  } = useMUD();

  const { width, height } = useMapConfig();
  const playerPosition = useComponentValueStream(Position, playerEntity);
  const inEncounter =
    useComponentValueStream(Encounter, playerEntity)?.value != null;

  const moveTo = useCallback(
    async (x: number, y: number) => {
      const wrappedX = (x + width) % width;
      const wrappedY = (y + height) % height;

      const obstructed = runQuery([
        Has(Obstruction),
        HasValue(Position, { x: wrappedX, y: wrappedY }),
      ]);
      if (obstructed.size > 0) {
        throw new Error("cannot move to obstructed space");
      }

      if (inEncounter) {
        throw new Error("cannot move while in encounter");
      }

      const positionId = uuid();
      Position.addOverride(positionId, {
        entity: playerEntity,
        value: {
          x: wrappedX,
          y: wrappedY,
        },
      });

      try {
        const tx = await systems["system.Move"].executeTyped({ x, y });
        await tx.wait();
      } finally {
        Position.removeOverride(positionId);
      }
    },
    [Obstruction, Position, height, inEncounter, playerEntity, systems, width]
  );

  const moveBy = useCallback(
    async (deltaX: number, deltaY: number) => {
      if (!playerPosition) {
        console.warn(
          "cannot moveBy without a player position, not yet spawned?"
        );
        return;
      }
      await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
    },
    [moveTo, playerPosition]
  );

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
};
