import { RoverOrientation } from "./rover-orientation";
import { Position } from "./state-rover.interface";

export interface InitStateRover {
  position: Position;
  orientation?: RoverOrientation;
  mapWidth: number;
  mapHeight: number;
  enableCamera: boolean;
  debug: boolean;
}
