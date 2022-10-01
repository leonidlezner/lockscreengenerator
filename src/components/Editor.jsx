import { useState } from "react";
import Preview from "./Preview";
import Settings, { defaultSettings } from "./Settings";

export default function Editor() {
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <div className="bg-red-50 sm:flex">
      <div className="bg-green-100 p-2 sm:flex-1">
        <h1 className="bg-green-200 p-2 font-semibold">Settings</h1>
        <Settings settings={settings} setSettings={setSettings} />
      </div>
      <div className="bg-blue-100 p-2 md:w-72 lg:w-96">
        <Preview
          width={settings.screenSize.width}
          height={settings.screenSize.height}
          bottomOffset={settings.screenSize.bottomOffset}
          lines={settings.lines}
          image={settings.image}
        />
      </div>
    </div>
  );
}
