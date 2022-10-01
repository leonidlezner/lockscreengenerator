import { SCREENSIZES } from "../data/screensizes";
import { IMAGES } from "../data/images";
import SettingsElement from "./SettingsElement";
import SelectElement from "./SelectElement";
import SettingsLines from "./SettingsLines";

export default function Settings({ settings, setSettings }) {
  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }

  return (
    <div className="space-y-2">
      <SettingsElement name="screenSize" label="Smartphone">
        <SelectElement
          items={SCREENSIZES}
          name="screenSize"
          value={settings.screenSize}
          onChange={handleChange}
        />
      </SettingsElement>

      <SettingsElement name="image" label="Image">
        <SelectElement
          items={IMAGES}
          name="image"
          value={settings.image}
          onChange={handleChange}
        />
      </SettingsElement>

      <SettingsLines
        name="lines"
        onChange={handleChange}
        value={settings.lines}
      />
    </div>
  );
}

export const defaultSettings = {
  screenSize: 0,
  image: 0,
  lines: [
    {
      text: "Please return to",
      fontSize: 32,
    },
    {
      text: "Firstname Lastname",
      fontSize: 48,
      color: "#fff",
    },
    {
      text: "firstname.lastname@company.com",
      fontSize: 32,
    },
    {
      text: "0123456678",
      fontSize: 32,
    },
  ],
};
