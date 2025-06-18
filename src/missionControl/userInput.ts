import * as readline from 'readline';
import {UserInputInterface} from "./userInput.interface";
import { CommandRover } from '../model/CommandRover';

function getCommandByInput(input: string): CommandRover | undefined {
  if (['F', 'FORWARD'].includes(input)) {
    return CommandRover.FORWARD
  }

  if (['B', 'BACKWARD'].includes(input)) {
    return CommandRover.BACKWARD
  }

  if (['R', 'RIGHT'].includes(input)) {
    return CommandRover.RIGHT
  }

  if (['L', 'LEFT'].includes(input)) {
    return CommandRover.LEFT
  }
}

export class UserInput implements UserInputInterface {
  waitForInput(): Promise<CommandRover[]> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const commands: CommandRover[] = []

      rl.on('line', (input: string) => {
        const upperCaseInput = input.trim().toUpperCase();
        let errorMessage = `${upperCaseInput} is an invalid input`

        if (['S', 'SEND'].includes(upperCaseInput)) {
          console.log('Received commands :', commands);
          rl.close();
          resolve(commands);
          return;
        }

        const command = getCommandByInput(upperCaseInput);

        if (command) {
          commands.push(command);
          errorMessage = ''
        }

        console.log(errorMessage)
        console.log(`Commands in line: ${commands.join(', ')}`);
      })
    })
  }
}