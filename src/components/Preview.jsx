import { useEffect, useRef, useState } from "react";
import usePreview from "../helpers/usePreview";
import BusyOverlay from "./BusyOverlay";
import DownloadPanel from "./DownloadPanel";

export default function Preview(props) {
  const previewContainerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const { getDataURL, setup, destroy, updateLines, updateImage, updateVCard } =
    usePreview();
  const [isBusy, setIsBusy] = useState(false);

  function handleDownload() {
    const anchor = document.createElement("a");

    anchor.href = getDataURL();

    anchor.download = `background_${props.width}_${props.height}.png`;
    anchor.click();
  }

  useEffect(() => {
    console.log("I should run only once");
    setup(
      canvasContainerRef.current,
      previewContainerRef.current,
      props.width,
      props.height
    );

    return () => {
      destroy();
    };
  }, [setup, destroy, props.width, props.height]);

  useEffect(() => updateLines(props.lines), [updateLines, props.lines]);

  useEffect(() => {
    console.log("useEffect for image");
    updateImage(props.image, setIsBusy, props.width, props.height);
  }, [updateImage, props.image, props.width, props.height]);

  useEffect(
    () => updateVCard(props.vCard, setIsBusy),
    [updateVCard, props.vCard]
  );

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
