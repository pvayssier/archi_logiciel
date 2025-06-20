import { MqttBroker } from "./mqtt-broker";
import { CommandRover } from "@model";
import { EtatRover } from "@model";
import mqtt from "mqtt/*";

// Example usage:

const brokerUrl = "mqtt://127.0.0.1:1883"; // Change this to your MQTT broker URL
const mqttBroker = new MqttBroker(brokerUrl, "Broker");
mqttBroker.waitForConnection().then(() => {
  mqttBroker.subscribeToInitialization((initEtatRover) => {
    console.log("Initialization state:", initEtatRover);
  });

  mqttBroker.subscribeToEtat((etat: EtatRover) => {
    console.log("Rover state:", etat);
  });
});

// mqttBroker.publishCommand([
//   CommandRover.BACKWARD,
//   CommandRover.BACKWARD,
//   CommandRover.BACKWARD,
// ]);
