import { Settings } from "shared/settings";
import * as State from "shared/state";
import { Players } from "@rbxts/services";
import { Utils } from "server/Utils/getUtils";

import * as GlobalValues from "shared/GlobalValuesHandler";

const IntermissionDuration = Settings.IntermissionDuration;

const getNumPlayers = () => Players.GetChildren().size();
const enoughPlayers = () => getNumPlayers() >= Settings.MinimumPlayers;
const updateRoundState = (state: string) => {
  State.UpdateStatus(state);
};

const enoughPlayersPromise = (): Promise<unknown> =>
  enoughPlayers()
    ? Promise.resolve(true)
    : Promise.fromEvent(Players.ChildAdded, () => enoughPlayers());

const notEnoughPlayersPromise = (): Promise<unknown> =>
  !enoughPlayers()
    ? Promise.resolve(true)
    : Promise.fromEvent(Players.ChildRemoved, () => !enoughPlayers());

const gameLoop = () => {
  print("Running");
  updateRoundState("In Game");
  task.wait(IntermissionDuration);
  waitForPlayers();
};

const intermission = () => {
  print("Intermission");
  updateRoundState("Intermission");

  GlobalValues.getConfig("RoundInfo")?.set("Message", "Intermission: %s");

  const Timer = new Utils.Timer.NewTimer(IntermissionDuration, (TimeLeft) => {
    print(TimeLeft);
    GlobalValues.getConfig("RoundInfo")?.set("Timer", TimeLeft);
  });

  Promise.race([
    notEnoughPlayersPromise().then(() => {
      Timer.cancel();
      return Promise.resolve("Return");
    }),

    new Promise((Resolve) => {
      Timer.promise.await();
      Resolve("Yes");
    }).then(() => Promise.resolve("Start")),
  ]).then((message) => {
    if (message === "Start") {
      gameLoop();
    } else {
      waitForPlayers();
    }
  });
};

const waitForPlayers = async () => {
  print("Waiting for players");
  updateRoundState("Waiting For Players");
  enoughPlayersPromise().then(intermission);
};

export const startGameLoop = () => {
  waitForPlayers();
};
