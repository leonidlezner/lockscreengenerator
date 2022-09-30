import { useEffect, useRef } from "react";
import Konva from "konva";

export default function Preview(props) {
  const stageRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const panelWidth = props.width / props.pixelRatio;
  const panelHeight = props.height / props.pixelRatio;

  function handleDownload() {
    const anchor = document.createElement("a");
    anchor.href = stageRef.current.toDataURL({ pixelRatio: props.pixelRatio });
    anchor.download = `background_${props.width}_${props.height}.png`;
    anchor.click();
  }

  function createSolidBackground(color) {
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      fill: color,
      width: panelWidth,
      height: panelHeight,
    });

    return rect;
  }

  function createStage() {
    const stage = new Konva.Stage({
      container: canvasContainerRef.current,
      width: panelWidth,
      height: panelHeight,
    });

    return stage;
  }

  function createCard() {
    const cardWidth = panelWidth * 0.8;
    const cardX = panelWidth / 2 - cardWidth / 2;
    const textPadding = 12;

    const group = new Konva.Group({
      draggable: true,
      x: cardX,
      y: 60,
    });

    group.on("dragmove", () => {
      group.x(cardX);
    });

    const textFields = props.lines.map((line, index) => {
      return new Konva.Text({
        x: textPadding,
        y: textPadding,
        text: line.text,
        align: "center",
        width: cardWidth - textPadding * 2,
        fontSize: line.fontSize ?? 18,
        fontFamily: line.fontFamily ?? "Calibri",
        fill: line.color ?? "#fff",
        wrap: "word",
        lineHeight: 1.5,
      }).cache({
        drawBorder: true,
      });
    });

    let totalTextHeight = textFields.reduce(
      (prevField, currentField) =>
        prevField + currentField.getClientRect().height,
      0
    );

    totalTextHeight += textPadding * 2;

    const rect = new Konva.Rect({
      fill: "#000",
      width: cardWidth,
      height: totalTextHeight,
      shadowColor: "#666",
      shadowBlur: 5,
      opacity: 0.9,
      cornerRadius: 10,
    }).cache({
      drawBorder: true,
    });

    group.add(rect);

    for (let i = 0; i < textFields.length; i++) {
      if (i > 0) {
        const lastY =
          textFields[i - 1].y() + textFields[i - 1].getClientRect().height;
        textFields[i].y(lastY);
      }

      group.add(textFields[i]);
    }

    return group;
  }

  useEffect(() => {
    stageRef.current = createStage();

    const layer = new Konva.Layer();

    layer.add(createSolidBackground("#ff0"));

    layer.add(createCard());

    stageRef.current.add(layer);
  }, [panelWidth, panelHeight]);

  const downloadPanel = (
    <div>
      <button
        onClick={handleDownload}
        className="w-full bg-purple-700 p-2 font-semibold text-purple-200 hover:bg-purple-600"
      >
        Download
      </button>
    </div>
  );

  return (
    <div className="space-y-1">
      <div>{downloadPanel}</div>
      <div ref={canvasContainerRef}></div>
      <div>{downloadPanel}</div>
    </div>
  );
}
