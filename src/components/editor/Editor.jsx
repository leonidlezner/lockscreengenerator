import { IMAGES } from "../../data/images";
import { SCREENSIZES } from "../../data/screensizes";
import useStorageState from "../../helpers/useStorageState";
import Preview from "../preview/Preview";
import Settings, { defaultSettings } from "../settings/Settings";

export default function Editor() {
  const [settings, setSettings] = useStorageState(defaultSettings, "settings");

  return (
    <div className="overflow-hidden sm:flex sm:rounded-md">
      <div className="bg-gray-100 p-3 sm:flex-1">
        <div className="mb-3 p-2">
          <h1 className="font-semibold">Configure your lock screen image</h1>
          <p className="text-sm text-gray-500">
            Privacy note: This app works solely in your browser and sends no
            information to the server.
          </p>
        </div>
        <Settings settings={settings} setSettings={setSettings} />
      </div>
      <div className="bg-gray-700 p-3 md:w-72 lg:w-96">
        <Preview
          width={SCREENSIZES[settings.screenSize].width}
          height={SCREENSIZES[settings.screenSize].height}
          bottomOffset={SCREENSIZES[settings.screenSize].bottomOffset}
          lines={settings.lines}
          image={IMAGES[settings.image]}
          vCard={settings.vCardData}
        />
      </div>
    </div>
  );
}
