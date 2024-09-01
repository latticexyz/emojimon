import { createContext, ReactNode, useContext } from "react";
import { MUDInterface } from "./mud/types"

const MUDContext = createContext<MUDInterface | null>(null);

type Props = {
  children: ReactNode;
  value: MUDInterface;
};

export const MUDProvider = ({ children, value }: Props) => {
  const currentValue = useContext(MUDContext);
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider value={value}>{children}</MUDContext.Provider>;
};

export const useMUD = () => {
  const value = useContext(MUDContext);
  if (!value) throw new Error("Must be used within a MUDProvider");
  return value;
};
