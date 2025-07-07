import React from "react";
import { CellType } from "../../../src/models/cell-type";
import { RoverOrientation } from "../../../src/models/rover-orientation";
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";

export interface CellProps {
  x: number;
  y: number;
  isRover: boolean;
  orientation?: RoverOrientation;
  seenType?: CellType;
}

export const Cell: React.FC<CellProps> = ({
  x,
  y,
  isRover,
  orientation,
  seenType,
}) => {
  const getBackgroundColor = (): string => {
    if (isRover) return "bg-blue-500";
    if (seenType === CellType.Obstacle) return "bg-gray-800";
    if (seenType === CellType.Empty) return "bg-amber-200";
    if (seenType === CellType.Rover) return "bg-purple-500";
    return "bg-black";
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
    >
      {isRover && renderOrientation()}
    </div>
  );
};
