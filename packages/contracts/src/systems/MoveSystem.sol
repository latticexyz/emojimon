// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { MovableComponent, ID as MovableComponentID } from "components/MovableComponent.sol";
import { EncounterableComponent, ID as EncounterableComponentID } from "components/EncounterableComponent.sol";
import { EncounterComponent, ID as EncounterComponentID } from "components/EncounterComponent.sol";
import { MonsterTypeComponent, ID as MonsterTypeComponentID } from "components/MonsterTypeComponent.sol";
import { MapConfigComponent, ID as MapConfigComponentID, MapConfig } from "components/MapConfigComponent.sol";
import { LibMap } from "../LibMap.sol";
import { MonsterType } from "../MonsterType.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  uint256 internal entropyNonce = 1;

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    return executeTyped(abi.decode(args, (Coord)));
  }

  function executeTyped(Coord memory coord) public returns (bytes memory) {
    uint256 entityId = addressToEntity(msg.sender);

    MovableComponent movable = MovableComponent(getAddressById(components, MovableComponentID));
    require(movable.has(entityId), "cannot move");

    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));
    require(LibMap.distance(position.getValue(entityId), coord) == 1, "can only move to adjacent spaces");

    EncounterComponent encounter = EncounterComponent(getAddressById(components, EncounterComponentID));
    require(!encounter.has(entityId), "cannot move during an encounter");

    // Constrain position to map size, wrapping around if necessary
    MapConfig memory mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID)).getValue();
    coord.x = (coord.x + int32(mapConfig.width)) % int32(mapConfig.width);
    coord.y = (coord.y + int32(mapConfig.height)) % int32(mapConfig.height);

    require(LibMap.obstructions(world, coord).length == 0, "this space is obstructed");

    position.set(entityId, coord);

    if (canTriggerEncounter(entityId, coord)) {
      // 20% chance to trigger encounter
      uint256 rand = uint256(keccak256(abi.encode(++entropyNonce, entityId, coord, block.difficulty)));
      if (rand % 5 == 0) {
        startEncounter(entityId, rand);
      }
    }
  }

  function canTriggerEncounter(uint256 entityId, Coord memory coord) internal view returns (bool) {
    return
      // Check if entity can be encountered
      EncounterableComponent(getAddressById(components, EncounterableComponentID)).has(entityId) &&
      // Check if there are any encounter triggers at the entity's position
      LibMap.encounterTriggers(world, coord).length > 0;
  }

  function startEncounter(uint256 entityId, uint256 rand) internal returns (uint256) {
    uint256 encounterId = world.getUniqueEntityId();
    EncounterComponent encounter = EncounterComponent(getAddressById(components, EncounterComponentID));
    encounter.set(entityId, encounterId);

    uint256 monsterId = world.getUniqueEntityId();
    MonsterType monsterType = MonsterType((rand % uint256(type(MonsterType).max)) + 1);
    MonsterTypeComponent(getAddressById(components, MonsterTypeComponentID)).set(monsterId, monsterType);
    encounter.set(monsterId, encounterId);

    return encounterId;
  }
}
