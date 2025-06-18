import {CommandEnum} from "./missionControl.interface";
import {NetworkSenderInterface} from "./networkSender.interface";

export class NetworkSender implements NetworkSenderInterface {
  sendToBroker(commands: CommandEnum[]): { position: [number, number]; movedToEnd: boolean } {
    console.log('broker', commands)

    return { position: [0, 0], movedToEnd: true}
  }
}