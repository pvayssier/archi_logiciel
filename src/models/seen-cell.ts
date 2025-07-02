import { Position } from "./state-rover.interface";
import { CellType } from "./cell-type";

export type SeenCell = {
  position: Position;
  type: CellType;
};
