import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { useMUD } from "./MUDContext";
import { MonsterCatchResult } from "./monsterCatchResult";

type Props = {
  monsterName: string;
  monsterEmoji: string;
};

export const EncounterScreen = ({ monsterName, monsterEmoji }: Props) => {
  const {
    systemCalls: { throwBall, fleeEncounter },
  } = useMUD();

  const [appear, setAppear] = useState(false);
  useEffect(() => {
    // sometimes the fade-in transition doesn't play, so a timeout is a hacky fix
    const timer = setTimeout(() => setAppear(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={twMerge(
        "flex flex-col gap-10 items-center justify-center bg-black text-white transition-opacity duration-1000",
        appear ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-8xl animate-bounce">{monsterEmoji}</div>
      <div>A wild {monsterName} appears!</div>

      <div className="flex gap-2">
        <button
          type="button"
          className="bg-stone-600 hover:ring rounded-lg px-4 py-2"
          onClick={async () => {
            const toastId = toast.loading("Throwing emojiball…");
            const result = await throwBall();
            if (result === MonsterCatchResult.Caught) {
              toast.update(toastId, {
                isLoading: false,
                type: "success",
                render: `You caught the ${monsterName}!`,
                autoClose: 5000,
                closeButton: true,
              });
            } else if (result === MonsterCatchResult.Fled) {
              toast.update(toastId, {
                isLoading: false,
                type: "default",
                render: `Oh no, the ${monsterName} fled!`,
                autoClose: 5000,
                closeButton: true,
              });
            } else if (result === MonsterCatchResult.Missed) {
              toast.update(toastId, {
                isLoading: false,
                type: "error",
                render: "You missed!",
                autoClose: 5000,
                closeButton: true,
              });
            } else {
              throw new Error(
                `Unexpected catch attempt result: ${MonsterCatchResult[result]}`
              );
            }
          }}
        >
          ☄️ Throw
        </button>
        <button
          type="button"
          className="bg-stone-800 hover:ring rounded-lg px-4 py-2"
          onClick={async () => {
            const toastId = toast.loading("Running away…");
            await fleeEncounter();
            toast.update(toastId, {
              isLoading: false,
              type: "default",
              render: `You ran away!`,
              autoClose: 5000,
              closeButton: true,
            });
          }}
        >
          🏃‍♂️ Run
        </button>
      </div>
    </div>
  );
};
