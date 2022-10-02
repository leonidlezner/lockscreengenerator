import Konva from "konva";
import { FONTSIZES } from "../data/fontsizes";

export default function createCard({
  num_of_lines,
  panelDimensions,
  bottomOffset,
  pixelRatio,
  cardBckColor,
}) {
  const createElements = () => {
    const textFields = [...Array(num_of_lines).keys()].map((line, index) => {
      return new Konva.Text({
        align: "center",
        wrap: "word",
        lineHeight: 1.5,
        preventDefault: false,
      });
    });

    const cardBackground = new Konva.Rect({
      fill: cardBckColor ?? "#000",
      shadowColor: "#000",
      shadowBlur: 5,
      opacity: 0.6,
      cornerRadius: 10,
      preventDefault: false,
    });

    const cardGroup = new Konva.Group();

    cardGroup.add(cardBackground);

    textFields.forEach((field) => {
      cardGroup.add(field);
    });

    return [textFields, cardBackground, cardGroup];
  };

  const [textFields, cardBackground, cardGroup] = createElements();

  const updateTextFields = (lines, pixelRatio) => {
    for (let i = 0; i < textFields.length; i++) {
      textFields[i].setAttrs({
        text: lines[i].text,
        fontFamily: lines[i].fontFamily ?? "Calibri",
        fill: lines[i].color ?? "#fff",
        fontSize: (FONTSIZES[lines[i].fontSize].fontSize ?? 18) / pixelRatio,
      });
    }
  };

  const positionElements = (pixelRatio) => {
    const [panelWidth, panelHeight] = panelDimensions();
    const cardWidth = panelWidth * 0.8;
    const cardX = panelWidth / 2 - cardWidth / 2;
    const textPadding = 22 / pixelRatio;

    textFields.forEach((field, index) => {
      field.x(textPadding);
      field.width(cardWidth - textPadding * 2);
    });

    let totalTextHeight = textFields.reduce(
      (prevField, currentField) =>
        prevField + currentField.getClientRect().height,
      0
    );

    totalTextHeight += textPadding * 2;

    cardBackground.width(cardWidth);
    cardBackground.height(totalTextHeight);

    cardGroup.x(cardX);
    cardGroup.y(panelHeight - totalTextHeight - bottomOffset / pixelRatio);

    for (let i = 0; i < textFields.length; i++) {
      if (i > 0) {
        const lastY =
          textFields[i - 1].y() + textFields[i - 1].getClientRect().height;
        textFields[i].y(lastY);
      } else {
        textFields[i].y(textPadding);
      }
    }
  };

  positionElements(pixelRatio);

  return {
    group: cardGroup,
    position: positionElements,
    updateTextFields: updateTextFields,
  };
}