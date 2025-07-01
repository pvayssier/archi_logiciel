import { MapInterface } from "./map.interface";
import {InitStateRover, StateRover} from "@model";
import { CommandRover, RoverOrientation } from "@model";

export class Map implements MapInterface {
  private readonly size: number;
  private map: string[][] = [];
  private roverPosition: { x: number; y: number } | null = null;
  private roverOrientation: RoverOrientation | null = null;

  constructor(size: number = 10) {
    this.size = size;
  }

  mapInit(initStateRover: InitStateRover): void {
    this.map = [];
    for (let i = 0; i < this.size; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.map[i][j] = "?";
      }
    }
    this.roverPosition = null;
    this.roverOrientation = null;
  }

  mapUpdate(etatRover: StateRover): void {
    const newPosition = etatRover.position;
    const newOrientation = etatRover.orientation;

    if (
        newPosition.x < 0 || newPosition.x >= this.size ||
        newPosition.y < 0 || newPosition.y >= this.size
    ) {
      console.error("Position en dehors de la carte.");
      return;
    }

    if (
        this.roverPosition &&
        (this.roverPosition.x !== newPosition.x || this.roverPosition.y !== newPosition.y)
    ) {
      this.map[this.roverPosition.y][this.roverPosition.x] = ".";
    }

    this.map[newPosition.y][newPosition.x] = "R";
    this.roverPosition = { ...newPosition };

    if (this.roverOrientation !== newOrientation) {
      this.roverOrientation = newOrientation;
      console.log(`Current rover orientation:  ${newOrientation}`);
    }

    // Gestion obstacle si commande échouée
    const failed = etatRover.successed;
    if (failed === CommandRover.FORWARD || failed === CommandRover.BACKWARD) {
      const delta = {
        [RoverOrientation.NORTH]: { x: 0, y: -1 },
        [RoverOrientation.SOUTH]: { x: 0, y: 1 },
        [RoverOrientation.EAST]:  { x: 1, y: 0 },
        [RoverOrientation.WEST]:  { x: -1, y: 0 },
      };

      const direction = delta[this.roverOrientation!];
      const obstaclePos = {
        x: newPosition.x + (failed === CommandRover.FORWARD ? direction.x : -direction.x),
        y: newPosition.y + (failed === CommandRover.FORWARD ? direction.y : -direction.y),
      };

      if (
          obstaclePos.x >= 0 && obstaclePos.x < this.size &&
          obstaclePos.y >= 0 && obstaclePos.y < this.size
      ) {
        this.map[obstaclePos.y][obstaclePos.x] = "X";
      } else {
        console.warn("Obstacle en dehors des limites de la carte.");
      }
    }
  }

  mapDisplay(): void {
    for (let row of this.map) {
      console.log(row.join(" "));
    }
  }
}
