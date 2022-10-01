import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import createCard from "./createCard";
import BusyOverlay from "./BusyOverlay";

export default function Preview(props) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const backgroundRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const pixelRatio = useRef(1);
  const [isBusy, setIsBusy] = useState(false);

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

  function createImageBackground() {
    const [panelWidth, panelHeight] = panelDimensions();

    let image = new Konva.Image({
      x: 0,
      y: 0,
      width: panelWidth,
      height: panelHeight,
    });

    return image;
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

  function positionImage(center) {
    const [panelWidth, panelHeight] = panelDimensions();

    const imageRatio = backgroundRef.current.image().height / panelHeight;

    backgroundRef.current.setAttrs({
      cropX:
        backgroundRef.current.image().width * (center ?? 0.5) - panelWidth / 2,
      cropY: 0,
      cropWidth: panelWidth * imageRatio,
      cropHeight: backgroundRef.current.image().height,
    });
  }

  function updateImage() {
    setIsBusy(true);

    const image = new Image();

    image.onload = () => {
      setIsBusy(false);
      backgroundRef.current.image(image);
      positionImage(props.image.center);
    };

    image.onerror = () => {
      setIsBusy(false);
      alert("Cannot load the image");
    };

    image.src = `/images/${props.image.file}`;
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

    cardRef.current = createCard({
      lines: props.lines,
      panelDimensions: panelDimensions,
      bottomOffset: props.bottomOffset,
      pixelRatio: pixelRatio.current,
    });

    //backgroundRef.current = createSolidBackground("#444");
    backgroundRef.current = createImageBackground();
    updateImage();

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

  useEffect(() => {
    updateImage();
  }, [props.image]);

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
    <div className="relative" ref={previewContainerRef}>
      <div className="space-y-1">
        <div>{downloadPanel}</div>
        <div ref={canvasContainerRef}></div>
        <div>{downloadPanel}</div>
      </div>
      {isBusy && <BusyOverlay />}
    </div>
  );
}
