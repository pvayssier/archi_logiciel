import {Rover} from "./rover/rover";
import {generateMap} from "./rover/generate-map";


const brokerUrl = "mqtt://127.0.0.1:1883";
const rover = new Rover(brokerUrl, generateMap(20, 20, 0.2, 5), true, true);
