import { useMUD } from "./MUDContext";
import { useMemo } from "react";
import { getComponentValueStrict, HasValue } from "@latticexyz/recs";
import { useEntityQuery } from "./useEntityQuery";
import { MonsterType, monsterTypes } from "./monsterTypes";

export const Inventory = () => {
  const {
    components: { MonsterType, OwnedBy },
    world,
    playerEntity
  } = useMUD();

  const emojimons = useEntityQuery(
    useMemo(() => [HasValue(OwnedBy, { value: world.entities[playerEntity] })], [OwnedBy])
  )
    .map((entity) => {
      const monsterType = getComponentValueStrict(MonsterType, entity);
      return {
        entity,
        monsterType
      };
    });

  return (
    <div className="m-2 p-2 bg-slate-500">
      <div className="text-2xl">My Emojimons</div>
      {emojimons.map(e => {
        const monsterConfig = monsterTypes[e.monsterType.value as MonsterType]

        return <div key={e.entity} className="border-2 rounded-md border-slate-800 p-1">
          {monsterConfig.emoji} {monsterConfig.name} #{world.entities[e.entity].slice(0, 5)}
        </div>
      })}
    </div>
  );
};