import { RoverOrientation } from "./rover-orientation";

export const RoverCellType: Record<RoverOrientation, string> = {
  [RoverOrientation.NORTH]: "^",
  [RoverOrientation.SOUTH]: "v",
  [RoverOrientation.EAST]: ">",
  [RoverOrientation.WEST]: "<",
};
