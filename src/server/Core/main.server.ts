import { Settings } from "shared/settings";
import * as State from "shared/state";

import { Players } from "@rbxts/services";

const GetNumPlayers = () => Players.GetPlayers().size();

Players.PlayerAdded.Connect((Player) => {
  State.UpdatePlayersInGame(GetNumPlayers());
});

Players.PlayerRemoving.Connect((Player) => {
  State.UpdatePlayersInGame(GetNumPlayers());
});