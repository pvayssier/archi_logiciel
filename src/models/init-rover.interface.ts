import { RoverOrientation } from "./rover-orientation";
import { Position } from "./etat-rover.interface";

export interface InitEtatRover {
  position: Position;
  orientation?: RoverOrientation;
  mapWidth: number;
  mapHeight: number;
  enableCamera: boolean;
  debug: boolean;
}
