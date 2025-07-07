import {
  CellType,
  InitStateRover,
  MapCellType,
  RoverCellType,
  RoverOrientation,
  SeenCell,
  StateRover,
} from "@model";
import { MapInterface } from "./map.interface";

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
      this.map[cell.position.y][cell.position.x] =
        cell.type === CellType.OBSTACLE
          ? MapCellType.OBSTACLE
          : MapCellType.EMPTY;
    }
  }

  private manageObstacle(
    newPosition: { x: number; y: number },
    orientation: RoverOrientation
  ): void {
    //todo: gerer pour fin de carte
    const delta = {
      [RoverOrientation.NORTH]: { x: 0, y: -1 },
      [RoverOrientation.SOUTH]: { x: 0, y: 1 },
      [RoverOrientation.EAST]: { x: 1, y: 0 },
      [RoverOrientation.WEST]: { x: -1, y: 0 },
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

    this.map[newPosition.y][newPosition.x] = MapCellType.EMPTY;
    if (this.roverPosition) {
      this.map[this.roverPosition.y][this.roverPosition.x] = MapCellType.EMPTY;
    }

    this.roverPosition = { ...newPosition };

    // Gestion obstacle si commande échouée
    if (!stateRover.successed) {
      this.manageObstacle(newPosition, stateRover.orientation);

      return;
    }

    if (stateRover.seen.length) {
      this.manageSeenCells(stateRover.seen);
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
