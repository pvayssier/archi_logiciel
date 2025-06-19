import { RoverOrientation } from "./rover-orientation";

export interface EtatRover {
  position: { x: number; y: number };
  orientation: RoverOrientation;
  succeeded: boolean;
}
