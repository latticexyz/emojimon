import {
  EntityID,
  getComponentValueStrict,
  Has,
  HasValue,
} from "@latticexyz/recs";
import { useEntityQuery } from "./useEntityQuery";
import { useMUD } from "./MUDContext";
import { useEffect, useMemo, useState } from "react";
import { MonsterType, monsterTypes } from "./monsterTypes";
import { toast } from "react-toastify";

type Props = {
  encounterId: EntityID;
};

export const EncounterScreen = ({ encounterId }: Props) => {
  const {
    components: { Encounter, MonsterType },
    systems,
    world,
    systemCallStreams,
  } = useMUD();

  const monsters = useEntityQuery(
    useMemo(
      () => [HasValue(Encounter, { value: encounterId }), Has(MonsterType)],
      [Encounter, MonsterType, encounterId]
    )
  ).map((entity) => {
    const monsterType = getComponentValueStrict(MonsterType, entity)
      .value as MonsterType;
    return {
      entity,
      entityId: world.entities[entity],
      monster: monsterTypes[monsterType],
    };
  });

  // TODO: better transition in
  const [appear, setAppear] = useState(false);
  useEffect(() => {
    setAppear(true);
  }, []);

  return (
    <div
      className={`flex flex-col gap-10 items-center justify-center bg-black text-white transition-opacity duration-1000 ${
        appear ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-8xl animate-bounce">
        {monsters[0].monster.emoji}
      </span>
      A wild {monsters[0].monster.name} appears!
      <span className="flex gap-2">
        <button
          type="button"
          className="bg-stone-600 hover:ring rounded-lg px-4 py-2"
          onClick={async () => {
            const toastId = toast.loading("Throwing emojiball…");
            const tx = await systems["system.EncounterThrow"].executeTyped(
              encounterId,
              monsters[0].entityId
            );
            systemCallStreams["system.EncounterThrow"].subscribe(
              (systemCall) => {
                if (systemCall.tx.hash !== tx.hash) return;

                const isCaught = systemCall.updates.some(
                  (update) =>
                    update.component.metadata?.contractId ===
                    "component.OwnedBy"
                );
                const hasFled =
                  !isCaught &&
                  systemCall.updates.some(
                    (update) =>
                      update.component.metadata?.contractId ===
                      "component.Encounter"
                  );

                if (isCaught) {
                  toast.update(toastId, {
                    isLoading: false,
                    type: "success",
                    render: `You caught the ${monsters[0].monster.name}!`,
                    autoClose: 5000,
                    closeButton: true,
                  });
                } else if (hasFled) {
                  toast.update(toastId, {
                    isLoading: false,
                    type: "error",
                    render: `Oh no, the ${monsters[0].monster.name} fled!`,
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
              }
            );
          }}
        >
          ☄️ Throw
        </button>
        <button
          type="button"
          className="bg-stone-800 hover:ring rounded-lg px-4 py-2"
        >
          🏃‍♂️ Run
        </button>
      </span>
    </div>
  );
};
