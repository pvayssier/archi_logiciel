import React from "react";
import Cell from "./components/cell";

export default function App() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-2xl font-bold">Hello from UI</p>
      <p>This is a simple React application.</p>

      <Cell />
    </div>
  );
}
