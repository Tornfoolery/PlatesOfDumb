import { Settings } from "shared/settings";
import * as Status from 'shared/status';

const Players = game.GetService("Players")

Players.PlayerAdded.Connect((Player) => {
    Status.UpdatePlayersInGame(Status.GetPlayersInGame() + 1);
});

Players.PlayerRemoving.Connect((Player) => {
    Status.UpdatePlayersInGame(Status.GetPlayersInGame() - 1);
});