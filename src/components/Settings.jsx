import { SCREENSIZES } from "../data/screensizes";

export default function Settings({ settings, setSettings }) {
  function handleChange(event) {
    const { name, value } = event.target;
    var resolvedValue = value;

    if (name === "screenSize") {
      resolvedValue = SCREENSIZES[value];
    }

    setSettings((prevData) => {
      return {
        ...prevData,
        [name]: resolvedValue,
      };
    });
  }

  const screenSizesElement = (
    <select name="screenSize" onChange={handleChange}>
      {SCREENSIZES.map((el, index) => (
        <option value={index} key={index}>
          {el.title}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <div>{screenSizesElement}</div>
    </div>
  );
}

export const defaultSettings = {
  screenSize: {
    title: SCREENSIZES[0].title,
    width: SCREENSIZES[0].width,
    height: SCREENSIZES[0].height,
    bottomOffset: SCREENSIZES[0].bottomOffset,
  },
  lines: [
    {
      text: "Please return to",
      fontSize: 16,
    },
    {
      text: "Firstname Lastname",
      fontSize: 24,
      color: "#0f0",
    },
    {
      text: "firstname.lastname@company.com",
      fontSize: 16,
    },
    {
      text: "0123456678",
      fontSize: 20,
    },
  ],
};
