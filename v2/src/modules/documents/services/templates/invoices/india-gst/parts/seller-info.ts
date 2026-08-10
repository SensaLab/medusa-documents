import { DocumentSettingsDTO } from '../../../../../types/dto';

export function generateSellerInfo(doc, y: number, settings: DocumentSettingsDTO): number {
  const gst = settings.storeIndiaGstDetails;
  const legalName = gst?.legalName || settings.storeAddress?.company || '';

  doc
    .fillColor("#000000")
    .font("Bold")
    .fontSize(14)
    .text(legalName, 40, y, { width: 300 });
  const nameHeight = doc.heightOfString(legalName, { width: 300 });

  const addressLine = [
    settings.storeAddress?.address_1,
    settings.storeAddress?.city,
    settings.storeAddress?.province,
    settings.storeAddress?.postal_code
  ].filter(Boolean).join(', ');

  const addrY = y + nameHeight + 4;
  doc
    .font("Regular")
    .fontSize(9)
    .text(addressLine, 40, addrY, { width: 300 });
  const addrHeight = doc.heightOfString(addressLine, { width: 300 });

  const idParts: string[] = [];
  if (gst?.gstin) idParts.push(`GSTIN: ${gst.gstin}`);
  if (gst?.pan) idParts.push(`PAN: ${gst.pan}`);
  if (gst?.cin) idParts.push(`CIN: ${gst.cin}`);

  let idY = addrY + addrHeight + 6;
  if (idParts.length) {
    doc
      .font("Bold")
      .fontSize(9)
      .text(idParts.join('   '), 40, idY, { width: 300 });
    idY += 14;
  }

  return idY;
}
