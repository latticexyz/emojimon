// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { Uint32Component } from "std-contracts/components/Uint32Component.sol";
import { MonsterType } from "../MonsterType.sol";

uint256 constant ID = uint256(keccak256("component.MonsterType"));

contract MonsterTypeComponent is Uint32Component {
  constructor(address world) Uint32Component(world, ID) {}

  function set(uint256 entity, MonsterType value) public {
    set(entity, abi.encode(value));
  }

  function getValueTyped(uint256 entity) public view returns (MonsterType) {
    return abi.decode(getRawValue(entity), (MonsterType));
  }
}
