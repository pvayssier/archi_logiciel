import {MissionControlInterface} from "./missionControl.interface";
import {NetworkSender} from "./networkSender";
import {Console} from "./console";

export class MissionControl implements MissionControlInterface {
  public networkSender: NetworkSender;
  public console: Console;

  public constructor(networkSender: NetworkSender, console: Console) {
    this.networkSender = networkSender;
    this.console = console;
  }

  async run(): Promise<void> {
    const commands = await this.console.userInput.waitForInput();
    const response = this.networkSender.sendToBroker(commands);
    console.log('response', response);
  }
}