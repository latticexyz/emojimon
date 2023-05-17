// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Encounter, EncounterData, Encounterable, EncounterTrigger, MapConfig, Monster, Movable, Obstruction, Player, Position } from "../codegen/index.sol";
import { Direction, MonsterType } from "../codegen/common.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";

contract MapSystem is System {
  function spawn(int32 x, int32 y) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(!Player.get(player), "already spawned");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get();
    x = (x + int32(width)) % int32(width);
    y = (y + int32(height)) % int32(height);

    bytes32 position = positionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");

    Player.set(player, true);
    Position.set(player, x, y);
    Movable.set(player, true);
    Encounterable.set(player, true);
  }

  function move(Direction direction) public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(Movable.get(player), "cannot move");
    require(!Encounter.getExists(player), "cannot move during an encounter");

    (int32 x, int32 y) = Position.get(player);
    if (direction == Direction.North) {
      y -= 1;
    } else if (direction == Direction.East) {
      x += 1;
    } else if (direction == Direction.South) {
      y += 1;
    } else if (direction == Direction.West) {
      x -= 1;
    }

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get();
    x = (x + int32(width)) % int32(width);
    y = (y + int32(height)) % int32(height);

    bytes32 position = positionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");

    Position.set(player, x, y);

    if (Encounterable.get(player) && EncounterTrigger.get(position)) {
      uint256 rand = uint256(keccak256(abi.encode(player, position, blockhash(block.number - 1), block.prevrandao)));
      if (rand % 5 == 0) {
        startEncounter(player);
      }
    }
  }

  function startEncounter(bytes32 player) internal {
    bytes32 monster = keccak256(abi.encode(player, blockhash(block.number - 1), block.prevrandao));
    MonsterType monsterType = MonsterType((uint256(monster) % uint256(type(MonsterType).max)) + 1);
    Monster.set(monster, monsterType);
    Encounter.set(player, EncounterData({exists: true, monster: monster, catchAttempts: 0}));
  }
}
