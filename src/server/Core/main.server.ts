import { Settings } from "shared/settings";
import * as Status from "shared/status";

import { Players } from "@rbxts/services";

const GetNumPlayers = () => Players.GetPlayers().size();

Players.PlayerAdded.Connect((Player) => {
  Status.UpdatePlayersInGame(GetNumPlayers());
});

Players.PlayerRemoving.Connect((Player) => {
  Status.UpdatePlayersInGame(GetNumPlayers());
});

