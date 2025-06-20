import { MqttBroker } from "./mqtt-broker";
import { CommandRover } from "@model";
import { StateRover } from "@model";
import mqtt from "mqtt/*";

// Example usage:

const brokerUrl = "mqtt://127.0.0.1:1883"; // Change this to your MQTT broker URL
const mqttBroker = new MqttBroker(brokerUrl, "Broker");
mqttBroker.waitForConnection().then(() => {
  mqttBroker.subscribeToInitialization((initStateRover) => {
    console.log("Initialization state:", initStateRover);
  });

  mqttBroker.subscribeToState((state: StateRover) => {
    console.log("Rover state:", state);
  });
});

// mqttBroker.publishCommand([
//   CommandRover.BACKWARD,
//   CommandRover.BACKWARD,
//   CommandRover.BACKWARD,
// ]);
