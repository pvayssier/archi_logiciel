import { Position, CellType, SeenCell } from "@model";

export interface Camera {
  look(position: Position, gridCell: CellType[][]): SeenCell[];
}
