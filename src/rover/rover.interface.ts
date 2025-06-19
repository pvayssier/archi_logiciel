import { CommandRover } from '@model';
import { EtatRover } from '@model';

export interface Rover {
  followInstructions(instructions: [CommandRover]): EtatRover;
}