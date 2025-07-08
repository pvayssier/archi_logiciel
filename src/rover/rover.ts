import { Broker, MqttBroker } from "@broker";
import { BasicCamera } from "@camera";
import { CellType, CommandRover, RoverOrientation, StateRover } from "@model";
import { Camera } from "../camera/camera.inteface";
import { IRover } from "./rover.interface";

export class Rover implements IRover {
  private state: StateRover;
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
    debug = false,
  ) {
    this.debug = debug;
    this.grid = grid;
    this.state = {
      position: { x: 0, y: 0 },
      orientation:
        Object.values(RoverOrientation)[
          Math.floor(Math.random() * Object.values(RoverOrientation).length)
        ],
      lastCommand: null,
      isLastCommand: false,
      successed: true,
      seen: [],
    };

    let roverPlaced = false;
    while (!roverPlaced) {
      const randY = Math.floor(Math.random() * grid.length);
      const randX = Math.floor(Math.random() * grid[0].length);
      if (this.grid[randY][randX] === CellType.Empty) {
        this.grid[randY][randX] = CellType.Rover;
        this.state.position = { x: randX, y: randY };
        roverPlaced = true;
      }
    }
    if (enableCamera) {
      this.camera = new BasicCamera(1);
      this.state.seen = this.camera.look(this.state.position, this.grid);
    }

    this.broker = new MqttBroker(brokerUrl, "rover-broker");

    this.broker.waitForConnection().then(() => {
      this.broker.publishInitialization({
        position: this.state.position,
        orientation: this.state.orientation,
        mapWidth: this.grid[0].length,
        mapHeight: this.grid.length,
        debug: this.debug,
        enableCamera: enableCamera,
      });
      if (this.camera) {
        this.state.seen = this.camera.look(this.state.position, this.grid);
      }
      this.broker.publishState(this.state);
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
    command: CommandRover.FORWARD | CommandRover.BACKWARD,
  ): { dx: number; dy: number } {
    let { dx, dy } = Rover.moveVectors[this.state.orientation];
    if (command === CommandRover.BACKWARD) {
      dx = -dx;
      dy = -dy;
    }
    return { dx, dy };
  }

  private move(command: CommandRover.FORWARD | CommandRover.BACKWARD): boolean {
    const { x, y } = this.state.position;
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
    this.state.position = { x: newX, y: newY };

    return true;
  }

  private turnLeft() {
    switch (this.state.orientation) {
      case RoverOrientation.NORTH:
        this.state.orientation = RoverOrientation.WEST;
        break;
      case RoverOrientation.EAST:
        this.state.orientation = RoverOrientation.NORTH;
        break;
      case RoverOrientation.SOUTH:
        this.state.orientation = RoverOrientation.EAST;
        break;
      case RoverOrientation.WEST:
        this.state.orientation = RoverOrientation.SOUTH;
        break;
    }
  }

  private turnRight() {
    switch (this.state.orientation) {
      case RoverOrientation.NORTH:
        this.state.orientation = RoverOrientation.EAST;
        break;
      case RoverOrientation.EAST:
        this.state.orientation = RoverOrientation.SOUTH;
        break;
      case RoverOrientation.SOUTH:
        this.state.orientation = RoverOrientation.WEST;
        break;
      case RoverOrientation.WEST:
        this.state.orientation = RoverOrientation.NORTH;
        break;
    }
  }

  private printGrid() {
    if (!this.debug) return;
    console.log("Current grid state:");
    console.log(
      this.grid.map((row) => row.map((cell) => cell).join(" ")).join("\n"),
    );
    console.log(
      `Rover position: (${this.state.position.x}, ${this.state.position.y}), Orientation: ${this.state.orientation}`,
    );
  }

  followInstructions(instructions: CommandRover[]) {
    this.state.seen = [];
    for (const [index, command] of instructions.entries()) {
      this.state.isLastCommand = index === instructions.length - 1;

      this.state.lastCommand = command;
      switch (command) {
        case CommandRover.FORWARD:
          if (!this.move(CommandRover.FORWARD)) {
            this.state.successed = false;
            this.error(
              `Failed to move forward from position (${this.state.position.x}, ${this.state.position.y})`,
            );
            this.broker.publishState(this.state);
            return;
          }
          if (this.camera) {
            this.state.seen = this.camera.look(this.state.position, this.grid);
          }
          break;
        case CommandRover.BACKWARD:
          if (!this.move(CommandRover.BACKWARD)) {
            this.state.successed = false;
            this.error(
              `Failed to move backward from position (${this.state.position.x}, ${this.state.position.y})`,
            );
            this.broker.publishState(this.state);
            return;
          }
          if (this.camera) {
            this.state.seen = this.camera.look(this.state.position, this.grid);
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
          this.state.lastCommand = command;
          this.state.successed = false;
          this.broker.publishState(this.state);
          return;
      }
      this.state.successed = true;
      this.broker.publishState(this.state);
    }
    this.log(
      `Rover moved successfully to position (${this.state.position.x}, ${this.state.position.y}) facing ${this.state.orientation}`,
    );
    return;
  }

  public getState(): StateRover {
    return { ...this.state };
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
