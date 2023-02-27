import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  EntityID,
  getComponentValueStrict,
  Has,
  HasValue,
} from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { MonsterType, monsterTypes } from "./monsterTypes";

type Props = {
  encounterId: EntityID;
};

export const EncounterScreen = ({ encounterId }: Props) => {
  const {
    world,
    components: { Encounter, MonsterType },
  } = useMUD();

  const monster = useEntityQuery([
    HasValue(Encounter, { value: encounterId }),
    Has(MonsterType),
  ]).map((entity) => {
    const monsterType = getComponentValueStrict(MonsterType, entity)
      .value as MonsterType;
    return {
      entity,
      entityId: world.entities[entity],
      monster: monsterTypes[monsterType],
    };
  })[0];

  if (!monster) {
    throw new Error("No monster found in encounter");
  }

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
      <div className="text-8xl animate-bounce">{monster.monster.emoji}</div>
      <div>A wild {monster.monster.name} appears!</div>
    </div>
  );
};
