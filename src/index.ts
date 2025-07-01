import { MissionControl } from "@missionControl";

const brokerUrl = "mqtt://127.0.0.1:1883";
const missionControl = new MissionControl(brokerUrl);
missionControl.run()