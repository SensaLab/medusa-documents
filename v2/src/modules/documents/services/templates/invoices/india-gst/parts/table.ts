import { generateHr } from "../../basic/parts/hr";
import { t } from "i18next";
import { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types";
import { getDecimalDigits } from "../../../../../utils/currency";
import { BigNumber } from "@medusajs/framework/utils";

function amountToDisplayNormalized(amount: number, currencyCode: string): string {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `${parseFloat(amount.toString()).toFixed(decimalDigits)} ${currencyCode.toUpperCase()}`;
}

function generateTableRow(doc, y, item, hsn, quantity, unitCost, lineTotal) {
  doc.fontSize(9);

  const pageHeight = doc.page.height - 80;
  const itemHeight = doc.heightOfString(item, { width: 190 });
  const height = Math.max(itemHeight, 20);
  let _y = y;
  let nextY = y + height;

  if (nextY > pageHeight) {
    doc.addPage();
    _y = 50;
    nextY = _y + height;
  }

  doc
    .text(item, 40, _y, { width: 190 })
    .text(hsn, 235, _y, { width: 55 })
    .text(quantity, 295, _y, { width: 45, align: "right" })
    .text(unitCost, 345, _y, { width: 85, align: "right" })
    .text(lineTotal, 435, _y, { width: 120, align: "right" });

  return nextY;
}

function generateTotalRow(doc, y, label, amount) {
  doc.text(label, 345, y, { width: 85, align: "right" });
  doc.text(amount, 435, y, { width: 120, align: "right" });
  return y + 15;
}

export function generateInvoiceTable(
  doc,
  y: number,
  order: OrderDTO,
  items: OrderLineItemDTO[],
  isInterState: boolean
) {
  let i;
  const invoiceTableTop = y + 20;
  const pageHeight = doc.page.height - 50;

  doc.font("Bold").fontSize(9);
  generateTableRow(
    doc,
    invoiceTableTop,
    t("invoice-table-header-item", "Item"),
    "HSN/SAC",
    t("invoice-table-header-quantity", "Qty"),
    t("invoice-table-header-unit-cost", "Unit Cost"),
    t("invoice-table-header-line-total", "Line Total")
  );
  generateHr(doc, invoiceTableTop + 15);
  doc.font("Regular");

  let currentY = invoiceTableTop + 25;
  let taxableTotal = 0;
  for (i = 0; i < items.length; i++) {
    if (currentY > pageHeight) {
      doc.addPage();
      currentY = 50;
    }

    const item = items[i];
    const lineTaxableValue = Number(item.raw_subtotal.value);
    taxableTotal += lineTaxableValue;
    currentY = generateTableRow(
      doc,
      currentY,
      item.title,
      item.metadata?.hsn_code ? String(item.metadata.hsn_code) : '',
      item.quantity,
      amountToDisplayNormalized(lineTaxableValue / item.quantity, order.currency_code),
      amountToDisplayNormalized(lineTaxableValue, order.currency_code)
    );

    currentY += 5;
    if (currentY > pageHeight) {
      doc.addPage();
      currentY = 50;
    }
    generateHr(doc, currentY);
    currentY += 8;
  }

  currentY += 15;
  if (currentY > pageHeight) {
    doc.addPage();
    currentY = 50;
  }

  const shippingTotal = (order.shipping_subtotal as BigNumber).numeric;
  const taxTotal = (order.tax_total as BigNumber).numeric;
  const grandTotal = (order.total as BigNumber).numeric;

  doc.fontSize(9);
  currentY = generateTotalRow(
    doc,
    currentY,
    t("invoice-table-taxable-value", "Taxable Value"),
    amountToDisplayNormalized(taxableTotal, order.currency_code)
  );

  currentY = generateTotalRow(
    doc,
    currentY,
    t("invoice-table-shipping", "Shipping"),
    amountToDisplayNormalized(shippingTotal, order.currency_code)
  );

  if (isInterState) {
    currentY = generateTotalRow(
      doc,
      currentY,
      "IGST",
      amountToDisplayNormalized(taxTotal, order.currency_code)
    );
  } else {
    const half = taxTotal / 2;
    currentY = generateTotalRow(doc, currentY, "CGST", amountToDisplayNormalized(half, order.currency_code));
    currentY = generateTotalRow(doc, currentY, "SGST", amountToDisplayNormalized(half, order.currency_code));
  }

  currentY += 10;
  if (currentY > pageHeight) {
    doc.addPage();
    currentY = 50;
  }
  doc.font("Bold");
  generateTotalRow(
    doc,
    currentY,
    t("invoice-table-total", "Total"),
    amountToDisplayNormalized(grandTotal, order.currency_code)
  );
  doc.font("Regular");

  return currentY + 25;
}
