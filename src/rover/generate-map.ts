import { CellType } from "@model";

const Noise = require("noisejs").Noise;

export function generateMap(
  height: number,
  width: number,
  obstacleThreshold: number = 0.3,
  scale: number = 10,
): CellType[][] {
  const noise = new Noise(Math.random());
  const map: CellType[][] = [];

  for (let y = 0; y < height; y++) {
    const row: CellType[] = [];

    for (let x = 0; x < width; x++) {
      const noiseValue = noise.simplex2(x / scale, y / scale);
      const cell =
        noiseValue > obstacleThreshold ? CellType.Obstacle : CellType.Empty;
      row.push(cell);
    }

    map.push(row);
  }
  return map;
}

// Exemple usage of the generateMap function

// function Test() {
//   const map = generateMap(20, 20, 0.3, 3);
//   console.log(map.map((row) => row.map((cell) => cell).join(' ')).join('\n'));
// }
