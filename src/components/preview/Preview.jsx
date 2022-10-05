import { useEffect, useRef, useState } from "react";
import usePreview from "../../helpers/usePreview";
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
    //console.log("I should run only once");
    setup(
      canvasContainerRef.current,
      previewContainerRef.current,
      props.width,
      props.height,
      props.bottomOffset
    );

    return () => {
      destroy();
    };
  }, [setup, destroy, props.width, props.height, props.bottomOffset]);

  useEffect(() => {
    //console.log("useEffect for lines");
    updateLines(props.lines, props.width, props.height, props.bottomOffset);
  }, [updateLines, props.lines, props.width, props.height, props.bottomOffset]);

  useEffect(() => {
    //console.log("useEffect for image");
    updateImage(props.image, setIsBusy, props.width, props.height);
  }, [updateImage, props.image, props.width, props.height]);

  useEffect(() => {
    //console.log("useEffect for vcard");
    updateVCard(
      props.vCard,
      setIsBusy,
      props.width,
      props.height,
      props.bottomOffset
    );
  }, [updateVCard, props.vCard, props.width, props.height, props.bottomOffset]);

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
