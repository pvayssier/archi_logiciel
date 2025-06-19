export * from "./rover.interface";
// Example usage:

import { EtatRover } from "@model";
import { generateMap } from "./generate-map";
import { Rover } from "./rover";

const brokerUrl = "mqtt://127.0.0.1:1883";
const rover = new Rover(brokerUrl, generateMap(20, 20, 0.3, 3));

rover.broker.subscribeToResponses((etat: EtatRover) => {
  console.log("Rover state:", etat);
});
