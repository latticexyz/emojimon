import { overridableComponent } from "@latticexyz/recs";
import { NetworkWithoutAccount } from "./setupNetwork"

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ components }: NetworkWithoutAccount) {
  return {
    ...components,
    Player: overridableComponent(components.Player),
    Position: overridableComponent(components.Position),
  };
}
