import { useEffect, useRef } from "react";
import Konva from "konva";

export default function Preview(props) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const backgroundRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const pixelRatio = useRef(1);

  function panelDimensions() {
    return [
      props.width / pixelRatio.current,
      props.height / pixelRatio.current,
    ];
  }

  function handleDownload() {
    const anchor = document.createElement("a");
    anchor.href = stageRef.current.toDataURL({
      pixelRatio: pixelRatio.current,
    });
    anchor.download = `background_${props.width}_${props.height}.png`;
    anchor.click();
  }

  function createSolidBackground(color) {
    const [panelWidth, panelHeight] = panelDimensions();

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
    const [panelWidth, panelHeight] = panelDimensions();

    const stage = new Konva.Stage({
      container: canvasContainerRef.current,
      width: panelWidth,
      height: panelHeight,
    });

    return stage;
  }

  function createCard() {
    const createElements = () => {
      const textFields = props.lines.map((line, index) => {
        return new Konva.Text({
          text: line.text,
          align: "center",
          fontFamily: line.fontFamily ?? "Calibri",
          fill: line.color ?? "#fff",
          wrap: "word",
          lineHeight: 1.5,
        });
      });

      const cardBackground = new Konva.Rect({
        fill: "#000",
        shadowColor: "#666",
        shadowBlur: 5,
        opacity: 0.9,
        cornerRadius: 10,
      });

      const cardGroup = new Konva.Group({
        draggable: true,
      });

      cardGroup.add(cardBackground);

      textFields.forEach((field) => {
        cardGroup.add(field);
      });

      return [textFields, cardBackground, cardGroup];
    };

    const [textFields, cardBackground, cardGroup] = createElements();

    const positionElements = (pixelRatio) => {
      const [panelWidth, panelHeight] = panelDimensions();
      const cardWidth = panelWidth * 0.8;
      const cardX = panelWidth / 2 - cardWidth / 2;
      const textPadding = 22 / pixelRatio;

      textFields.forEach((field, index) => {
        field.x(textPadding);

        field.fontSize((props.lines[index].fontSize ?? 18) / pixelRatio);

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
      cardGroup.y(
        panelHeight - totalTextHeight - props.bottomOffset / pixelRatio
      );

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

    positionElements(pixelRatio.current);

    /* 
    const textFields = props.lines.map((line, index) => {
      return new Konva.Text({
        x: textPadding,
        y: textPadding,
        text: line.text,
        align: "center",
        width: cardWidth - textPadding * 2,
        fontSize: (line.fontSize ?? 18) / pixelRatio.current,
        fontFamily: line.fontFamily ?? "Calibri",
        fill: line.color ?? "#fff",
        wrap: "word",
        lineHeight: 1.5,
      });
    });
 */
    /*     let totalTextHeight = textFields.reduce(
      (prevField, currentField) =>
        prevField + currentField.getClientRect().height,
      0
    );

    totalTextHeight += textPadding * 2; */

    /*     const rect = new Konva.Rect({
      fill: "#000",
      width: cardWidth,
      height: totalTextHeight,
      shadowColor: "#666",
      shadowBlur: 5,
      opacity: 0.9,
      cornerRadius: 10,
    }); */

    /* const group = new Konva.Group({
      draggable: true,
      x: cardX,
      y:
        panelHeight - totalTextHeight - props.bottomOffset / pixelRatio.current,
      width: cardWidth,
      height: totalTextHeight,
    }); */
    /* 
    group.on("dragmove", () => {
      group.x(cardX);
    });

    group.add(rect);

    for (let i = 0; i < textFields.length; i++) {
      if (i > 0) {
        const lastY =
          textFields[i - 1].y() + textFields[i - 1].getClientRect().height;
        textFields[i].y(lastY);
      }

      group.add(textFields[i]);
    } */

    return { group: cardGroup, position: positionElements };
  }

  useEffect(() => {
    const resizeCanvas = () => {
      pixelRatio.current =
        props.width / previewContainerRef.current.offsetWidth;

      const [panelWidth, panelHeight] = panelDimensions();

      if (stageRef.current) {
        stageRef.current.width(panelWidth);
        stageRef.current.height(panelHeight);
      }

      if (backgroundRef.current) {
        backgroundRef.current.width(panelWidth);
        backgroundRef.current.height(panelHeight);
      }

      if (cardRef.current) {
        cardRef.current.position(pixelRatio.current);
      }

      /*       if (cardRef.current) {
        const cardX = panelWidth / 2 - (panelWidth * 0.8) / 2;
        const cardY =
          panelHeight -
          cardRef.current.height() -
          props.bottomOffset / pixelRatio.current;
        cardRef.current.x(cardX);
        cardRef.current.y(cardY);
      } */
    };

    resizeCanvas();

    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        resizeCanvas();
      });
    });

    observer.observe(previewContainerRef.current);

    stageRef.current = createStage();

    const layer = new Konva.Layer();

    cardRef.current = createCard();

    backgroundRef.current = createSolidBackground("#444");

    layer.add(backgroundRef.current);
    layer.add(cardRef.current.group);
    stageRef.current.add(layer);

    return () => {
      observer.disconnect();
      layer.destroy();
      stageRef.current.destroy();
      stageRef.current = null;
      cardRef.current = null;
      backgroundRef.current = null;
    };
  }, [props.width, props.height]);

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
    <div className="space-y-1" ref={previewContainerRef}>
      <div>{downloadPanel}</div>
      <div ref={canvasContainerRef}></div>
      <div>{downloadPanel}</div>
    </div>
  );
}
