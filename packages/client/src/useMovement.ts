import { useComponentValueStream } from "@latticexyz/std-client";
import { uuid } from "@latticexyz/utils";
import { useCallback, useEffect } from "react";
import { useMUD } from "./MUDContext";

export const useMovement = () => {
  const {
    components: { Position },
    systems,
    playerEntity,
  } = useMUD();

  const playerPosition = useComponentValueStream(Position, playerEntity);

  const moveTo = useCallback(
    async (x: number, y: number) => {
      const positionId = uuid();
      Position.addOverride(positionId, {
        entity: playerEntity,
        value: { x, y },
      });

      try {
        const tx = await systems["system.Move"].executeTyped({ x, y });
        await tx.wait();
      } finally {
        Position.removeOverride(positionId);
      }
    },
    [Position, playerEntity, systems]
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
