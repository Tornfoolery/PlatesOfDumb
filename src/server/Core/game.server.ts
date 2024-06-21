import { Players, Workspace } from "@rbxts/services";
import { SignalEvents } from "server/Modules/events";

import * as Gamemode from "server/Gamemodes/normal";

const PlatesFolder = new Instance("Folder");
PlatesFolder.Name = "Plates";
PlatesFolder.Parent = Workspace;

const PlayersInGame: Player[] = [];

function PlayerDied( Player: Player ) {
    PlayersInGame.remove(PlayersInGame.indexOf(Player));
    Player.SetAttribute("InGame", false)

    if (PlayersInGame.size() === 0) {
        SignalEvents.GameEnd.Fire();
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

SignalEvents.GameStart.Connect(() => {
    PlatesFolder.ClearAllChildren();

    Gamemode.GeneratePlates(PlatesFolder);

    HandlePlayers();
    
    Gamemode.AssignPlayers(PlayersInGame);
})

Players.PlayerRemoving.Connect(PlayerDied)