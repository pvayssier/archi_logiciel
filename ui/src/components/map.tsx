import React from "react";
import { Cell } from "./cell";
import { CellType } from "../../../src/models/cell-type";
import { SeenCell } from "../../../src/models/seen-cell";
import { InitStateRover } from "../../../src/models/init-rover.interface";
import { StateRover } from "../../../src/models/state-rover.interface";

interface MapProps {
  state: StateRover;
  init: InitStateRover;
}

export const Map: React.FC<MapProps> = ({ state, init }) => {
  const { mapWidth, mapHeight } = init;
  const { position: roverPos, orientation, seen } = state;

  const buildSeenMap = (): (CellType | undefined)[][] => {
    const grid: (CellType | undefined)[][] = Array.from(
      { length: mapHeight },
      () => Array.from({ length: mapWidth }, () => undefined)
    );

    seen.forEach((cell: SeenCell) => {
      const { x, y } = cell.position;
      if (y >= 0 && y < mapHeight && x >= 0 && x < mapWidth) {
        grid[y][x] = cell.type;
      }
    });

    return grid;
  };

  const seenGrid = buildSeenMap();

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${mapWidth}, 2rem)` }}
    >
      {seenGrid.map((row, y) =>
        row.map((cellType, x) => {
          const isRover = roverPos.x === x && roverPos.y === y;

          return (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              isRover={isRover}
              orientation={isRover ? orientation : undefined}
              seenType={cellType}
            />
          );
        })
      )}
    </div>
  );
};
