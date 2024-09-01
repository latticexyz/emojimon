import { WalletClient, Transport, Chain, Account } from "viem";
import { ClientComponents } from "./createClientComponents"
import { SystemCalls } from "./createSystemCalls"
import { Network } from "./setupNetwork"

/**
 * Type for cleanups, unsubscribes, ...
 */
export type Destructor = () => void;

/**
 * No-arg function that does nothing, good for default destructor values.
 */
export const noop = () => {};

/**
 * Type of a wallet client that has its account set.
 */
export type WalletClientWithAccount = WalletClient<Transport, Chain, Account>;

/**
 * This is the type of the value returned by useMUD().
 */
export type MUDInterface = {
  network: Network
  components: ClientComponents
  systemCalls?: SystemCalls
}