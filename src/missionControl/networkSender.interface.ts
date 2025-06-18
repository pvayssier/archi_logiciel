export interface NetworkSenderInterface {
  sendToBroker: (commands: CommandRover[]) => void
}