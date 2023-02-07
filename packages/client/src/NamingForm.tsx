import { useMUD } from "./MUDContext";
import { useState } from "react";

export const NamingForm = () => {
    const {
        playerEntity,
        systems,
        world
    } = useMUD();

    const [playerName, setPlayerName] = useState("");

    const onChangeHandler = (event: any) => {
        setPlayerName(event.target.value);
    };

    const nameTo = async () => {
        await systems["system.Naming"].executeTyped(world.entities[playerEntity], playerName);
    };

    return (
        <div className="m-2 p-2 bg-slate-700">
            <div className="text-2xl">Rename Player</div>
            <input
                type="text"
                name="name"
                className="text-slate-900"
                onChange={onChangeHandler}
                value={playerName}
                placeholder="Enter player name"
            />
            <button onClick={nameTo}>Confirm</button>
        </div>
    );
};