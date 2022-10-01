import { SCREENSIZES } from "../data/screensizes";
import { IMAGES } from "../data/images";

export default function Settings({ settings, setSettings }) {
  function handleChange(event) {
    const { name, value } = event.target;
    var resolvedValue = value;

    if (name === "screenSize") {
      resolvedValue = SCREENSIZES[value];
    }

    if (name === "image") {
      resolvedValue = IMAGES[value];
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

  const imagesElement = (
    <select name="image" onChange={handleChange}>
      {IMAGES.map((el, index) => (
        <option value={index} key={index}>
          {el.title}
        </option>
      ))}
    </select>
  );

  return (
    <div className="bg-emerald-400">
      <div>{screenSizesElement}</div>
      <div>{imagesElement}</div>
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
  image: IMAGES[0],
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
