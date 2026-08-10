"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceMeta = generateInvoiceMeta;
const i18next_1 = require("i18next");
function generateInvoiceMeta(doc, y, invoice, order) {
    doc.fillColor("#000000").font("Regular").fontSize(9);
    const lines = [
        `${(0, i18next_1.t)("invoice-number", "Invoice No")}: ${invoice.displayNumber}`,
        `${(0, i18next_1.t)("invoice-date", "Invoice Date")}: ${invoice.created_at.toLocaleDateString()}`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52b2ljZS1tZXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZG9jdW1lbnRzL3NlcnZpY2VzL3RlbXBsYXRlcy9pbnZvaWNlcy9pbmRpYS1nc3QvcGFydHMvaW52b2ljZS1tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsa0RBb0JDO0FBdEJELHFDQUE0QjtBQUU1QixTQUFnQixtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsQ0FBUyxFQUFFLE9BQTJCLEVBQUUsS0FBZTtJQUM5RixHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckQsTUFBTSxLQUFLLEdBQUc7UUFDWixHQUFHLElBQUEsV0FBQyxFQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxLQUFLLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDaEUsR0FBRyxJQUFBLFdBQUMsRUFBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLEtBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO0tBQ25GLENBQUM7SUFFRixNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLFFBQVEsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQztJQUNyRixJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMifQ==