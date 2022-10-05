import { SCREENSIZES } from "../../data/screensizes";
import { IMAGES } from "../../data/images";
import SettingsElement from "./SettingsElement";
import SelectElement from "./SelectElement";
import SettingsLines from "./SettingsLines";
import TabContainer from "./tabs/TabContainer";
import Tab from "./tabs/Tab";
import SettingsVCard from "./vcard/SettingsVCard";

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

  //console.log(settings.vCardData);

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

      <TabContainer>
        <Tab caption="📝 Text">
          <SettingsLines
            name="lines"
            onChange={handleChange}
            value={settings.lines}
          />
        </Tab>
        <Tab caption="🪪 VCard">
          <SettingsVCard
            name="vCardData"
            values={settings.vCardData}
            onChange={handleChange}
            delay={1000}
          />
        </Tab>
      </TabContainer>
    </div>
  );
}

export const defaultSettings = {
  version: 4,
  screenSize: 0,
  image: 0,
  lines: [
    {
      text: "Please return to",
      fontSize: 0,
    },
    {
      text: "Firstname Lastname",
      fontSize: 0,
    },
    {
      text: "firstname.lastname@company.com",
      fontSize: 0,
    },
    {
      text: "0123456678",
      fontSize: 0,
    },
  ],
  vCardData: {
    firstName: "",
    lastName: "",
    phone: "",
    eMail: "",
    company: "",
  },
};
