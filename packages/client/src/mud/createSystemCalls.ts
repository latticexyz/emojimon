import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { uuid, awaitStreamValue } from "@latticexyz/utils";
import { MonsterCatchResult } from "../monsterCatchResult";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
 
export type SystemCalls = ReturnType<typeof createSystemCalls>;
 
export function createSystemCalls(
  { playerEntity, singletonEntity, worldSend, txReduced$ }: SetupNetworkResult,
  { Encounter, MapConfig, MonsterCatchAttempt, Obstruction, Player, Position }: ClientComponents
) {
  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(MapConfig, singletonEntity);
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [(x + mapConfig.width) % mapConfig.width, (y + mapConfig.height) % mapConfig.height];
  };
 
  const isObstructed = (x: number, y: number) => {
    return runQuery([Has(Obstruction), HasValue(Position, { x, y })]).size > 0;
  };
 
  const moveTo = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
 
    const inEncounter = !!getComponentValue(Encounter, playerEntity);
    if (inEncounter) {
      console.warn("cannot move while in encounter");
      return;
    }
 
    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot move to obstructed space");
      return;
    }
 
    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
 
    try {
      const tx = await worldSend("move", [x, y]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      Position.removeOverride(positionId);
    }
  };
 
  const moveBy = async (deltaX: number, deltaY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
 
    const playerPosition = getComponentValue(Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }
 
    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };
 
  const spawn = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
 
    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }
 
    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot spawn on obstructed space");
      return;
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
      const tx = await worldSend("spawn", [x, y]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      Position.removeOverride(positionId);
      Player.removeOverride(playerId);
    }
  };
 
  const throwBall = async () => {
    const player = playerEntity;
    if (!player) {
      throw new Error("no player");
    }
 
    const encounter = getComponentValue(Encounter, player);
    if (!encounter) {
      throw new Error("no encounter");
    }
 
    const tx = await worldSend("throwBall", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
 
    const catchAttempt = getComponentValue(MonsterCatchAttempt, player);
    if (!catchAttempt) {
      throw new Error("no catch attempt found");
    }
 
    return catchAttempt.result as MonsterCatchResult;
  };
 
  const fleeEncounter = async () => {
    const tx = await worldSend("flee", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };
 
  return {
    moveTo,
    moveBy,
    spawn,
    throwBall,
    fleeEncounter,
  };
}