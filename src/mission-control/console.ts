import { UserInput } from "./user-input";
import { ConsoleInterface } from "./console.interface";
import { Map } from "./map";

export class Console implements ConsoleInterface {
  public map: Map;
  public userInput: UserInput;

  public constructor() {
    this.map = new Map();
    this.map.mapDisplay();
    this.userInput = new UserInput();
    this.explainCommand();
  }

  explainCommand(): void {
    console.log(
      "Enter your commands, valid inputs: [F, FORWARD, B, BACKWARD, R, RIGHT, L, LEFT]",
    );
    console.log("Press ENTER after each commands");
    console.log("Confirm your final entries with: [S, SEND]");
  }
}
