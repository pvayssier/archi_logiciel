import { CommandRover } from '@model';
import { NetworkSenderInterface } from "@missionControl";
import { Broker } from "@broker";

export class NetworkSender implements NetworkSenderInterface {
  public broker: Broker;

  public constructor(broker: Broker) {
    this.broker = broker
  }

  sendToBroker(commands: CommandRover[]): void {
    this.broker.publishCommand(commands);
  }
}
