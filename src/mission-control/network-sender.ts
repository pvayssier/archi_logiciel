import { CommandRover } from "@model";
import { Broker } from "@broker";

import { NetworkSenderInterface } from "./network-sender.interface";

export class NetworkSender implements NetworkSenderInterface {
  public broker: Broker;

  public constructor(broker: Broker) {
    this.broker = broker;
  }

  sendToBroker(commands: CommandRover[]): void {
    this.broker.publishCommand(commands);
  }
}
