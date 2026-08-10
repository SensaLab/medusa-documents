import { DocumentSettingsDTO } from '../../../../../types/dto';

export async function generateFooter(doc, y: number, settings: DocumentSettingsDTO): Promise<number> {
  const gst = settings.storeIndiaGstDetails;
  const legalName = gst?.legalName || settings.storeAddress?.company || '';

  const pageHeight = doc.page.height - 100;
  let _y = y;
  if (_y > pageHeight) {
    doc.addPage();
    _y = 50;
  }

  doc
    .fillColor("#000000")
    .font("Regular")
    .fontSize(9)
    .text(`For ${legalName}`, 400, _y, { width: 155, align: 'right' });

  let signatureY = _y + 15;

  if (gst?.signatureSource) {
    try {
      const responseImage = await fetch(gst.signatureSource);
      if (responseImage.ok && responseImage.status == 200) {
        const responseImageBuffer = await responseImage.arrayBuffer();
        const responseBuffer = Buffer.from(responseImageBuffer);
        doc.image(responseBuffer, 440, signatureY, { align: 'right', width: 115, height: 40 });
      }
    } catch {
      // ponytail: signature is optional, silently skip on fetch failure rather than breaking the invoice
    }
    signatureY += 45;
  } else {
    signatureY += 40;
  }

  doc
    .fontSize(9)
    .text('Authorised Signatory', 400, signatureY, { width: 155, align: 'right' });

  return signatureY + 15;
}
