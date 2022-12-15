import { useComponentValueStream } from "@latticexyz/std-client";
import { useMUD } from "./MUDContext";

export const App = () => {
  const { components, systems, singletonEntity, singletonEntityId } = useMUD();
  const counter = useComponentValueStream(components.Counter, singletonEntity);
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
