import { Settings } from "shared/settings";
import * as Status from "shared/status";
import { Players } from "@rbxts/services";
import * as Events from "server/events";

const getNumPlayers = () => Players.GetChildren().size();
const enoughPlayers = () => getNumPlayers() >= 2;
const updateRoundState = (state: string) => { /*SharedRoundConfig.SetAttribute("State", state);*/ };

const enoughPlayersPromise = (): Promise<unknown> => 
    enoughPlayers() ? Promise.resolve(true) : Promise.fromEvent(Players.ChildAdded, () => enoughPlayers());

const notEnoughPlayersPromise = (): Promise<unknown> => 
    !enoughPlayers() ? Promise.resolve(true) : Promise.fromEvent(Players.ChildRemoved, () => !enoughPlayers());

const gameLoop = () => {
    print('Running');
    updateRoundState("InGame");
    task.wait(5);
    waitForPlayers();
};

const intermission = () => {
    print("Intermission");
    updateRoundState("Intermission");

    Promise.race([
        notEnoughPlayersPromise().then(() => Promise.resolve("Return")),
        Promise.delay(5).then(() => Promise.resolve("Start")),
    ])
    .then((message) => {
        if (message === "Start") {
            gameLoop();
        } else {
            waitForPlayers();
        }
    });
};

const waitForPlayers = async () => {
    print("Waiting for players");
    updateRoundState("Waiting For Players");
    enoughPlayersPromise().then(intermission);
};

waitForPlayers().expect();
