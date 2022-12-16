import { useComponentValueStream } from "@latticexyz/std-client";
import { uuid } from "@latticexyz/utils";
import { useCallback, useMemo } from "react";
import { useMUD } from "./MUDContext";

export const useJoinGame = () => {
  const {
    components: { Position, Player },
    systems,
    playerEntity,
  } = useMUD();

  const canJoinGame =
    useComponentValueStream(Player, playerEntity)?.value !== true;

  const joinGame = useCallback(
    async (x: number, y: number) => {
      if (!canJoinGame) {
        throw new Error("already joined game");
      }

      const positionId = uuid();
      Position.addOverride(positionId, {
        entity: playerEntity,
        value: { x, y },
      });
      const playerId = uuid();
      Player.addOverride(playerId, {
        entity: playerEntity,
        value: { value: true },
      });

      try {
        const tx = await systems["system.JoinGame"].executeTyped({ x, y });
        await tx.wait();
      } finally {
        Position.removeOverride(positionId);
        Player.removeOverride(playerId);
      }
    },
    [Player, Position, canJoinGame, playerEntity, systems]
  );

  return useMemo(() => ({ canJoinGame, joinGame }), [canJoinGame, joinGame]);
};
