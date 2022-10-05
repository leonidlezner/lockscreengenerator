import { FONTSIZES } from "../../data/fontsizes";
import SelectElement from "./SelectElement";
import SettingsElement from "./SettingsElement";

export default function SettingsLines({ name, onChange, value }) {
  function handleChange(index, event, lineAttr) {
    const newValue = value.map((line, i) =>
      index === i ? { ...line, [lineAttr]: event.target.value } : line
    );

    const customEvent = {
      target: {
        name: name,
        value: newValue,
      },
    };

    onChange(customEvent);
  }

  const lineElement = (line, index) => {
    return (
      <SettingsElement
        key={index}
        name={`text_${name}_${index}`}
        label={`Line ${index + 1}`}
      >
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              className="block w-full appearance-none rounded-md border-2 border-gray-300 bg-gray-50 px-3 py-1 hover:bg-white"
              type="text"
              value={line.text}
              id={`text_${name}_${index}`}
              onChange={(event) => handleChange(index, event, "text")}
              placeholder="Enter text here..."
            />
          </div>
          <div>
            <SelectElement
              id={`fontSize_${name}_${index}`}
              onChange={(event) => handleChange(index, event, "fontSize")}
              value={line.fontSize}
              items={FONTSIZES}
            />
          </div>
        </div>
      </SettingsElement>
    );
  };

  return (
    <div className="space-y-2">
      {value.map((line, index) => lineElement(line, index))}
    </div>
  );
}
