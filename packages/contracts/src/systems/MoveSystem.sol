// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    return executeTyped(abi.decode(args, (Coord)));
  }

  function executeTyped(Coord memory coord) public returns (bytes memory) {
    uint256 entityId = addressToEntity(msg.sender);

    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));
    position.set(entityId, coord);
  }
}
