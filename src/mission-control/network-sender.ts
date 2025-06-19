import { CommandRover } from '@model';
import { NetworkSenderInterface } from './network-sender.interface';

export class NetworkSender implements NetworkSenderInterface {
  sendToBroker(commands: CommandRover[]): {
    position: [number, number];
    orientation: string;
    movedToEnd: boolean;
  } {
    console.log('broker', commands);

    return { position: [0, 0], orientation: 'N', movedToEnd: true };
  }
}
