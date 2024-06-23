import { Settings } from "shared/settings";
import { Utils } from "server/Utils/getUtils";

import { Players, Workspace } from "@rbxts/services";
import * as Signals from "server/Modules/signals";

import * as GlobalValues from "shared/GlobalValuesHandler";

const RoundInformation = new GlobalValues.Config('RoundInfo')
RoundInformation.set('State', 'Waiting For Players')
RoundInformation.set('Timer', '')
RoundInformation.set('Message', 'Waiting For Players')

// Functions
const GetNumPlayers = () => Players.GetPlayers().size() as number;
const EnoughPlayers = () => GetNumPlayers() >= Settings.MinimumPlayers;

const NotEnoughPlayersPromise = (): Promise<unknown> =>
  !EnoughPlayers()
    ? Promise.resolve(true)
    : Promise.fromEvent(Players.PlayerRemoving, () => !EnoughPlayers());

// Main Handler
function StartGame() {
  RoundInformation.set("State", "Game Start");

  Signals.GameStart.Fire();
}

function StartIntermission() {
  RoundInformation.set("State", "Intermission");
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
      RoundInformation.set("State", "Waiting For Players");
    });
}

/// Game End
Signals.GameEnd.Connect(() => {
  WaitForPlayers();
})

// Waiting For Players
function WaitForPlayers() {
  const NumPlayers = GetNumPlayers();
  if (RoundInformation.get("State") === "Waiting For Players") {
    GlobalValues.getConfig("RoundInfo")?.set(
      "Message",
      `Waiting for players: ${NumPlayers}/${Settings.MinimumPlayers}`
    );

    if (NumPlayers >= Settings.MinimumPlayers) {
      StartIntermission();
    }
  }
}

Players.PlayerAdded.Connect(WaitForPlayers);