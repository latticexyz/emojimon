// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { BoolComponent } from "std-contracts/components/BoolComponent.sol";

uint256 constant ID = uint256(keccak256("component.Obstruction"));

contract ObstructionComponent is BoolComponent {
  constructor(address world) BoolComponent(world, ID) {}
}
