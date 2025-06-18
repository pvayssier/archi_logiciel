import mqtt from 'mqtt';
import { CommandRover } from '../models/CommandRover';
import { EtatRover } from '../models/EtatRover';
import { Broker } from './broker.interface';

export class MqttBroker implements Broker {
  public client: mqtt.MqttClient;
  private topicCallbacks: Map<
    string,
    (message: CommandRover[] | EtatRover) => void
  > = new Map();

  constructor(brokerUrl: string, identifiant: string) {
    this.client = mqtt.connect(brokerUrl, {
      clientId: identifiant,
    });

    this.client.on('connect', () => {
      console.log('[MQTT BROKER] Connected to', brokerUrl);
    });

    this.client.on('message', (topic, message) => {
      const callback = this.topicCallbacks.get(topic);
      if (callback) {
        try {
          console.log(message.toString());
          console.log(JSON.parse(message.toString()));
          const parsedMessage = JSON.parse(message.toString());
          callback(parsedMessage);
        } catch (error) {
          console.error(
            `[MQTT BROKER] Error parsing message on topic ${topic}:`,
            error
          );
        }
      } else {
        console.warn(`[MQTT BROKER] No callback registered for topic ${topic}`);
      }
    });
  }

  subscribeToCommands(callback: (commands: CommandRover[]) => void): void {
    this.client.subscribe('commands');
    this.topicCallbacks.set('commands', (message) => {
      const commands = JSON.parse(message.toString());
      callback(commands);
    });
  }

  subscribeToResponses(callback: (response: EtatRover) => void): void {
    this.client.subscribe('responses');
    this.topicCallbacks.set('responses', (message) => {
      const response = JSON.parse(message.toString());
      callback(response);
    });
  }

  publishCommand(commands: CommandRover[]): void {
    this.client.publish('commands', JSON.stringify(commands));
  }

  publishResponse(response: EtatRover): void {
    this.client.publish('responses', JSON.stringify(response));
  }
}

const brokerUrl = 'mqtt://172.20.10.3:1883'; // Change this to your MQTT broker URL
const mqttBroker = new MqttBroker(brokerUrl, 'test');
mqttBroker.subscribeToCommands((commands) => {
  console.log('[MQTT BROKER] Received commands:', commands);
});

mqttBroker.publishCommand([
  CommandRover.FORWARD,
  CommandRover.LEFT,
  CommandRover.RIGHT,
]);
