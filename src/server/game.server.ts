import { Settings } from "shared/settings";
import * as Status from "shared/status";

import * as Events from "server/events";

const GameStartSignal = Events.GameStart;

function NewTimer(Duration: number, Callback: Callback) {
  return new Promise((resolve, reject) => {
    for (let i = Duration; i > 0; i--) {
      Callback(i);
      task.wait(1);
    }

    resolve(true);
  });
}

GameStartSignal.Connect(() => {
  Status.UpdateStatus("Intermission");
  print("yeah");
  const Timer = NewTimer(5, function (i: number) {
    print("test", i);
  });

  Timer.cancel();
});
