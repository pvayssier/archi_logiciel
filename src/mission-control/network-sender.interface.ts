import { CommandRover } from '@model';

export interface NetworkSenderInterface {
  sendToBroker: (commands: CommandRover[]) => void
}