import {CommandEnum, MissionControlInterface} from "./missionControl.interface";
import {UserInput} from "./userInput";
import {NetworkSender} from "./networkSender";

export class MissionControl implements MissionControlInterface {
  public userInput: UserInput;

  public networkSender: NetworkSender;

  public constructor(userInput: UserInput, networkSender: NetworkSender) {
    this.userInput = userInput;
    this.networkSender = networkSender;
  }

  async run(): Promise<void> {
    console.log('mission control');
    const commands = await this.userInput.waitForInput()
    const response = this.networkSender.sendToBroker(commands);
    console.log('response', response);
  }
}