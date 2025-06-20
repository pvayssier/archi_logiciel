import { RoverOrientation } from "./rover-orientation";
import { SeenCell } from "rover/camera.inteface";

export type Position = { x: number; y: number };

export interface EtatRover {
  position: Position;
  orientation: RoverOrientation;
  succeeded: boolean;
  seen: SeenCell[];
}
