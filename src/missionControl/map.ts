import { MapInterface } from "./map.interface";

export class Map implements MapInterface {
  private readonly size: number;
  private map: string[][] = [];

  constructor(size: number = 10) {
    this.size = size;
    this.mapInit();
  }

  mapInit(): void {
    this.map = [];
    for (let i = 0; i < this.size; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.map[i][j] = "?";
      }
    }
  }

  mapUpdate(position: { x: number; y: number }): void {
    console.log('position', position)
    if (
        position.x < 0 ||
        position.x >= this.size ||
        position.y < 0 ||
        position.y >= this.size
    ) {
      console.error("Unknown map position");

      return;
    }

    this.map[position.y][position.x] = "R";
  }

  mapDisplay(): void {
    for (let row of this.map) {
      console.log(row.join(" "));
    }
  }
}
