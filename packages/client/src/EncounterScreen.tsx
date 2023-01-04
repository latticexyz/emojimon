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

type Props = {
  encounterId: EntityID;
};

export const EncounterScreen = ({ encounterId }: Props) => {
  const {
    components: { Encounter, MonsterType },
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
