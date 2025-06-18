import {CommandEnum} from "./missionControl.interface";
import * as readline from 'readline';
import {UserInputInterface} from "./userInput.interface";

export class UserInput implements UserInputInterface {
  waitForInput(): Promise<CommandEnum[]> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const commands: CommandEnum[] = []
      console.log('Enter your commands, valid inputs : [F, FORWARD, B, BACKWARD, R, RIGHT, L, LEFT')
      console.log('Confirm your entries with : [S, SEND]')

      rl.on('line', (input: string) => {
        const upperCaseInput = input.trim().toUpperCase();
        let errorMessage = `${upperCaseInput} is an invalid input`

        if (['S', 'SEND'].includes(upperCaseInput)) {
          console.log('Received commands :', commands);
          rl.close();
          resolve(commands);
          return;
        }

        if (['F', 'FORWARD'].includes(upperCaseInput)) {
          commands.push(CommandEnum.FORWARD)
          errorMessage = ''
        }

        if (['B', 'BACKWARD'].includes(upperCaseInput)) {
          commands.push(CommandEnum.BACKWARD)
          errorMessage = ''
        }

        if (['R', 'RIGHT'].includes(upperCaseInput)) {
          commands.push(CommandEnum.RIGHT)
          errorMessage = ''
        }

        if (['L', 'FORWARD'].includes(upperCaseInput)) {
          commands.push(CommandEnum.LEFT)
          errorMessage = ''
        }

        console.log(errorMessage)
        console.log(`Commands in line : ${commands.join(', ')}`);
      })
    })
  }
}