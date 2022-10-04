import Konva from "konva";
import { useCallback, useEffect, useRef } from "react";

export default function usePreview(container) {
  const scaleRatioRef = useRef(1);
  const stageRef = useRef(null);
  const observerRef = useRef(null);
  const elementsRef = useRef({});

  const getDataURL = useCallback((options) => {
    return stageRef.current.toDataURL({
      pixelRatio: 1.0 / scaleRatioRef.current,
    });
  }, []);

  function _createElements(stage) {
    const layer = new Konva.Layer();
    stage.add(layer);

    elementsRef.current.mainGroup = new Konva.Group();
    layer.add(elementsRef.current.mainGroup);

    elementsRef.current.image = new Konva.Image({
      preventDefault: false,
    });

    elementsRef.current.mainGroup.add(elementsRef.current.image);
  }

  const _layout = (screenWidth, screenHeight, clientWidth, clientHeight) => {
    scaleRatioRef.current = clientWidth / screenWidth;

    stageRef.current.width(clientWidth);
    stageRef.current.height(screenHeight * scaleRatioRef.current);

    elementsRef.current.mainGroup.setAttrs({
      width: clientWidth,
      height: screenHeight * scaleRatioRef.current,
      scaleX: scaleRatioRef.current,
      scaleY: scaleRatioRef.current,
    });

    elementsRef.current.image.setAttrs({
      width: screenWidth,
      height: screenHeight,
    });
  };

  const setup = useCallback((container, parent, screenWidth, screenHeight) => {
    console.log("setup");

    stageRef.current = new Konva.Stage({
      container: container,
      preventDefault: false,
    });

    _createElements(stageRef.current);

    const resizeCallback = () => {
      _layout(
        screenWidth,
        screenHeight,
        parent.offsetWidth,
        parent.offsetHeight
      );
    };

    observerRef.current = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        resizeCallback();
      });
    });

    observerRef.current.observe(parent);
    resizeCallback();
  }, []);

  const destroy = useCallback(() => {
    observerRef.current.disconnect();
    stageRef.current.destroy();
  }, []);

  const updateLines = useCallback(() => {}, []);

  const updateImage = useCallback(
    (imageData, onSetIsBusy, screenWidth, screenHeight) => {
      console.log("Update image()");
      onSetIsBusy(true);

      const image = new Image();

      image.onload = () => {
        onSetIsBusy(false);
        elementsRef.current.image.image(image);

        const imageRatio = image.height / screenHeight;

        elementsRef.current.image.setAttrs({
          cropX:
            image.width * imageData.center - (screenWidth * imageRatio) / 2,
          cropY: 0,
          cropWidth: screenWidth * imageRatio,
          cropHeight: image.height,
        });
      };

      image.onerror = () => {
        onSetIsBusy(false);
        alert("Cannot load the image");
      };

      image.src = `${process.env.PUBLIC_URL}/images/${imageData.file}`;
    },
    []
  );

  const updateVCard = useCallback(() => {}, []);

  return {
    getDataURL,
    setup,
    destroy,
    updateLines,
    updateImage,
    updateVCard,
  };
}
