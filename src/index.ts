import {UserInput} from "./missionControl/userInput";
import {NetworkSender} from "./missionControl/networkSender";
import {MissionControl} from "./missionControl/missionControl";

const userInput = new UserInput();
const networkSender = new NetworkSender();
const missionControl = new MissionControl(userInput, networkSender);
missionControl.run()