import { SeenCell, Camera } from "./camera.inteface";
import { CellType, Position } from "@model";

export class BasicCamera implements Camera {
  constructor(private readonly range: number = 1) {}

  look(position: Position, grid: CellType[][]): SeenCell[] {
    const seenCells: SeenCell[] = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let dy = -this.range; dy <= this.range; dy++) {
      for (let dx = -this.range; dx <= this.range; dx++) {
        if (dx === 0 && dy === 0) continue;

        const x = (position.x + dx + cols) % cols;
        const y = (position.y + dy + rows) % rows;

        seenCells.push({
          position: { x, y },
          type: grid[y][x],
        });
      }
    }

    return seenCells;
  }
}
