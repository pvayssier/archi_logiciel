import {Console} from "./missionControl/console";
import {UserInput} from "./missionControl/userInput";
import {Map} from "./missionControl/map";
import {NetworkSender} from "./missionControl/networkSender";
import {MissionControl} from "./missionControl/missionControl";

const networkSender = new NetworkSender();
const userInput = new UserInput();
const map = new Map(5);
const console = new Console(userInput, map);
const missionControl = new MissionControl(networkSender, console);
missionControl.run()