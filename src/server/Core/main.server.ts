import { Players } from "@rbxts/services";
import { SignalEvents } from "server/Modules/events";

import * as GlobalValues from "shared/GlobalValuesHandler";

const RoundInformation = new GlobalValues.Config("RoundInfo");

const GetNumPlayers = () => Players.GetPlayers().size();
const PlayersUpdate = SignalEvents.PlayersUpdate;

function UpdatePlayers() {
  print("yeah");
  const NumPlayers: number = GetNumPlayers();
  RoundInformation.set("PlayersInGame", NumPlayers);
  PlayersUpdate.Fire(NumPlayers);
}

Players.PlayerAdded.Connect(UpdatePlayers);
Players.PlayerRemoving.Connect(UpdatePlayers);
