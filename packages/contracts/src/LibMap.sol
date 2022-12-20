// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { Coord } from "components/PositionComponent.sol";

library LibMap {
  function distance(Coord memory from, Coord memory to) internal pure returns (int32) {
    int32 deltaX = from.x > to.x ? from.x - to.x : to.x - from.x;
    int32 deltaY = from.y > to.y ? from.y - to.y : to.y - from.y;
    return deltaX + deltaY;
  }
}
