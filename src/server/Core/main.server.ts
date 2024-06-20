//import { startGameLoop } from "server/Modules/roundHandler";

import * as GlobalValues from "shared/GlobalValuesHandler"

// Globals
const RoundInformation = new GlobalValues.Config('RoundInfo')
RoundInformation.set('State', 'Waiting For Players')
RoundInformation.set('Timer', '')
RoundInformation.set('Message', 'Waiting For Players')

// Main
//startGameLoop();