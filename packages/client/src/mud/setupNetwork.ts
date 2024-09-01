import { publicClient, write$ } from "./account"
import { networkConfig } from "./networkConfig"
import { WalletClientWithAccount } from "./types"
import { world } from "./world";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { Entity } from "@latticexyz/recs"
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs";
import { share } from "rxjs";

/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import { Hex, getContract } from "viem"

/*
 * Import our MUD config, which includes strong types for
 * our tables and other config options. We use this to generate
 * things like RECS components and get back strong types for them.
 *
 * See https://mud.dev/templates/typescript/contracts#mudconfigts
 * for the source of this information.
 */
import mudConfig from "contracts/mud.config";

/**
 * Network configured without a wallet.
 */
export type NetworkWithoutAccount = Awaited<ReturnType<typeof setupNetwork>>;

/**
 * Network configured with a wallet.
 */
export type Network = NetworkWithoutAccount & {
  walletClient?: WalletClientWithAccount
  playerEntity?: Entity
};

/**
 * Type of the world contract bojec tin read-write mode.
 */
export type WorldContractWrite = ReturnType<typeof getWorldContract<WalletClientWithAccount>>;

/**
 * Creates the world contract object to communicate with the deployed World, in read or read-write
 * mode if a wallet is passed.
 *
 * Isolate this in its own function to get access to its complex return
 * type.
 */
function getWorldContract<T extends WalletClientWithAccount | undefined>(walletClient: T) {
  return getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    client: { public: publicClient, wallet: walletClient },
  });
}

/**
 * Sets up the network for the MUD client, potentially before a user/wallet is available.
 */
export async function setupNetwork(walletClient?: WalletClientWithAccount) {

  const worldContract = getWorldContract(walletClient);

  /*
   * Sync on-chain state into RECS and keeps our client in sync.
   * Uses the MUD indexer if available, otherwise falls back
   * to the viem publicClient to make RPC calls to fetch MUD
   * events from the chain.
   */
  const { components, latestBlock$, storedBlockLogs$, waitForTransaction } = await syncToRecs({
    world,
    config: mudConfig,
    address: networkConfig.worldAddress as Hex,
    publicClient,
    startBlock: BigInt(networkConfig.initialBlockNumber),
  });

  return {
    world,
    components,
    publicClient,
    latestBlock$,
    storedBlockLogs$,
    waitForTransaction,
    worldContract,
    write$: write$.asObservable().pipe(share()),
  };
}

/**
 * Configures the network with the wallet client, if available.
 * Does not modify the original network object.
 */
export function configureNetworkWithWallet(
  network: NetworkWithoutAccount,
  walletClient?: WalletClientWithAccount
): Network {

  const playerEntity = walletClient
    ? encodeEntity({ address: "address" }, { address: walletClient.account.address })
    : undefined;

  const worldContract = getWorldContract(walletClient);

  return { ...network, walletClient, playerEntity, worldContract };
}