import { useEffect } from "react"
import { noop } from "rxjs"
import { Address, parseEther } from "viem"
import { publicClient } from "./account"
import { networkConfig } from "./networkConfig"
import { Destructor } from "./types"
import { createFaucetService } from "@latticexyz/services/faucet";

/*
 * If there is a faucet, request (test) ETH if you have less than 1 ETH.
 * Repeat every 20 seconds to ensure you don't run out.
 */
export function useFaucet(address?: Address) {
  return useEffect(() => {
    if (!address) return noop;
    const stopFaucet = startFaucet(address);
    return () => {
      stopFaucet();
    };
  }, [address]);
}

function startFaucet(address: Address): Destructor {
  if (!address || !networkConfig.faucetServiceUrl) return noop;

  console.info("[Dev Faucet]: Player address -> ", address);

  const faucet = createFaucetService(networkConfig.faucetServiceUrl);

  const requestDrip = async () => {
    const balance = await publicClient.getBalance({ address });
    console.info(`[Dev Faucet]: Player balance -> ${balance}`);
    const lowBalance = balance < parseEther("1");
    if (lowBalance) {
      console.info("[Dev Faucet]: Balance is low, dripping funds to player");
      // Double drip
      await faucet.dripDev({ address });
      await faucet.dripDev({ address });
    }
  };

  // Request a drip now, then every 20 seconds
  void requestDrip();
  const interval = setInterval(requestDrip, 20000);

  return () => clearInterval(interval);
}