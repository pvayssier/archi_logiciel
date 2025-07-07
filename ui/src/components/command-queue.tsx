import React from "react";
import { CommandRover } from "../../../src/models/command-rover";

const commandLabels: Record<CommandRover, string> = {
  [CommandRover.FORWARD]: "FORWARD",
  [CommandRover.BACKWARD]: "BACKWARD",
  [CommandRover.LEFT]: "LEFT",
  [CommandRover.RIGHT]: "RIGHT",
};

export function CommandQueue({ commands }: { commands: CommandRover[] }) {
  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white p-3 rounded-md max-w-xs font-mono select-none pointer-events-none">
      <strong className="block mb-1">Commandes en file :</strong>
      <ul className="list-disc list-inside mb-1">
        {commands.length === 0 ? (
          <li>Aucune</li>
        ) : (
          commands.map((cmd, i) => <li key={i}>{commandLabels[cmd]}</li>)
        )}
      </ul>
      <small className="text-gray-300">
        Utilise les flèches pour ajouter, <kbd className="px-1">Del</kbd> pour
        retirer,
        <kbd className="px-1">Entrée</kbd> pour envoyer
      </small>
    </div>
  );
}
