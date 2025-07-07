import React from "react";
import { CellType } from "../../../src/models/cell-type";
import { RoverOrientation } from "../../../src/models/rover-orientation";
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";
import { Position } from "../../../src/models/state-rover.interface";
export interface CellProps {
  orientation?: RoverOrientation;
  cellType?: CellType;
  Position: Position;
}

export const Cell: React.FC<CellProps> = ({
  orientation,
  cellType,
  Position,
}) => {
  const getBackgroundColor = (): string => {
    switch (cellType) {
      case CellType.ROVER:
        return "bg-blue-500";
      case CellType.OBSTACLE:
        return "bg-amber-900";
      case CellType.EMPTY:
        return "bg-gray-200";
      default:
        return "bg-black";
    }
  };

  const renderOrientation = (): React.ReactNode => {
    if (!orientation) return null;

    switch (orientation) {
      case RoverOrientation.NORTH:
        return <ArrowUp size={16} />;
      case RoverOrientation.EAST:
        return <ArrowRight size={16} />;
      case RoverOrientation.SOUTH:
        return <ArrowDown size={16} />;
      case RoverOrientation.WEST:
        return <ArrowLeft size={16} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-8 h-8 border border-gray-300 flex items-center justify-center text-white ${getBackgroundColor()}`}
      id={`${Position.x}:${Position.y}`}
      data-debug={cellType}
    >
      {CellType.ROVER == cellType && renderOrientation()}
    </div>
  );
};
