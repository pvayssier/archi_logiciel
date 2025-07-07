import mqtt from "mqtt";
import { CommandRover } from "@model";
import { StateRover } from "@model";
import { InitStateRover } from "@model";
import { Broker } from "./broker.interface";

export class MqttBroker implements Broker {
  public client: mqtt.MqttClient;
  private commandCallback?: (message: CommandRover[]) => void;
  private stateCallback?: (message: StateRover) => void;
  private initializationCallback?: (message: InitStateRover) => void;
  private isConnected: boolean = false;

  constructor(brokerUrl: string, identifiant: string) {
    this.client = mqtt.connect(brokerUrl, {
      clientId: identifiant,
    });

    this.client.on("connect", () => {
      console.log(
        "[MQTT BROKER] Connected to",
        brokerUrl,
        "with ID:",
        identifiant
      );
      this.isConnected = true;
    });

    this.client.on("message", (topic, message) => {
      const parsedMessage = JSON.parse(message.toString());

      if (topic === "commands" && this.commandCallback) {
        this.commandCallback(parsedMessage);
      } else if (topic === "state" && this.stateCallback) {
        this.stateCallback(parsedMessage);
      } else if (topic === "initialization" && this.initializationCallback) {
        this.initializationCallback(parsedMessage);
      }
    });
  }

  public waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
      } else {
        this.client.on("connect", () => resolve());
        this.client.on("error", (err) => reject(err));
      }
    });
  }

  subscribeToCommands(callback: (commands: CommandRover[]) => void): void {
    this.client.subscribe("commands");
    this.commandCallback = (commands) => {
      callback(commands);
    };
  }

  subscribeToState(callback: (state: StateRover) => void): void {
    this.client.subscribe("state");
    this.stateCallback = (state) => {
      callback(state);
    };
  }

  subscribeToInitialization(
    callback: (initEtatRover: InitStateRover) => void
  ): void {
    this.client.subscribe("initialization");
    this.initializationCallback = (initStateRover) => {
      callback(initStateRover);
    };
  }

  publishCommand(commands: CommandRover[]): void {
    console.log("in broker :", commands);
    this.client.publish("commands", JSON.stringify(commands));
  }

  publishState(state: StateRover): void {
    this.client.publish("state", JSON.stringify(state), {
      retain: true,
    });
  }

  publishInitialization(initStateRover: InitStateRover): void {
    this.client.publish("initialization", JSON.stringify(initStateRover), {
      retain: true,
    });
  }
}
