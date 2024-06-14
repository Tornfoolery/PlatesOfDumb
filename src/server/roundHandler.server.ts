import { Settings } from "shared/settings";
import * as Status from "shared/status";

import { Players } from "@rbxts/services";
import * as Events from "server/events";

const GetNumPlayers = () => Players.GetPlayers().size();

const enoughPlayers = () => GetNumPlayers() >= 2

const updateRoundState = (state: string) => {
	//SharedRoundConfig.SetAttribute("State", state);
}

const getRandomGameMode = () => {
    //todo
}

// Promises
const enoughPlayersPromise = (): Promise<unknown> => {
	if (enoughPlayers()) {
		return Promise.resolve(true);
	}
    
	return Promise.fromEvent(Players.ChildAdded, () => {return enoughPlayers()} )
}

const notEnoughPlayersPromise = (): Promise<unknown> => {
    if (!enoughPlayers()) {
		return Promise.resolve(true);
	}

	return Promise.fromEvent(Players.ChildRemoved, () => {return !enoughPlayers()} )
}

// Game State Functions
const intermit = (): unknown =>  {
	print("Intermission");
	updateRoundState("Intermission");
	return Promise.race([
		notEnoughPlayersPromise().then( () => {
			return waitForPlayers()
		} ),

		Promise.delay(5)
			.then( () => {
                print('Running')
                task.wait(5)
            })
			.then(waitForPlayers)
			.catch(() => {
				warn("Failed to start game mode", error);
				return waitForPlayers();
			}),
	]);
}

const waitForPlayers = () => {
	print("Waiting for players");
	updateRoundState("Waiting For Players");
	return enoughPlayersPromise().then( () => {
		intermit()
	} );
}

// Main

const nextBlock = waitForPlayers;

// eslint-disable-next-line no-constant-condition
nextBlock().expect();