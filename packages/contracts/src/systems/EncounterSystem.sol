// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Player, Encounter, MonsterCatchAttempt, OwnedBy, Monster } from "../codegen/Tables.sol";
import { MonsterCatchResult } from "../codegen/Types.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract EncounterSystem is System {
  uint256 internal entropyNonce = 0;

  function throwBall() public {
    bytes32 player = addressToEntityKey(_msgSender());

    (uint256 actionCount, bytes32[] memory monsters) = Encounter.get(player);
    require(actionCount != 0, "not in this encounter");

    // TODO: support multiple monsters? i.e. throw at a specific monster
    bytes32 monster = monsters[0];

    uint256 rand = uint256(keccak256(abi.encode(player, monster, actionCount, block.difficulty)));
    if (rand % 2 == 0) {
      // 50% chance to catch monster
      MonsterCatchAttempt.emitEphemeral(player, monster, MonsterCatchResult.Caught);
      OwnedBy.set(monster, player);
      Encounter.deleteRecord(player);
    } else if (actionCount > 2) {
      // Missed 2 times, monster escapes
      MonsterCatchAttempt.emitEphemeral(player, monster, MonsterCatchResult.Fled);
      Encounter.deleteRecord(player);
      Monster.deleteRecord(monster);
    } else {
      // Throw missed!
      MonsterCatchAttempt.emitEphemeral(player, monster, MonsterCatchResult.Missed);
      Encounter.setActionCount(player, ++actionCount);
    }
  }

  function flee() public {
    bytes32 player = addressToEntityKey(_msgSender());
    Encounter.deleteRecord(player);
  }
}
