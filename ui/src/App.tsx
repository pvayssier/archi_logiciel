import React, { useEffect, useState } from "react";
import { StateRover } from "../../src/models/state-rover.interface";
import { InitStateRover } from "../../src/models/init-rover.interface";

import { MqttBroker } from "../../src/broker/mqtt-broker";
import { Map } from "./components/map";

const broker = new MqttBroker("ws://127.0.0.1:9001", "frontend");

export default function App() {
  const [init, setInit] = useState<InitStateRover | null>(null);
  const [state, setState] = useState<StateRover | null>(null);

  useEffect(() => {
    const start = async () => {
      await broker.waitForConnection();

      broker.subscribeToInitialization((initData) => {
        console.log("[App] Init state received:", initData);
        setInit(initData);
      });

      broker.subscribeToState((stateData) => {
        console.log("[App] State received:", stateData);
        setState(stateData);
      });
    };

    start();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {init && state ? (
        <Map init={init} state={state} />
      ) : (
        <p className="text-gray-500">En attente des données du rover...</p>
      )}
    </div>
  );
}
