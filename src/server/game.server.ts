import * as Events from "server/events";

const GameStartSignal = Events.GameStart

GameStartSignal.Connect(() => {
    print("ok this is epic")
}); 