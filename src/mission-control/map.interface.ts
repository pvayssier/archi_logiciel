import { InitStateRover, StateRover } from "@model";

export interface MapInterface {
  mapDisplay: () => void;
  mapInit: (initStateRover: InitStateRover) => void;
  mapUpdate: (stateRover: StateRover) => void;
}
