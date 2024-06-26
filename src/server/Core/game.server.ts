import { Players, Workspace } from "@rbxts/services";
import * as Signals from "server/Modules/signals";

import * as Gamemode from "server/Gamemodes/normal";
import * as GlobalValues from "shared/GlobalValuesHandler";

const RoundInformation = new GlobalValues.Config('RoundInfo')

const PlatesFolder = new Instance("Folder");
PlatesFolder.Name = "Plates";
PlatesFolder.Parent = Workspace;

const PlayersInGame: Player[] = [];
const DeathOrder: string[] = [];

function GameEnd() {
    const Rankings: string[] = [];

    if (PlayersInGame.size() > 0) {
        Rankings.push(PlayersInGame[0].Name);
    }

    for (let i = DeathOrder.size(); i >= 0; i--) {
        Rankings.push(DeathOrder[i]);
    }

    Signals.GameEnd.Fire();
}

function PlayerDied( Player: Player ) {
    PlayersInGame.remove(PlayersInGame.indexOf(Player));
    Player.SetAttribute("InGame", false)

    DeathOrder.push(Player.Name);

    if (PlayersInGame.size() <= 1) {
        GameEnd();
    }
}

function HandlePlayers() {
    const PlayersArray = Players.GetPlayers();
    
    PlayersInGame.clear();

    for (const Player of PlayersArray) {
        const Character = Player.Character
        if (Character) {
            PlayersInGame.push(Player);

            Player.SetAttribute("InGame", true)
            
            const Hum = Character.FindFirstChild("Humanoid") as Humanoid
            Hum.Died.Connect(() => {
                PlayerDied(Player)
            })
        }
    }
}

Signals.GameStart.Connect(() => {
    RoundInformation.set("Message", "Game Started");

    PlatesFolder.ClearAllChildren();

    Gamemode.GeneratePlates(PlatesFolder);

    HandlePlayers();
    
    Gamemode.AssignPlayers(PlayersInGame);
})

Players.PlayerRemoving.Connect(PlayerDied)