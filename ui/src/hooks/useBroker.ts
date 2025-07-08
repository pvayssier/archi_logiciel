import { useEffect, useState } from "react";
import { InitStateRover } from "../../../src/models/init-rover.interface";
import { StateRover } from "../../../src/models/state-rover.interface";
import { MqttBroker } from "../../../src/broker/mqtt-broker";

export const useBroker = () => {
  const [initState, setInitState] = useState<InitStateRover | null>(null);
  const [state, setState] = useState<StateRover | null>(null);
  const [broker, setBroker] = useState<MqttBroker | null>(null);

  useEffect(() => {
    const instance = new MqttBroker("mqtt://127.0.0.1:1883", "frontend-client");
    setBroker(instance);

    instance.waitForConnection().then(() => {
      instance.subscribeToInitialization((msg) => {
        console.log("Init received:", msg);
        setInitState(msg);
      });

      instance.subscribeToState((msg) => {
        console.log("State received:", msg);
        setState(msg);
      });
    });

    return () => {
      instance.client.end();
    };
  }, []);

  return { initState, state, broker };
};
