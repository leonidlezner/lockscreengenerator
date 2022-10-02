import { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import createCard from "../helpers/createCard";
import BusyOverlay from "./BusyOverlay";
import DownloadPanel from "./DownloadPanel";

export default function Preview(props) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const backgroundRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const pixelRatio = useRef(1);
  const [isBusy, setIsBusy] = useState(false);

  const panelDimensions = useCallback(() => {
    return [
      props.width / pixelRatio.current,
      props.height / pixelRatio.current,
    ];
  }, [props.width, props.height]);

  function handleDownload() {
    const anchor = document.createElement("a");
    anchor.href = stageRef.current.toDataURL({
      pixelRatio: pixelRatio.current,
    });
    anchor.download = `background_${props.width}_${props.height}.png`;
    anchor.click();
  }

  const createStage = useCallback(([panelWidth, panelHeight], container) => {
    const stage = new Konva.Stage({
      container: container,
      width: panelWidth,
      height: panelHeight,
      preventDefault: false,
    });

    return stage;
  }, []);

  const createImageBackground = useCallback(([panelWidth, panelHeight]) => {
    let image = new Konva.Image({
      x: 0,
      y: 0,
      width: panelWidth,
      height: panelHeight,
      preventDefault: false,
    });

    return image;
  }, []);

  const positionImage = useCallback(
    (center) => {
      const [panelWidth, panelHeight] = panelDimensions();

      const imageRatio = backgroundRef.current.image().height / panelHeight;

      backgroundRef.current.setAttrs({
        cropX:
          backgroundRef.current.image().width * (center ?? 0.5) -
          panelWidth / 2,
        cropY: 0,
        cropWidth: panelWidth * imageRatio,
        cropHeight: backgroundRef.current.image().height,
      });
    },
    [panelDimensions]
  );

  const updateImage = useCallback(() => {
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
  }, [props.image, positionImage]);

  useEffect(() => {
    stageRef.current = createStage(
      panelDimensions(),
      canvasContainerRef.current
    );

    const layer = new Konva.Layer();

    cardRef.current = createCard({
      num_of_lines: props.lines.length,
      panelDimensions: panelDimensions,
      bottomOffset: props.bottomOffset,
      pixelRatio: pixelRatio.current,
    });

    backgroundRef.current = createImageBackground(panelDimensions());
    updateImage();

    layer.add(backgroundRef.current);
    layer.add(cardRef.current.group);
    stageRef.current.add(layer);

    return () => {
      layer.destroy();
      stageRef.current.destroy();
      stageRef.current = null;
      cardRef.current = null;
      backgroundRef.current = null;
    };
  }, [
    props.width,
    props.height,
    props.lines.length,
    createStage,
    createImageBackground,
    panelDimensions,
    props.bottomOffset,
    updateImage,
  ]);

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
        cardRef.current.updateTextFields(props.lines, pixelRatio.current);
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

    cardRef.current.updateTextFields(props.lines, pixelRatio.current);
    cardRef.current.position(pixelRatio.current);

    return () => {
      observer.disconnect();
    };
  }, [props.lines, panelDimensions, props.width, updateImage]);

  useEffect(() => {
    updateImage();
  }, [props.image, updateImage]);

  return (
    <div className="relative" ref={previewContainerRef}>
      <div className="space-y-2">
        <DownloadPanel onClick={handleDownload} />
        <div ref={canvasContainerRef}></div>
        <DownloadPanel onClick={handleDownload} />
      </div>
      {isBusy && <BusyOverlay />}
    </div>
  );
}
