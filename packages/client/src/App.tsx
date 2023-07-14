import { useComponentValue } from "@latticexyz/react";
import { SyncState } from "@latticexyz/network";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";
import { useState } from "react";
import { TerrainStyle } from "./terrainTypes";

export const App = () => {
  const {
    components: { LoadingState },
    network: { singletonEntity },
  } = useMUD();

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  const [terrainStyle, setTerrainStyle] = useState<TerrainStyle | undefined>(undefined);

  const selectTerrainStyle = (selection: TerrainStyle) => {
    setTerrainStyle(selection);
  }

  const terrainStyleSelector = () => {
    return (
      <>
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
          <div onClick={() => selectTerrainStyle(TerrainStyle.FieldAndStone)}>
              <img className="rounded-t-lg" src="../images/fieldandstone.png" alt="" />
          </div>
          <div className="p-5">
              <div onClick={() => selectTerrainStyle(TerrainStyle.FieldAndStone)}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">🌳 Field And Stone 🪨</h5>
              </div>
          </div>
        </div>
        <div className="w-5"></div>    
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
          <div onClick={() => selectTerrainStyle(TerrainStyle.FireAndWater)}>
              <img className="rounded-t-lg" src="../images/fireandwater.png" alt="" />
          </div>
          <div className="p-5">
              <div onClick={() => selectTerrainStyle(TerrainStyle.FireAndWater)}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">🔥 Fire And Water 💧</h5>
              </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {loadingState.state !== SyncState.LIVE &&
        (<div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>)
      }
      {(terrainStyle === undefined && loadingState.state === SyncState.LIVE) && (
        terrainStyleSelector()
      )}
      {terrainStyle !== undefined &&  <GameBoard terrainStyle={terrainStyle} />}
    </div>
  );
};
