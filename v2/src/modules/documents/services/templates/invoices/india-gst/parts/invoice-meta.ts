import { OrderDTO } from "@medusajs/framework/types"
import { DocumentInvoiceDTO } from '../../../../../types/dto';
import { t } from "i18next";

export function generateInvoiceMeta(doc, y: number, invoice: DocumentInvoiceDTO, order: OrderDTO): number {
  doc.fillColor("#000000").font("Regular").fontSize(9);

  const lines = [
    `${t("invoice-number", "Invoice No")}: ${invoice.displayNumber}`,
    `${t("invoice-date", "Invoice Date")}: ${new Date(order.created_at).toLocaleDateString()}`,
  ];

  const placeOfSupply = order.billing_address?.province || order.billing_address?.city;
  if (placeOfSupply) {
    lines.push(`Place of Supply: ${placeOfSupply}`);
  }

  let curY = y;
  lines.forEach((line) => {
    doc.text(line, 340, curY, { width: 215, align: 'right' });
    curY += 13;
  });

  return curY;
}
