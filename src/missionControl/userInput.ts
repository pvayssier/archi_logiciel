import {CommandEnum} from "./missionControl.interface";
import * as readline from 'readline';
import {UserInputInterface} from "./userInput.interface";

function explainCommand(): void {
  console.log('Enter your commands, valid inputs: [F, FORWARD, B, BACKWARD, R, RIGHT, L, LEFT]')
  console.log("Press ENTER after each commands")
  console.log('Confirm your final entries with: [S, SEND]')
}

function getCommandByInput(input: string): CommandEnum | undefined {
  if (['F', 'FORWARD'].includes(input)) {
    return CommandEnum.FORWARD
  }

  if (['B', 'BACKWARD'].includes(input)) {
    return CommandEnum.BACKWARD
  }

  if (['R', 'RIGHT'].includes(input)) {
    return CommandEnum.RIGHT
  }

  if (['L', 'LEFT'].includes(input)) {
    return CommandEnum.LEFT
  }
}

export class UserInput implements UserInputInterface {
  waitForInput(): Promise<CommandEnum[]> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const commands: CommandEnum[] = []
      explainCommand()

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