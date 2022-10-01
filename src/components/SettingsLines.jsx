import { useState } from "react";
import SettingsElement from "./SettingsElement";

export default function SettingsLines({ name, onChange, value }) {
  const [lines, setLines] = useState(value);

  function handleChange(index, event) {
    setLines((prevLines) => {
      return prevLines.map((line, i) =>
        index === i ? { ...line, text: event.target.value } : line
      );
    });
  }

  broken here

  const lineElement = (line, index) => {
    return (
      <SettingsElement key={index} name={`${name}`} label={`Line ${index + 1}`}>
        <input
          className="block w-full appearance-none rounded-md border-2 border-gray-300 bg-gray-50 px-3 py-1"
          type="text"
          value={line.text}
          id={`${name}`}
          onChange={(event) => handleChange(index, event)}
        />
      </SettingsElement>
    );
  };

  return (
    <div className="space-y-2">
      {lines.map((line, index) => lineElement(line, index))}
    </div>
  );
}
