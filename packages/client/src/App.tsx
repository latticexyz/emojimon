import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";

export const App = () => {
  const { components, systems, singletonEntity, singletonEntityId } = useMUD();
  const counter = useComponentValue(components.Counter, singletonEntity);
  return (
    <>
      <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        className="border"
        onClick={(event) => {
          event.preventDefault();
          systems["system.Increment"].executeTyped(singletonEntityId);
        }}
      >
        Increment
      </button>
    </>
  );
};
