/*
 * This file sets up all the definitions required for a MUD client.
 */

import { useEffect, useRef, useState } from "react"
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { configureNetworkWithWallet, Network, setupNetwork } from "./setupNetwork"
import { MUDInterface, WalletClientWithAccount } from "./types"

/**
 * Sets up MUD before loading the game, providing the value to be returned by `useMUD`.
 * This also reruns whenever a new wallet is passed, configuring the mud value with the new wallet.
 */
export function useSetup(walletClient?: WalletClientWithAccount): MUDInterface | undefined {
  // Cache the MUD value and the wallet, only rerender when MUD gets its initial value.
  // We also update the value when passed a new wallet (which triggered a rerender upstream).

  const [, rerender] = useState({});
  const mud = useRef<MUDInterface | undefined>();
  const wallet = useRef(walletClient);

  useEffect(() => {
    setup().then(mudVal => {
      mud.current = configureMudWithWallet(mudVal, wallet.current);
      rerender({});
    });
  }, []);

  if (walletClient !== wallet.current) {
    wallet.current = walletClient;
    mud.current = configureMudWithWallet(mud.current, walletClient);
  }

  return mud.current;
}

async function setup(): Promise<MUDInterface> {
  const network = await setupNetwork() satisfies Network;
  const components = createClientComponents(network);

  return {
    network,
    components
  };
}

function configureMudWithWallet(
  mud?: MUDInterface,
  wallet?: WalletClientWithAccount
): MUDInterface | undefined {
  if (!mud || !wallet) return mud
  const network = configureNetworkWithWallet(mud.network, wallet)
  const systemCalls = createSystemCalls(network, mud.components)
  return {
    ...mud,
    network,
    systemCalls
  }
}