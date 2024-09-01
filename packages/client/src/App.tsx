import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { LoadingWrapper } from "./LoadingWrapper";
import { createBurnerWalletClient } from "./mud/account";
import { useDevTools } from "./mud/devTools";
import { useFaucet } from "./mud/faucet";
import { useSetup } from "./mud/setup";
import { WalletClientWithAccount } from "./mud/types";
import { MUDProvider } from "./MUDContext";

const walletClient = createBurnerWalletClient()

export const App = () => {
  const [wallet, setWallet] = useState<WalletClientWithAccount | undefined>();
  const mud = useSetup(wallet);
  useFaucet(wallet?.account.address);
  useDevTools(mud);

  const connect = () => setWallet(walletClient);
  const disconnect = () => setWallet(undefined);

  return mud
    ? <MUDProvider value={mud}>
        <div style={{ position: "absolute", top: "0", right: "0", padding: "20px" }}>
          {!wallet
            ? <button onClick={connect} style={{ cursor: "pointer" }}>Connect</button>
            : <button onClick={disconnect} style={{ cursor: "pointer" }}>Disconnect</button>}
        </div>
        <LoadingWrapper/>;
        <ToastContainer position="bottom-right" draggable={false} theme="dark"/>
      </MUDProvider>
    : <div className="w-screen h-screen flex items-center justify-center">
        <div>Setting up ...</div>
      </div>
};
