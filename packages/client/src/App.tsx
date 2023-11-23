import { useComponentValue } from "@latticexyz/react";
import { SyncStep } from "@latticexyz/store-sync";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";

export const App = () => {
  const {
    components: { SyncProgress },
  } = useMUD();

  const loadingState = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {loadingState.step !== SyncStep.LIVE ? (
        <div>
          {loadingState.message} ({loadingState.percentage.toFixed(2)}%)
        </div>
      ) : (
        <GameBoard />
      )}
    </div>
  );
};
