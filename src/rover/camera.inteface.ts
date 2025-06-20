import { RoverOrientation } from "@model";
import { Position, CellType } from "@model";

export type SeenCell = {
  position: Position;
  type: CellType;
};

export interface Camera {
  look(position: Position, gridCell: CellType[][]): SeenCell[];
}
