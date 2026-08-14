export async function generateFooter(doc, y: number): Promise<number> {
  const pageHeight = doc.page.height - 100;
  let _y = y;
  if (_y > pageHeight) {
    doc.addPage();
    _y = 50;
  }

  doc
    .fillColor("#000000")
    .font("Regular")
    .fontSize(8)
    .text('This is a computer-generated invoice and does not require a signature.', 40, _y, { width: 515 });

  return _y + 15;
}
