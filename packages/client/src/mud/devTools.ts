import mudConfig from "contracts/mud.config"
import { useEffect, useRef } from "react"
import { Destructor, MUDInterface, noop } from "./types"

const noopPromise = Promise.resolve(noop);

/**
 * Mounts the dev tools in development mode.
 */
export function useDevTools(mud?: MUDInterface) {
  const unmountDevtoolsPromise = useRef(noopPromise);

  useEffect(() => {
    if (!mud) return noop;

    unmountDevtoolsPromise.current.then(async (unmount) => {
      unmount()
      unmountDevtoolsPromise.current = mountDevTools(mud);
    })

    return () => {
      unmountDevtoolsPromise.current.then(async (unmount) => {
        unmount()
        unmountDevtoolsPromise.current = noopPromise;
      });
    }
  }, [mud]);
}

async function mountDevTools(mud: MUDInterface): Promise<Destructor> {
  if (!import.meta.env.DEV) return noop;

  // Avoid loading when not in dev mode.
  const { mount } = await import("@latticexyz/dev-tools");

  return await mount({
    config: mudConfig,
    publicClient: mud.network.publicClient,
    walletClient: mud.network.walletClient!, // this will work even if undefined
    latestBlock$: mud.network.latestBlock$,
    storedBlockLogs$: mud.network.storedBlockLogs$,
    worldAddress: mud.network.worldContract.address,
    worldAbi: mud.network.worldContract.abi,
    write$: mud.network.write$,
    recsWorld: mud.network.world,
  }) ?? noop;
}

