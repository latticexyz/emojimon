import { GameMap } from "./GameMap";
import { useKeyboardMovement } from "./useKeyboardMovement";

export const GameBoard = () => {
  useKeyboardMovement();

  return <GameMap width={20} height={20} />;
};
