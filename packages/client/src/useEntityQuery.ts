import { defineQuery, EntityQueryFragment } from "@latticexyz/recs";
import { useEffect, useMemo, useState } from "react";

// the MUD `useQuery` has some shortcomings, so we're reimplementing it here

export function useEntityQuery(queryFragments: EntityQueryFragment[]) {
  const queryResult = useMemo(
    () => defineQuery(queryFragments, { runOnInit: true }),
    [queryFragments]
  );
  const [matching, setMatching] = useState([...queryResult.matching]);

  useEffect(() => {
    const subscription = queryResult.update$.subscribe(() => {
      setMatching([...queryResult.matching]);
    });
    return () => subscription.unsubscribe();
  }, [queryResult]);

  return matching;
}
