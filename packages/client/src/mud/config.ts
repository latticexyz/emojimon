import { SetupContractConfig } from "@latticexyz/std-client";
import { getBurnerWallet } from "./getBurnerWallet";

const params = new URLSearchParams(window.location.search);

export const config: SetupContractConfig & { faucetServiceUrl?: string } = {
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl: params.get("rpc") ?? "http://localhost:8545",
    wsRpcUrl: params.get("wsRpc") ?? "ws://localhost:8545",
    chainId: Number(params.get("chainId")) || 31337,
  },
  privateKey: getBurnerWallet().privateKey,
  chainId: Number(params.get("chainId")) || 31337,
  snapshotServiceUrl: params.get("snapshot") ?? undefined,
  faucetServiceUrl: params.get("faucet") ?? undefined,
  initialBlockNumber: Number(params.get("initialBlockNumber")) || 0,
  worldAddress: params.get("worldAddress")!,
  devMode: params.get("dev") === "true",
};
