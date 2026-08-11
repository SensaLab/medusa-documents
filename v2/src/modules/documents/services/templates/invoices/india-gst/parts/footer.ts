const TERMS = [
  '1. Any discrepancy in the invoice should be communicated within [X] days.',
  '2. All transactions are subject to the applicable terms and conditions.',
  '3. This invoice is generated electronically.',
];

export async function generateFooter(doc, y: number): Promise<number> {
  const pageHeight = doc.page.height - 100;
  let _y = y;
  if (_y > pageHeight) {
    doc.addPage();
    _y = 50;
  }

  doc
    .fillColor("#000000")
    .font("Bold")
    .fontSize(9)
    .text('Terms & Conditions', 40, _y, { width: 515 });

  _y += 14;

  doc
    .font("Regular")
    .fontSize(8)
    .text(TERMS.join('\n'), 40, _y, { width: 515 });

  _y += TERMS.length * 11 + 10;

  doc
    .font("Regular")
    .fontSize(8)
    .text('This is a computer-generated invoice and does not require a signature.', 40, _y, { width: 515 });

  return _y + 15;
}
