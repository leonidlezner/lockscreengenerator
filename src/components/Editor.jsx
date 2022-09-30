import { useState } from "react";
import Preview from "./Preview";
import Settings, { defaultSettings } from "./Settings";

export default function Editor() {
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <div className="flex bg-red-50">
      <div className="flex-1 bg-green-100 p-2">
        <Settings settings={settings} setSettings={setSettings} />
      </div>
      <div className="bg-blue-100 p-2">
        <Preview
          width={settings.screenSize.width}
          height={settings.screenSize.height}
          lines={settings.lines}
          pixelRatio={2}
        />
      </div>
    </div>
  );
}