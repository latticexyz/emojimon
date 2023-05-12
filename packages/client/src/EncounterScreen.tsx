import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { Entity } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { MonsterType, monsterTypes } from "./monsterTypes";

type Props = {
  monsters: Entity[];
};

export const EncounterScreen = ({ monsters }: Props) => {
  const {
    components: { Monster },
    api: { throwBall, fleeEncounter },
  } = useMUD();

  // Just one monster for now
  const monster = monsters[0];

  const monsterType =
    monsterTypes[useComponentValue(Monster, monster)?.value as MonsterType];

  // const monster = useEntityQuery([
  //   HasValue(Encounter, { value: encounterId }),
  //   Has(MonsterType),
  // ]).map((entity) => {
  //   const monsterType = getComponentValueStrict(MonsterType, entity)
  //     .value as MonsterType;
  //   return {
  //     entity,
  //     entityId: world.entities[entity],
  //     monster: monsterTypes[monsterType],
  //   };
  // })[0];

  // if (!monster) {
  //   throw new Error("No monster found in encounter");
  // }

  const [appear, setAppear] = useState(false);
  useEffect(() => {
    setAppear(true);
  }, []);

  return (
    <div
      className={twMerge(
        "flex flex-col gap-10 items-center justify-center bg-black text-white transition-opacity duration-1000",
        appear ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-8xl animate-bounce">{monsterType.emoji}</div>
      <div>A wild {monsterType.name} appears!</div>

      <div className="flex gap-2">
        <button
          type="button"
          className="bg-stone-600 hover:ring rounded-lg px-4 py-2"
          onClick={async () => {
            const toastId = toast.loading("Throwing emojiball…");
            const status = await throwBall();
            if (status === "caught") {
              toast.update(toastId, {
                isLoading: false,
                type: "success",
                render: `You caught the ${monsterType.name}!`,
                autoClose: 5000,
                closeButton: true,
              });
            } else if (status === "fled") {
              toast.update(toastId, {
                isLoading: false,
                type: "error",
                render: `Oh no, the ${monsterType.name} fled!`,
                autoClose: 5000,
                closeButton: true,
              });
            } else {
              toast.update(toastId, {
                isLoading: false,
                type: "error",
                render: "You missed!",
                autoClose: 5000,
                closeButton: true,
              });
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
