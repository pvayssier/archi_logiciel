import { Console } from "@missionControl";
import { UserInput } from "@missionControl";
import { Map } from "@missionControl";
import { NetworkSender } from "@missionControl";
import { MissionControl } from "./mission-control/mission-control";

const networkSender = new NetworkSender();
const userInput = new UserInput();
const map = new Map(5);
const console = new Console(userInput, map);
const missionControl = new MissionControl(networkSender, console);
missionControl.run()