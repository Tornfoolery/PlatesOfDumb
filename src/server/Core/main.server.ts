import * as State from "shared/state";

import { Players } from "@rbxts/services";
import { SignalEvents } from "server/Modules/events";

const GetNumPlayers = () => Players.GetPlayers().size();
const PlayersUpdate = SignalEvents.PlayersUpdate

function UpdatePlayers() {
  const NumPlayers: number = GetNumPlayers();
  State.UpdatePlayersInGame(NumPlayers);
  PlayersUpdate.Fire(NumPlayers);
}

Players.PlayerAdded.Connect(UpdatePlayers);
Players.PlayerRemoving.Connect(UpdatePlayers);