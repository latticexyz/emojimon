import { getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "../direction";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { SyncProgress }: ClientComponents
) {
  const move = async (direction: Direction) => {
    // TODO
    return null as any;
  };

  const spawn = async (x: number, y: number) => {
    // TODO
    return null as any;
  };

  const throwBall = async () => {
    // TODO
    return null as any;
  };

  const fleeEncounter = async () => {
    // TODO
    return null as any;
  };

  return {
    move,
    spawn,
    throwBall,
    fleeEncounter,
  };
}
