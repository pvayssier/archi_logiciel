import { StateRover } from "@model";

export interface MapInterface {
  mapUpdate: (stateRover: StateRover) => void;
  mapDisplay: () => void;
}
