import { IRover } from "./rover.interface";
import { CommandRover, CellType, EtatRover, RoverOrientation } from "@model";
import { Broker, MqttBroker } from "@broker";
import { BasicCamera } from "./camera";
import { Camera } from "./camera.inteface";

export class Rover implements IRover {
  private etat: EtatRover;
  private grid: CellType[][];
  private broker: Broker;
  private camera: Camera | undefined;
  private debug: boolean;

  private static readonly moveVectors: Record<
    RoverOrientation,
    { dx: number; dy: number }
  > = {
    [RoverOrientation.NORTH]: { dx: 0, dy: -1 },
    [RoverOrientation.EAST]: { dx: 1, dy: 0 },
    [RoverOrientation.SOUTH]: { dx: 0, dy: 1 },
    [RoverOrientation.WEST]: { dx: -1, dy: 0 },
  };

  constructor(
    brokerUrl: string,
    grid: CellType[][],
    enableCamera = true,
    debug = false
  ) {
    this.debug = debug;
    this.grid = grid;
    this.etat = {
      position: { x: 0, y: 0 },
      orientation:
        Object.values(RoverOrientation)[
          Math.floor(Math.random() * Object.values(RoverOrientation).length)
        ],
      lastCommand: null,
      successed: true,
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
    if (enableCamera) {
      this.camera = new BasicCamera(1);
      this.etat.seen = this.camera.look(this.etat.position, this.grid);
    }

    this.broker = new MqttBroker(brokerUrl, "rover-broker");

    this.broker.waitForConnection().then(() => {
      this.broker.publishInitialization({
        position: this.etat.position,
        orientation: this.etat.orientation,
        mapWidth: this.grid[0].length,
        mapHeight: this.grid.length,
        debug: this.debug,
        enableCamera: enableCamera,
      });
      this.printGrid();
    });

    this.broker.subscribeToCommands((commands: CommandRover[]) => {
      this.followInstructions(commands);
      this.printGrid();
    });
  }

  private log(...args: any[]) {
    if (this.debug) console.log(...args);
  }
  private error(...args: any[]) {
    if (this.debug) console.error(...args);
  }
  public setDebug(enabled: boolean) {
    this.debug = enabled;
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

  private printGrid() {
    if (!this.debug) return;
    console.log("Current grid state:");
    console.log(
      this.grid.map((row) => row.map((cell) => cell).join(" ")).join("\n")
    );
    console.log(
      `Rover position: (${this.etat.position.x}, ${this.etat.position.y}), Orientation: ${this.etat.orientation}`
    );
  }

  followInstructions(instructions: CommandRover[]) {
    this.etat.seen = [];
    for (const command of instructions) {
      this.etat.lastCommand = command;
      switch (command) {
        case CommandRover.FORWARD:
          if (!this.move(CommandRover.FORWARD)) {
            this.etat.successed = false;
            this.error(
              `Failed to move forward from position (${this.etat.position.x}, ${this.etat.position.y})`
            );
            this.broker.publishEtat(this.etat);
            return;
          }
          if (this.camera) {
            this.etat.seen = this.camera.look(this.etat.position, this.grid);
          }
          break;
        case CommandRover.BACKWARD:
          if (!this.move(CommandRover.BACKWARD)) {
            this.etat.successed = false;
            this.error(
              `Failed to move backward from position (${this.etat.position.x}, ${this.etat.position.y})`
            );
            this.broker.publishEtat(this.etat);
            return;
          }
          if (this.camera) {
            this.etat.seen = this.camera.look(this.etat.position, this.grid);
          }
          break;
        case CommandRover.LEFT:
          this.turnLeft();
          break;
        case CommandRover.RIGHT:
          this.turnRight();
          break;
        default:
          this.error(`Unrecognized command: ${command}`);
          this.etat.lastCommand = command;
          this.etat.successed = false;
          this.broker.publishEtat(this.etat);
          return;
      }
      this.etat.successed = true;
      this.broker.publishEtat(this.etat);
    }
    this.log(
      `Rover moved successfully to position (${this.etat.position.x}, ${this.etat.position.y}) facing ${this.etat.orientation}`
    );
    return;
  }

  public getEtat(): EtatRover {
    return { ...this.etat };
  }

  public getGrid(): CellType[][] {
    return this.grid.map((row) => [...row]);
  }

  public setCamera(camera: Camera): void {
    this.camera = camera;
  }
  public deleteCamera(): void {
    this.camera = undefined;
  }
}
