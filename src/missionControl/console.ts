import {UserInput} from "./userInput";
import {ConsoleInterface} from "./console.interface";
import {Map} from "./map";

export class Console implements ConsoleInterface{
  public map: Map;
  public userInput: UserInput;

  public constructor(userInput: UserInput, map: Map) {
    this.map = map;
    this.map.mapDisplay();
    this.userInput = userInput;
    this.explainCommand();

    const randomX = Math.floor(Math.random() * 4);
    const randomY = Math.floor(Math.random() * 4);
    this.map.mapUpdate({ x: randomX, y: randomY });
    this.map.mapDisplay();
  }

  explainCommand(): void {
    console.log('Enter your commands, valid inputs: [F, FORWARD, B, BACKWARD, R, RIGHT, L, LEFT]')
    console.log("Press ENTER after each commands")
    console.log('Confirm your final entries with: [S, SEND]')
  }
}