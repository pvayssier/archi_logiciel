import { RoverOrientation } from "./rover-orientation";
import { SeenCell } from "rover/camera.inteface";
import { CommandRover } from "./command-rover";

export type Position = { x: number; y: number };

export interface StateRover {
  position: Position;
  orientation: RoverOrientation;
  lastCommand: CommandRover | null;
  successed: boolean;
  seen: SeenCell[];
}
