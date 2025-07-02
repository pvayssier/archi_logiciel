import mqtt from "mqtt";
import { CommandRover } from "@model";
import { StateRover } from "@model";
import { InitStateRover } from "@model";
import { Broker } from "./broker.interface";

export class MqttBroker implements Broker {
  public client: mqtt.MqttClient;
  private commandCallback?: (message: CommandRover[]) => void;
  private etatCallback?: (message: StateRover) => void;
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
        identifiant,
      );
      this.isConnected = true;
    });

    this.client.on("message", (topic, message) => {
      const parsedMessage = JSON.parse(message.toString());

      if (topic === "commands" && this.commandCallback) {
        this.commandCallback(parsedMessage);
      } else if (topic === "etat" && this.etatCallback) {
        this.etatCallback(parsedMessage);
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

  subscribeToState(callback: (etat: StateRover) => void): void {
    this.client.subscribe("etat");
    this.etatCallback = (etat) => {
      callback(etat);
    };
  }

  subscribeToInitialization(
    callback: (initEtatRover: InitStateRover) => void,
  ): void {
    this.client.subscribe("initialization");
    this.initializationCallback = (initEtatRover) => {
      callback(initEtatRover);
    };
  }

  publishCommand(commands: CommandRover[]): void {
    console.log("in broker :", commands);
    this.client.publish("commands", JSON.stringify(commands));
  }

  publishState(etat: StateRover): void {
    this.client.publish("etat", JSON.stringify(etat), {
      retain: true,
    });
  }

  publishInitialization(initEtatRover: InitStateRover): void {
    this.client.publish("initialization", JSON.stringify(initEtatRover), {
      retain: true,
    });
  }
}
