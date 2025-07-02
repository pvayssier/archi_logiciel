import { MissionControlInterface } from "./mission-control.interface";
import { NetworkSender } from "./network-sender";
import { Console } from "./console";
import { Broker, MqttBroker } from "@broker";
import { InitStateRover, StateRover } from "@model";

export class MissionControl implements MissionControlInterface {
  public broker: Broker;
  public networkSender: NetworkSender;
  public console: Console;

  public constructor(brokerUrl: string) {
    this.broker = new MqttBroker(brokerUrl, "mission-broker");
    this.networkSender = new NetworkSender(this.broker);
    this.console = new Console();
    console.log("Waiting for initialization...");

    this.broker.subscribeToInitialization((initStateRover: InitStateRover) => {
      console.log("Initialization started", initStateRover);
      this.console.map.mapInit(initStateRover);
      this.console.map.mapDisplay();
      console.log("Current rover orientation: ", initStateRover.orientation);
      this.console.explainCommand();
    });

    this.broker.subscribeToState((stateRover: StateRover) => {
      this.console.map.mapUpdate(stateRover);
      this.console.map.mapDisplay();
    });
  }

  async run(): Promise<void> {
    while (true) {
      const commands = await this.console.userInput.waitForInput();
      this.networkSender.sendToBroker(commands);
    }
  }
}
