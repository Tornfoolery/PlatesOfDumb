import * as State from "shared/state";
import { Settings } from "shared/settings";
import { Utils } from "server/Utils/getUtils";

import { Players } from "@rbxts/services";
import { SignalEvents } from "server/Modules/events";

import * as GlobalValues from "shared/GlobalValuesHandler";

const PlayersUpdate = SignalEvents.PlayersUpdate;

// Functions
const GetNumPlayers = () => State.GetPlayersInGame();
const EnoughPlayers = () => GetNumPlayers() >= Settings.MinimumPlayers;

const NotEnoughPlayersPromise = (): Promise<unknown> =>
  !EnoughPlayers()
    ? Promise.resolve(true)
    : Promise.fromEvent(PlayersUpdate, () => !EnoughPlayers());

// Main Handler
function StartGame() {
  State.UpdateStatus("Game Start");
}

function StartIntermission() {
  State.UpdateStatus("Intermission");
  GlobalValues.getConfig("RoundInfo")?.set("Message", "Intermission: %s");

  const Timer = new Utils.Timer.NewTimer(
    Settings.IntermissionDuration,
    (TimeLeft) => {
      GlobalValues.getConfig("RoundInfo")?.set("Timer", TimeLeft);
    }
  );

  Promise.race([NotEnoughPlayersPromise(), Timer.promise])
    .then(() => StartGame())
    .finally(() => {
      Timer.cancel();
      State.UpdateStatus("Waiting For Players");
    });
}

// Waiting For Players
State.UpdateStatus("Waiting For Players");

PlayersUpdate.Connect((NumPlayers) => {
  if (State.GetStatus() === "Waiting For Players") {
    GlobalValues.getConfig("RoundInfo")?.set(
      "Message",
      `Waiting for players: ${NumPlayers}/${Settings.MinimumPlayers}`
    );

    if (NumPlayers >= Settings.MinimumPlayers) {
      StartIntermission();
    }
  }
});
