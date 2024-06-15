import { Settings } from "shared/settings";
import * as Status from "shared/status";
import { Players } from "@rbxts/services";
import * as Events from "server/Modules/events";
import { Utils } from "server/Utils/getUtils";

const getNumPlayers = () => Players.GetChildren().size();
const enoughPlayers = () => getNumPlayers() >= 2;
const updateRoundState = (state: string) => { /*SharedRoundConfig.SetAttribute("State", state);*/ };

const enoughPlayersPromise = (): Promise<unknown> => 
    enoughPlayers() ? Promise.resolve(true) : Promise.fromEvent(Players.ChildAdded, () => enoughPlayers());

const notEnoughPlayersPromise = (): Promise<unknown> => 
    !enoughPlayers() ? Promise.resolve(true) : Promise.fromEvent(Players.ChildRemoved, () => !enoughPlayers());

const gameLoop = () => {
    print('Running');
    updateRoundState("In Game");
    task.wait(5);
    waitForPlayers();
};

const intermission = () => {
    print("Intermission");
    updateRoundState("Intermission");

    const Timer = new Utils.Timer.NewTimer( 5, (TimeLeft) => {
        print(TimeLeft)
    } )

    Promise.race([
        notEnoughPlayersPromise().then(() => {
            Timer.cancel()
            return Promise.resolve("Return")
        }),
        
        new Promise((Resolve) => {
            Timer.promise.await()
            Resolve("Yes")
        }).then(() => Promise.resolve("Start")),
        
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

export const startGameLoop = () => {
    waitForPlayers();
};

