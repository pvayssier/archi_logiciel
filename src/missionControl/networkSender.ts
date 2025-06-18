import {CommandEnum} from "./missionControl.interface";
import {NetworkSenderInterface} from "./networkSender.interface";

export class NetworkSender implements NetworkSenderInterface {
  sendToBroker(commands: CommandEnum[]): { position: [number, number]; orientation: string; movedToEnd: boolean } {
    console.log('broker', commands)

    return { position: [0, 0], orientation: "N", movedToEnd: true}
  }
}