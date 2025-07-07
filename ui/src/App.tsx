import React, { useEffect, useState } from "react";
import { StateRover } from "../../src/models/state-rover.interface";
import { InitStateRover } from "../../src/models/init-rover.interface";
import { CommandRover } from "../../src/models/command-rover";
import { MqttBroker } from "../../src/broker/mqtt-broker";
import { CellType } from "../../src/models/cell-type";

import { CommandQueue } from "./components/command-queue";
import { Map as MapComponent } from "./components/map";
import { CellProps } from "./components/cell";

const broker = new MqttBroker("ws://127.0.0.1:9001", "frontend");

const KEY_TO_COMMAND: Record<string, CommandRover> = {
  ArrowUp: CommandRover.FORWARD,
  ArrowLeft: CommandRover.LEFT,
  ArrowRight: CommandRover.RIGHT,
  ArrowDown: CommandRover.BACKWARD,
};

const commandLabels: Record<CommandRover, string> = {
  [CommandRover.FORWARD]: "FORWARD",
  [CommandRover.BACKWARD]: "BACKWARD",
  [CommandRover.LEFT]: "LEFT",
  [CommandRover.RIGHT]: "RIGHT",
};

export default function App() {
  const [cellsMap, setCellsMap] = useState<Map<String, CellProps>>(
    new window.Map<String, CellProps>()
  );
  const [init, setInit] = useState<InitStateRover | null>(null);
  const [state, setState] = useState<StateRover | null>(null);
  const [commands, setCommands] = useState<CommandRover[]>([]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.key in KEY_TO_COMMAND) {
        setCommands((prev) => [...prev, KEY_TO_COMMAND[e.key]]);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        setCommands((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        setCommands((prev) => {
          if (prev.length > 0) {
            console.log("[App] Sending commands:", prev);
            broker.publishCommand(prev);
            return [];
          }
          return prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    console.log("[APPTEST] State Received:", state);
    if (!state) return;

    setCellsMap((prevMap) => {
      const newMap = new Map(prevMap);

      for (const [key, cell] of newMap.entries()) {
        if (cell.cellType === CellType.ROVER) {
          newMap.set(key, {
            ...cell,
            cellType: CellType.EMPTY,
            orientation: undefined,
          });
        }
      }
      newMap.set(`${state.position.x}:${state.position.y}`, {
        orientation: state.orientation,
        cellType: CellType.ROVER,
        Position: { x: state.position.x, y: state.position.y },
      });
      for (const cell of state.seen) {
        const existing = newMap.get(`${cell.position.x}:${cell.position.y}`);
        if (existing) {
          continue;
        }
        newMap.set(`${cell.position.x}:${cell.position.y}`, {
          orientation: undefined,
          cellType: cell.type,
          Position: { x: cell.position.x, y: cell.position.y },
        });
      }
      return newMap;
    });
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      {init && state ? (
        <>
          <MapComponent init={init} state={state} cellsMap={cellsMap} />
          <CommandQueue commands={commands} />
        </>
      ) : (
        <p className="text-gray-500">En attente des données du rover...</p>
      )}
    </div>
  );
}
