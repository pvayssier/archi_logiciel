import { IRover } from "./rover.interface";
import { CommandRover, CellType, EtatRover, RoverOrientation } from "@model";
import { Broker, MqttBroker } from "@broker";
import { BasicCamera } from "./camera";

export class Rover implements IRover {
  private etat: EtatRover;
  private grid: CellType[][];
  private broker: Broker;
  private camera: BasicCamera;

  private static readonly moveVectors: Record<
    RoverOrientation,
    { dx: number; dy: number }
  > = {
    [RoverOrientation.NORTH]: { dx: 0, dy: -1 },
    [RoverOrientation.EAST]: { dx: 1, dy: 0 },
    [RoverOrientation.SOUTH]: { dx: 0, dy: 1 },
    [RoverOrientation.WEST]: { dx: -1, dy: 0 },
  };

  constructor(brokerUrl: string, grid: CellType[][]) {
    this.grid = grid;
    this.etat = {
      position: { x: 0, y: 0 },
      orientation: RoverOrientation.NORTH,
      succeeded: false,
      seen: [],
    };

    let roverPlaced = false;
    while (!roverPlaced) {
      const randY = Math.floor(Math.random() * grid.length);
      const randX = Math.floor(Math.random() * grid[0].length);
      if (this.grid[randY][randX] === CellType.Empty) {
        this.grid[randY][randX] = CellType.Rover;
        this.etat.position = { x: randX, y: randY };
        roverPlaced = true;
      }
    }

    this.broker = new MqttBroker(brokerUrl, "rover-broker");

    this.broker.subscribeToCommands((commands: CommandRover[]) => {
      const result = this.followInstructions(commands);
      this.broker.publishResponse(result);
      this.printGrid();
    });

    this.camera = new BasicCamera(1);
    this.etat.seen = this.camera.look(this.etat.position, this.grid);

    this.printGrid();
  }

  private getMoveVector(
    command: CommandRover.FORWARD | CommandRover.BACKWARD
  ): { dx: number; dy: number } {
    let { dx, dy } = Rover.moveVectors[this.etat.orientation];
    if (command === CommandRover.BACKWARD) {
      dx = -dx;
      dy = -dy;
    }
    return { dx, dy };
  }
  private move(command: CommandRover.FORWARD | CommandRover.BACKWARD): boolean {
    const { x, y } = this.etat.position;
    const { dx, dy } = this.getMoveVector(command);
    const numRows = this.grid.length;
    const numCols = this.grid[0].length;

    const newX = (x + dx + numCols) % numCols;
    const newY = (y + dy + numRows) % numRows;

    if (this.grid[newY][newX] === CellType.Obstacle) {
      return false;
    }

    this.grid[y][x] = CellType.Empty;
    this.grid[newY][newX] = CellType.Rover;
    this.etat.position = { x: newX, y: newY };

    return true;
  }

  private turnLeft() {
    switch (this.etat.orientation) {
      case RoverOrientation.NORTH:
        this.etat.orientation = RoverOrientation.WEST;
        break;
      case RoverOrientation.EAST:
        this.etat.orientation = RoverOrientation.NORTH;
        break;
      case RoverOrientation.SOUTH:
        this.etat.orientation = RoverOrientation.EAST;
        break;
      case RoverOrientation.WEST:
        this.etat.orientation = RoverOrientation.SOUTH;
        break;
    }
  }

  private turnRight() {
    switch (this.etat.orientation) {
      case RoverOrientation.NORTH:
        this.etat.orientation = RoverOrientation.EAST;
        break;
      case RoverOrientation.EAST:
        this.etat.orientation = RoverOrientation.SOUTH;
        break;
      case RoverOrientation.SOUTH:
        this.etat.orientation = RoverOrientation.WEST;
        break;
      case RoverOrientation.WEST:
        this.etat.orientation = RoverOrientation.NORTH;
        break;
    }
  }

  public getEtat(): EtatRover {
    return { ...this.etat };
  }

  followInstructions(instructions: CommandRover[]) {
    this.etat.seen = [];
    for (const command of instructions) {
      switch (command) {
        case CommandRover.FORWARD:
          if (!this.move(CommandRover.FORWARD)) {
            this.etat.succeeded = false;
            return this.etat;
          }
          this.etat.seen = this.camera.look(this.etat.position, this.grid);
          break;
        case CommandRover.BACKWARD:
          if (!this.move(CommandRover.BACKWARD)) {
            this.etat.succeeded = false;
            return this.etat;
          }
          this.etat.seen = this.camera.look(this.etat.position, this.grid);
          break;
        case CommandRover.LEFT:
          this.turnLeft();
          break;
        case CommandRover.RIGHT:
          this.turnRight();
          break;
      }
    }
    this.etat.succeeded = true;
    return this.etat;
  }

  private printGrid() {
    console.log("Current grid state:");
    console.log(
      this.grid.map((row) => row.map((cell) => cell).join(" ")).join("\n")
    );
    console.log(
      `Rover position: (${this.etat.position.x}, ${this.etat.position.y}), Orientation: ${this.etat.orientation}`
    );
  }
}
