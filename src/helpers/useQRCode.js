import QRCode from "qrcode";

export default function useQRCode() {
  const generate = async (text, options = {}) => {
    return await QRCode.toDataURL(text, options);
  };

  const generateVCard = async (vCardData, options = {}) => {
    let lines = [];

    lines.push("BEGIN:VCARD");
    lines.push("VERSION:3.0");

    if (vCardData.firstName && vCardData.lastName) {
      lines.push(`N:${vCardData.firstName};${vCardData.lastName}`);
    }

    if (vCardData.company) {
      lines.push(`ORG:${vCardData.company}`);
    }

    if (vCardData.eMail) {
      lines.push(`EMAIL:${vCardData.eMail}`);
    }

    if (vCardData.phone) {
      lines.push(`TEL;TYPE=voice,work,pref:${vCardData.phone}`);
    }

    lines.push(`END:VCARD`);

    return await generate(lines.join("\n"), options);
  };

  return { generate, generateVCard };
}
