import { generateMap } from "@rover";
import { MarsRover } from "@rover";
import { MqttBroker } from "@broker";
import { BasicCamera } from "@camera";

const brokerUrl = "mqtt://127.0.0.1:1883";
const rover = new MarsRover(
  new MqttBroker(brokerUrl, "rover-broker"),
  generateMap(20, 20, 0.2, 5),
  new BasicCamera(2)
);
