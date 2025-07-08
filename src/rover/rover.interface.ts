import { CommandRover } from "@model";

export interface Rover {
  followInstructions(commands: CommandRover[]): void;
}
