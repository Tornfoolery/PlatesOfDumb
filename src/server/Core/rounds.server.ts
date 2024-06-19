import { Settings } from "shared/settings";
import { Utils } from "server/Utils/getUtils";

import { Players } from "@rbxts/services";
import { SignalEvents } from "server/Modules/events";

import * as GlobalValues from "shared/GlobalValuesHandler";

import * as NormalGameMode from "server/Gamemodes/normal";

const PlayersUpdate = SignalEvents.PlayersUpdate;

const RoundInformation = new GlobalValues.Config('RoundInfo')

// Functions
const GetNumPlayers = () => RoundInformation.get("PlayersInGame") as number;
const EnoughPlayers = () => GetNumPlayers() >= Settings.MinimumPlayers;

const NotEnoughPlayersPromise = (): Promise<unknown> =>
  !EnoughPlayers()
    ? Promise.resolve(true)
    : Promise.fromEvent(PlayersUpdate, () => !EnoughPlayers());

// Main Handler
function StartGame() {
  RoundInformation.set("State", "Game Start");
  NormalGameMode.GeneratePlates(new Vector3(0, 5, 0));
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

// Waiting For Players
PlayersUpdate.Connect((NumPlayers) => {
  print(NumPlayers)
  print(RoundInformation.get("State"))
  if (RoundInformation.get("State") === "Waiting For Players") {
    GlobalValues.getConfig("RoundInfo")?.set(
      "Message",
      `Waiting for players: ${NumPlayers}/${Settings.MinimumPlayers}`
    );

    if (NumPlayers >= Settings.MinimumPlayers) {
      StartIntermission();
    }
  }
});
