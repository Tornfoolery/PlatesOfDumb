import { Settings } from "shared/settings";
import * as Status from "shared/status";
import { startGameLoop } from "server/Modules/roundHandler";

import * as GlobalValues from "shared/GlobalValuesHandler"

// Globals
const roundInformation = new GlobalValues.Config('RoundInfo')

roundInformation.set('State', 'whatever the fuck this is')
roundInformation.set('Text', '')

print( GlobalValues.getConfig('RoundInfo')?.Instance.Name ) //ok now can you test it

print( GlobalValues.getConfig('RoundInfo')?.get('State') )

// Main
startGameLoop();