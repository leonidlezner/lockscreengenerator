import { useEffect, useState } from "react";
import useQRCode from "../helpers/useQRCode";

export default function QRCode({ text, size = 50, lightColor, darkColor }) {
  const { generate } = useQRCode();
  const [image, setImage] = useState("");

  useEffect(() => {
    const generateQrCode = async () => {
      const options = {
        color: {
          dark: darkColor,
          light: lightColor,
        },
      };

      setImage(await generate(text, options));
    };
    generateQrCode();
  }, [text, generate, lightColor, darkColor]);

  return (
    <div>
      {image && (
        <img src={image} alt={text} height={`${size}px`} width={`${size}px`} />
      )}
    </div>
  );
}
