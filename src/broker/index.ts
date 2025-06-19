export { Broker } from "./broker.interface";
export { MqttBroker } from "./mqtt-broker";

import { MqttBroker } from "./mqtt-broker";
import { CommandRover } from "@model";
import { EtatRover } from "@model";

// Example usage:

const brokerUrl = "mqtt://127.0.0.1:1883"; // Change this to your MQTT broker URL
const mqttBroker = new MqttBroker(brokerUrl, "test");
mqttBroker.subscribeToResponses((etat: EtatRover) => {
  console.log("Rover state:", etat);
});

mqttBroker.publishCommand([
  CommandRover.FORWARD,
  CommandRover.LEFT,
  CommandRover.RIGHT,
]);
