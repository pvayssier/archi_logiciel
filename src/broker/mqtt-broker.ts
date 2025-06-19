import mqtt from 'mqtt';
import { CommandRover } from '@model';
import { EtatRover } from '@model';
import { Broker } from './broker.interface';

export class MqttBroker implements Broker {
  public client: mqtt.MqttClient;
  private commandCallback?: (message: CommandRover[]) => void;
  private responseCallback?: (message: EtatRover) => void;

  constructor(brokerUrl: string, identifiant: string) {
    this.client = mqtt.connect(brokerUrl, {
      clientId: identifiant,
    });

    this.client.on('connect', () => {
      console.log('[MQTT BROKER] Connected to', brokerUrl);
    });

    this.client.on('message', (topic, message) => {
      const parsedMessage = JSON.parse(message.toString());

      if (topic === 'commands' && this.commandCallback) {
        this.commandCallback(parsedMessage);
      } else if (topic === 'responses' && this.responseCallback) {
        this.responseCallback(parsedMessage);
      }
    });
  }

  subscribeToCommands(callback: (commands: CommandRover[]) => void): void {
    this.client.subscribe('commands');
    this.commandCallback = (commands) => {
      callback(commands);
    };
  }

  subscribeToResponses(callback: (response: EtatRover) => void): void {
    this.client.subscribe('responses');
    this.responseCallback = (response) => {
      callback(response);
    };
  }

  publishCommand(commands: CommandRover[]): void {
    this.client.publish('commands', JSON.stringify(commands));
  }

  publishResponse(response: EtatRover): void {
    this.client.publish('responses', JSON.stringify(response));
  }
}

// Example usage:

// const brokerUrl = 'mqtt://172.20.10.3:1883'; // Change this to your MQTT broker URL
// const mqttBroker = new MqttBroker(brokerUrl, 'test');
// mqttBroker.subscribeToCommands((commands) => {
//   console.log('[MQTT BROKER] Received commands:', commands);
// });

// mqttBroker.publishCommand([
//   CommandRover.FORWARD,
//   CommandRover.LEFT,
//   CommandRover.RIGHT,
// ]);
