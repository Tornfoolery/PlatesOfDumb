import { Settings } from "shared/settings";
import * as Status from "shared/status";
import { startGameLoop } from "server/Modules/roundHandler";
import * as Events from "server/Modules/events";

const GameStartSignal = Events.GameStart;

startGameLoop()