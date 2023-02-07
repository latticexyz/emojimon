// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { NameComponent, ID as NameComponentID } from "components/NameComponent.sol";

uint256 constant ID = uint256(keccak256("system.Naming"));

contract NamingSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256 monsterId, string memory monsterName) = abi.decode(args, (uint256, string));
    return executeTyped(monsterId, monsterName);
  }

  function executeTyped(uint256 monsterId, string memory monsterName) public returns (bytes memory) {
    NameComponent name = NameComponent(getAddressById(components, NameComponentID));
    
    name.set(monsterId, monsterName);
  }
}
