import {
  Browser as ECSBrowser,
  createBrowserDevComponents,
} from "@latticexyz/ecs-browser";
import { Layer } from "@latticexyz/recs";
import { useEffect, useState } from "react";
import { useMUD } from "./MUDContext";
import { twMerge } from "tailwind-merge";

export const ComponentBrowser = () => {
  const { world, components } = useMUD();
  const layer: Layer = { world, components };
  const browserComponents = createBrowserDevComponents(world);

  const [shown, setShown] = useState(false);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "`") {
        setShown(!shown);
      }
    };
    window.addEventListener("keypress", listener);
    return () => window.removeEventListener("keypress", listener);
  });

  return (
    <>
      {shown ? (
        <div className="fixed right-0 inset-y-0 w-96">
          <ECSBrowser
            world={world}
            layers={{ react: layer }}
            devHighlightComponent={browserComponents.devHighlightComponent}
            hoverHighlightComponent={browserComponents.hoverHighlightComponent}
          />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setShown(!shown)}
        className={twMerge(
          "fixed right-0 bottom-0 flex items-center justify-center gap-2 m-4 text-sm p-2 rounded leading-none opacity-50 hover:opacity-100",
          shown ? "bg-black text-white hover:bg-slate-600" : null
        )}
      >
        ECS Browser{" "}
        <code className="bg-black/20 p-1 rounded text-mono text-xs leading-none">
          `
        </code>
      </button>
    </>
  );
};
