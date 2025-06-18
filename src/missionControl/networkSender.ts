import {NetworkSenderInterface} from "./networkSender.interface";
import {CommandRover} from "../model/CommandRover";

export class NetworkSender implements NetworkSenderInterface {
  sendToBroker(commands: CommandRover[]): { position: [number, number]; orientation: string; movedToEnd: boolean } {
    console.log('broker', commands)

    return { position: [0, 0], orientation: "N", movedToEnd: true}
  }
}