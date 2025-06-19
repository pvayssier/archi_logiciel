import { CommandRover } from '@model';

export interface UserInputInterface {
  waitForInput: () => Promise<CommandRover[]>;
}