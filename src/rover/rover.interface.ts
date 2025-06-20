import { CommandRover } from "@model";

export interface IRover {
  followInstructions(commands: CommandRover[]): void;
}
