import { Settings } from "shared/settings";
import { Utils } from "server/Utils/getUtils";

import { Players, Workspace } from "@rbxts/services";
import { SignalEvents } from "server/Modules/events";

import * as GlobalValues from "shared/GlobalValuesHandler";

import * as NormalGameMode from "server/Gamemodes/normal";

const RoundInformation = new GlobalValues.Config('RoundInfo')

// Functions
const GetNumPlayers = () => Players.GetPlayers().size() as number;
const EnoughPlayers = () => GetNumPlayers() >= Settings.MinimumPlayers;

const NotEnoughPlayersPromise = (): Promise<unknown> =>
  !EnoughPlayers()
    ? Promise.resolve(true)
    : Promise.fromEvent(Players.PlayerRemoving, () => !EnoughPlayers());

// Main Handler
const PlatesFolder = new Instance("Folder");
PlatesFolder.Name = "Plates";
PlatesFolder.Parent = Workspace;

function StartGame() {
  RoundInformation.set("State", "Game Start");
  NormalGameMode.GeneratePlates(PlatesFolder);

  const PlayersInGame = Players.GetPlayers();
  for (const Player of PlayersInGame) {
    Player.SetAttribute("InGame", true)
  }
  NormalGameMode.AssignPlayers(PlayersInGame);
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
Players.PlayerAdded.Connect(() => {
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
});
