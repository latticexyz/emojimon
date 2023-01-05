// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { EncounterComponent, ID as EncounterComponentID } from "components/EncounterComponent.sol";
import { CounterComponent, ID as CounterComponentID } from "components/CounterComponent.sol";
import { ID as MonsterTypeComponentID } from "components/MonsterTypeComponent.sol";
import { OwnedByComponent, ID as OwnedByComponentID } from "components/OwnedByComponent.sol";

uint256 constant ID = uint256(keccak256("system.EncounterThrow"));

contract EncounterThrowSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256 encounterId, uint256 monsterId) = abi.decode(args, (uint256, uint256));
    return executeTyped(encounterId, monsterId);
  }

  function executeTyped(uint256 encounterId, uint256 monsterId) public returns (bytes memory) {
    uint256 entityId = addressToEntity(msg.sender);

    EncounterComponent encounter = EncounterComponent(getAddressById(components, EncounterComponentID));
    require(encounter.getValue(entityId) == encounterId, "not in this encounter");
    require(encounter.getValue(monsterId) == encounterId, "monster not in this encounter");

    CounterComponent counter = CounterComponent(getAddressById(components, CounterComponentID));
    uint256 actionCount = counter.has(encounterId) ? counter.getValue(encounterId) : 0;
    counter.set(encounterId, ++actionCount);

    uint256 rand = uint256(keccak256(abi.encode(encounterId, entityId, monsterId, actionCount, block.difficulty)));
    if (rand % 2 == 0) {
      // 50% chance to catch monster
      OwnedByComponent ownedBy = OwnedByComponent(getAddressById(components, OwnedByComponentID));
      ownedBy.set(monsterId, entityId);
      encounter.remove(monsterId);
      encounter.remove(entityId);
    } else if (actionCount > 2) {
      // Missed 2 times, monster escapes
      encounter.remove(monsterId);
      encounter.remove(entityId);
    }
  }
}
