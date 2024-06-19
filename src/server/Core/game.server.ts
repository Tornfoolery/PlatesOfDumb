//import { startGameLoop } from "server/Modules/roundHandler";

import * as GlobalValues from "shared/GlobalValuesHandler"

// Globals
const roundInformation = new GlobalValues.Config('RoundInfo')
roundInformation.set('PlayersInGame', 0)
roundInformation.set('State', 'Waiting For Players')
roundInformation.set('Timer', '')
roundInformation.set('Message', 'Waiting For Players')

// Main
//startGameLoop();