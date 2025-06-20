export { IRover } from "./rover.interface";
// Example usage:

import { generateMap } from "./generate-map";
import { Rover } from "./rover";

const brokerUrl = "mqtt://127.0.0.1:1883";
const rover = new Rover(brokerUrl, generateMap(20, 20, 0.2, 5), true);
