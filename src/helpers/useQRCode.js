import QRCode from "qrcode";

export default function useQRCode() {
  const generate = async (text, options = {}) => {
    return await QRCode.toDataURL(text, options);
  };

  return [generate];
}
