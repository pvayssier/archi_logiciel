export interface IBroker {
  publishCommand(command: object): void;
  subscribeToCommands(callback: (command: object) => void): void;

  publishResponse(response: object): void;
  subscribeToResponses(callback: (response: object) => void): void;
}
