import Konva from "konva";
import { useCallback, useRef } from "react";
import { FONTSIZES } from "../data/fontsizes";
import useQRCode from "./useQRCode";

export default function usePreview(container) {
  const scaleRatioRef = useRef(1);
  const stageRef = useRef(null);
  const observerRef = useRef(null);
  const elementsRef = useRef({});
  const { generateVCard } = useQRCode();
  const QRCODE_SIZE = 200;

  /**
   * Exports the current Konva image as Data URL
   */
  const getDataURL = useCallback(() => {
    return stageRef.current.toDataURL({
      pixelRatio: 1.0 / scaleRatioRef.current,
    });
  }, []);

  /**
   * Create the Konva elements without position and size
   *
   * @param {*} stage Konva Stage
   */
  function _createElements(stage) {
    const layer = new Konva.Layer();
    stage.add(layer);

    // Main Group for storing and scaling the complete image
    elementsRef.current.mainGroup = new Konva.Group();
    layer.add(elementsRef.current.mainGroup);

    // Image stores the background image
    elementsRef.current.image = new Konva.Image({
      preventDefault: false,
    });

    elementsRef.current.cardGroup = new Konva.Group();

    elementsRef.current.qrCode = new Konva.Image({
      preventDefault: false,
      height: QRCODE_SIZE,
      width: QRCODE_SIZE,
    });

    elementsRef.current.cardBackground = new Konva.Rect({
      fill: "#000",
      shadowColor: "#000",
      opacity: 0.7,
      preventDefault: false,
    });

    elementsRef.current.textFieldsGroup = new Konva.Group();
    elementsRef.current.textFields = [];

    elementsRef.current.cardGroup.add(elementsRef.current.cardBackground);
    elementsRef.current.cardGroup.add(elementsRef.current.qrCode);
    elementsRef.current.cardGroup.add(elementsRef.current.textFieldsGroup);

    // Add elements to the main group
    elementsRef.current.mainGroup.add(elementsRef.current.image);
    elementsRef.current.mainGroup.add(elementsRef.current.cardGroup);
  }

  const _layoutCard = (screenWidth, screenHeight, bottomOffset) => {
    const padding = 15;
    const qrCodeHeight = elementsRef.current.qrCode.height();
    const qrCodeWidth = elementsRef.current.qrCode.width();

    let textHeight = 0;

    // Update the fields
    for (let i = 0; i < elementsRef.current.textFields.length; i++) {
      elementsRef.current.textFields[i].setAttrs({
        y: textHeight,
        width: screenWidth - qrCodeWidth - padding * 3,
      });

      textHeight += elementsRef.current.textFields[i].height();
    }

    const cardHeight =
      textHeight > qrCodeHeight
        ? textHeight + padding * 2
        : qrCodeHeight + padding * 2;

    elementsRef.current.cardGroup.setAttrs({
      width: screenWidth,
      height: cardHeight,
      y: screenHeight - cardHeight - bottomOffset,
    });

    elementsRef.current.cardBackground.setAttrs({
      width: screenWidth,
      height: cardHeight,
    });

    elementsRef.current.textFieldsGroup.setAttrs({
      x: qrCodeWidth + padding * 2,
      y: cardHeight / 2 - textHeight / 2,
    });

    elementsRef.current.qrCode.setAttrs({
      x: padding,
      y: cardHeight / 2 - qrCodeHeight / 2,
    });
  };

  const _layout = useCallback(
    (screenWidth, screenHeight, clientWidth, bottomOffset) => {
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

      _layoutCard(screenWidth, screenHeight, bottomOffset);
    },
    []
  );

  const setup = useCallback(
    (container, parent, screenWidth, screenHeight, bottomOffset) => {
      console.log("setup");

      stageRef.current = new Konva.Stage({
        container: container,
        preventDefault: false,
      });

      _createElements(stageRef.current);

      const resizeCallback = () => {
        _layout(screenWidth, screenHeight, parent.offsetWidth, bottomOffset);
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
    },
    [_layout]
  );

  const destroy = useCallback(() => {
    observerRef.current.disconnect();
    stageRef.current.destroy();
  }, []);

  const updateLines = useCallback(
    (lines, screenWidth, screenHeight, bottomOffset) => {
      console.log("Update lines");

      const filteredLines = lines.filter((line) => line.text !== "");
      let currentLinesCount = elementsRef.current.textFields.length;

      if (currentLinesCount !== filteredLines.length) {
        // Less element than lines
        if (currentLinesCount < filteredLines.length) {
          for (let i = currentLinesCount; i < filteredLines.length; i++) {
            const textField = new Konva.Text({
              align: "center",
              wrap: "word",
              lineHeight: 1.2,
              preventDefault: false,
            });

            elementsRef.current.textFields.push(textField);
            elementsRef.current.textFieldsGroup.add(textField);
          }
        }

        // More element than lines
        if (currentLinesCount > filteredLines.length) {
          for (let i = filteredLines.length; i < currentLinesCount; i++) {
            const removedElement = elementsRef.current.textFields.pop();
            removedElement.destroy();
          }
        }

        // Update the count
        currentLinesCount = elementsRef.current.textFields.length;
      }

      // Update the fields
      for (let i = 0; i < currentLinesCount; i++) {
        elementsRef.current.textFields[i].setAttrs({
          text: filteredLines[i].text,
          fontSize: FONTSIZES[filteredLines[i].fontSize].fontSize,
          fill: filteredLines[i].color ?? "#fff",
        });
      }

      // Update the layout for the card only
      _layoutCard(screenWidth, screenHeight, bottomOffset);
    },
    []
  );

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

  const updateVCard = useCallback(
    (vCardData, onSetIsBusy, screenWidth, screenHeight) => {
      async function generate() {
        onSetIsBusy(true);
        try {
          const qrImageData = await generateVCard(vCardData);

          const image = new Image();

          image.onload = () => {
            elementsRef.current.qrCode.setAttrs({
              image: image,
            });
          };

          image.src = qrImageData;
        } catch (err) {
          console.error(err);
        } finally {
          onSetIsBusy(false);
        }
      }
      generate();
    },
    [generateVCard]
  );

  return {
    getDataURL,
    setup,
    destroy,
    updateLines,
    updateImage,
    updateVCard,
  };
}
