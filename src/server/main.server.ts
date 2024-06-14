import { Settings } from "shared/settings";
import * as Status from "shared/status";

import { Players } from "@rbxts/services";
import * as Events from "server/events";

const GetNumPlayers = () => Players.GetPlayers().size();

const GameStartSignal = Events.GameStart

Players.PlayerAdded.Connect((Player) => {
  Status.UpdatePlayersInGame(GetNumPlayers());

  if (GetNumPlayers() >= Settings.MinimumPlayers) {
    print('yeah')
    GameStartSignal.Fire();
  }
});

Players.PlayerRemoving.Connect((Player) => {
  Status.UpdatePlayersInGame(GetNumPlayers());
});

