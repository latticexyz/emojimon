// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

function positionToEntityKey(int32 x, int32 y) pure returns (bytes32) {
  return keccak256(abi.encode(x, y));
}
