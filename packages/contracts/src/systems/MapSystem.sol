// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Position, Player, Encounter, Movable, Obstruction, Encounterable, EncounterTrigger, MapConfig, Monster } from "../codegen/Tables.sol";
import { MonsterType } from "../codegen/Types.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";

contract MapSystem is System {
  uint256 internal entropyNonce = 0;

  function spawn(uint32 x, uint32 y) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(!Player.get(player), "already spawned");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get();
    x = x + (width % width);
    y = y + (height % height);

    bytes32 position = positionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");

    Player.set(player, true);
    Position.set(player, x, y);
    Movable.set(player, true);
    Encounterable.set(player, true);
  }

  function move(uint32 x, uint32 y) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(Movable.get(player), "cannot move");

    (uint32 fromX, uint32 fromY) = Position.get(player);
    require(distance(fromX, fromY, x, y) == 1, "can only move to adjacent spaces");

    uint256 actionCount = Encounter.getActionCount(player);
    require(actionCount == 0, "cannot move during an encounter");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get();
    x = x + (width % width);
    y = y + (height % height);

    bytes32 position = positionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");

    Position.set(player, x, y);

    // TODO: move to EncounterSystem?
    if (Encounterable.get(player) && EncounterTrigger.get(position)) {
      uint256 rand = uint256(keccak256(abi.encode(++entropyNonce, player, position, block.difficulty)));
      if (rand % 5 == 0) {
        startEncounter(player);
      }
    }
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }

  // TODO: move to EncounterSystem?
  function startEncounter(bytes32 player) internal {
    bytes32 monster = keccak256(abi.encode(++entropyNonce, player, block.difficulty));
    MonsterType monsterType = MonsterType((uint256(monster) % uint256(type(MonsterType).max)) + 1);
    Monster.set(monster, monsterType);

    bytes32[] memory monsters = new bytes32[](1);
    monsters[0] = monster;
    Encounter.set(player, 1, monsters);
  }
}
