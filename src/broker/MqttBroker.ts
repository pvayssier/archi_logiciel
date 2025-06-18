import mqtt from 'mqtt';
import { CommandRover } from '../models/CommandRover';
import { EtatRover } from '../models/EtatRover';
import { IBroker } from './IBroker';

export class MqttBroker implements IBroker {
  private client: mqtt.MqttClient;
  private topicCallbacks: Map<string, (message: object) => void> = new Map();

  constructor(brokerUrl: string) {
    this.client = mqtt.connect(brokerUrl);

    this.client.on('connect', () => {
      console.log('[MQTT BROKER] Connected to', brokerUrl);
    });
  }

  subscribeToCommands(callback: (command: object) => void): void {
    this.client.subscribe('commands');
    this.topicCallbacks.set('commands', (message) => {
      const cmd = JSON.parse(message.toString());
      callback(cmd);
    });
  }

  subscribeToResponses(callback: (response: object) => void): void {
    this.client.subscribe('responses');
    this.client.on('message', (topic, message) => {
      if (topic === 'responses') {
        const res = JSON.parse(message.toString());
        callback(res);
      }
    });
  }

  publishCommand(commands: CommandRover[]): void {
    this.client.publish('commands', JSON.stringify(commands));
  }

  publishResponse(response: EtatRover): void {
    this.client.publish('responses', JSON.stringify(response));
  }
}
