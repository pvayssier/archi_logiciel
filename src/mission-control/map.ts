import {
  CellType,
  CommandRover,
  InitStateRover,
  RoverOrientation,
  SeenCell,
  StateRover,
} from "@model";

import { MapInterface } from "./map.interface";

export enum MapCellType {
  EMPTY = "O",
  OBSTACLE = "X",
  UNKNOWN = "?",
  PASSED = "-",
}

export const RoverCellType: Record<RoverOrientation, string> = {
  [RoverOrientation.NORTH]: "^",
  [RoverOrientation.SOUTH]: "v",
  [RoverOrientation.EAST]: ">",
  [RoverOrientation.WEST]: "<",
};


export class Map implements MapInterface {
  private map: (MapCellType | string)[][] = [];
  private roverPosition: { x: number; y: number } | undefined = undefined;
  private roverOrientation: RoverOrientation | undefined = undefined;
  private height: number = 0;
  private width: number = 0;

  private getRoverCellTypeByOrientation(orientation: RoverOrientation): string {
    return RoverCellType[orientation];
  }

  private manageSeenCells(seenCells: SeenCell[]): void {
    for (const cell of seenCells) {
      const currentPositionCell = this.map[cell.position.y][cell.position.x];

      if (currentPositionCell === MapCellType.Passed) {
        continue;
      }

      this.map[cell.position.y][cell.position.x] =
        cell.type === CellType.OBSTACLE
          ? MapCellType.OBSTACLE
          : MapCellType.EMPTY;
    }
  }

  private manageObstacle(
    newPosition: { x: number; y: number },
    orientation: RoverOrientation,
    lastCommand: CommandRover | null,
  ): void {
    const backwardDelta = lastCommand !== CommandRover.BACKWARD ? 1 : -1;

    const delta = {
      [RoverOrientation.NORTH]: { x: 0, y: -1 * backwardDelta },
      [RoverOrientation.SOUTH]: { x: 0, y: 1 * backwardDelta },
      [RoverOrientation.EAST]: { x: 1 * backwardDelta, y: 0 },
      [RoverOrientation.WEST]: { x: -1 * backwardDelta, y: 0 },
    };

    const direction = delta[this.roverOrientation!];
    const obstaclePos = {
      x: newPosition.x + direction.x,
      y: newPosition.y + direction.y,
    };

    this.map[obstaclePos.y][obstaclePos.x] = MapCellType.OBSTACLE;
    this.map[newPosition.y][newPosition.x] =
      this.getRoverCellTypeByOrientation(orientation);
  }

  public mapInit(initStateRover: InitStateRover): void {
    this.map = [];
    for (let i = 0; i < initStateRover.mapHeight; i++) {
      this.map[i] = [];
      for (let j = 0; j < initStateRover.mapWidth; j++) {
        this.map[i][j] =
          initStateRover.position.x === j && initStateRover.position.y === i
            ? this.getRoverCellTypeByOrientation(
                initStateRover.orientation ?? RoverOrientation.NORTH
              )
            : MapCellType.UNKNOWN;
      }
    }

    this.roverPosition = initStateRover.position;
    this.roverOrientation = initStateRover.orientation;
    this.height = initStateRover.mapHeight;
    this.width = initStateRover.mapWidth;
  }

  public mapUpdate(stateRover: StateRover): void {
    const newPosition = stateRover.position;
    const newOrientation = stateRover.orientation;

<<<<<<< HEAD
    this.map[newPosition.y][newPosition.x] = MapCellType.EMPTY;
    if (this.roverPosition) {
      this.map[this.roverPosition.y][this.roverPosition.x] = MapCellType.EMPTY;
=======
    if (stateRover.seen.length) {
      this.manageSeenCells(stateRover.seen);
    }

    this.map[newPosition.y][newPosition.x] = MapCellType.Empty;
    if (this.roverPosition) {
      this.map[this.roverPosition.y][this.roverPosition.x] =
        !stateRover.lastCommand
          ? this.getRoverCellTypeByOrientation(stateRover.orientation)
          : MapCellType.Passed;
>>>>>>> main
    }

    this.roverPosition = { ...newPosition };

    // Gestion obstacle si commande échouée
    if (!stateRover.successed) {
      this.manageObstacle(
        newPosition,
        stateRover.orientation,
        stateRover.lastCommand,
      );

      return;
    }

    if (stateRover.isLastCommand) {
      this.map[newPosition.y][newPosition.x] =
        this.getRoverCellTypeByOrientation(stateRover.orientation);
    }

    if (this.roverOrientation !== newOrientation) {
      this.roverOrientation = newOrientation;
      console.log(`Current rover orientation:  ${newOrientation}`);
    }
  }

  public mapDisplay(): void {
    for (const row of this.map) {
      console.log(row.join(" "));
    }
  }
}
