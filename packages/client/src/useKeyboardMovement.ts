import { useEffect } from "react";
import { useMUD } from "./MUDContext";
import { Direction } from "./direction";

export const useKeyboardMovement = () => {
  const {
    systemCalls: { move },
  } = useMUD();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        move(Direction.North);
      }
      if (e.key === "ArrowDown") {
        move(Direction.South);
      }
      if (e.key === "ArrowLeft") {
        move(Direction.West);
      }
      if (e.key === "ArrowRight") {
        move(Direction.East);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move]);
};
