import React from "react";
import { InitStateRover } from "../../../src/models/init-rover.interface";
import { StateRover } from "../../../src/models/state-rover.interface";
import { Cell } from "./cell";
import { CellProps } from "./cell";
import { Position } from "../../../src/models/state-rover.interface";

interface MapProps {
  init: InitStateRover;
  state: StateRover;
  cellsMap: Map<String, CellProps>;
}

const WINDOW_RADIUS = 15;

export const Map = React.memo(function Map({
  init,
  state,
  cellsMap,
}: MapProps) {
  const height = init.mapHeight;
  const width = init.mapWidth;
  const rows = [];

  const roverX = state.position.x;
  const roverY = state.position.y;

  for (let dy = -WINDOW_RADIUS; dy <= WINDOW_RADIUS; dy++) {
    const y = (roverY + dy + height) % height;
    const row = [];

    for (let dx = -WINDOW_RADIUS; dx <= WINDOW_RADIUS; dx++) {
      const x = (roverX + dx + width) % width;
      const cell = cellsMap.get(`${x}:${y}`);
      const Position: Position = { x, y };

      row.push(
        <Cell
          key={`cell-${dx}-${dy}`} // clé unique même si (x, y) répété
          orientation={cell?.orientation}
          cellType={cell?.cellType}
          Position={Position}
        />
      );
    }

    rows.push(
      <div key={`row-${dy}`} className="flex flex-row">
        {row}
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-700 rounded-md bg-gray-900 p-2">
      {rows}
    </div>
  );
});
