# GST Invoice Compliance Research (India) — for v2 IN Invoice Template

Research notes for building a custom invoice template compliant with Indian GST law. Source: CGST Act/Rules + web search Aug 2026 (see Sources).

## 1. Mandatory fields on a tax invoice (Rule 46, CGST Rules)

A GST tax invoice needs all of these or it's invalid for buyer's Input Tax Credit (ITC):

1. Heading "Tax Invoice" (or "Bill of Supply" for composition-scheme / exempt sellers)
2. Supplier name, address, **GSTIN**
3. Unique sequential invoice number — max **16 characters**, alphanumeric, unique per financial year (resets each FY)
4. Invoice date
5. Buyer name, address, **GSTIN** (if registered — B2B); for B2C, name/address only, GSTIN optional
6. Shipping address + whether same as billing
7. **Place of supply** (state) + whether it differs from billing address (determines IGST vs CGST+SGST)
8. **HSN code** (goods) or **SAC code** (services) per line item — digit count depends on turnover, see §3
9. Item description, quantity, unit, taxable value
10. **GST rate** per line item
11. Tax breakup: **CGST + SGST** (intra-state) OR **IGST** (inter-state) — never both
12. Discount, if any, shown separately
13. Total invoice value (in figures + words for large amounts, common practice)
14. Whether tax payable under **reverse charge** (RCM) — yes/no flag
15. Signature/digital signature of supplier or authorized rep (e-invoices with QR code are exempt from physical signature requirement)
16. Bank details (not legally mandatory but standard practice)

Penalty for missing/wrong fields: buyer's ITC can be denied, and penalty up to ₹25,000 under Section 122.

## 2. E-invoicing (IRN + QR code)

- **Threshold**: mandatory for any GST-registered business whose aggregate turnover exceeded ₹5 crore in *any* FY since 2017–18 — sticky once crossed, doesn't reset if turnover later drops (in force since 1 Aug 2023).
- Applies to B2B invoices, exports, and credit/debit notes. B2C invoices are exempt from IRN but still need the standard tax invoice fields above.
- Process: invoice JSON submitted to Invoice Registration Portal (IRP) → returns **IRN** (Invoice Reference Number, a hash) + signed **QR code** + Ack No/date. QR code + IRN must be printed on the PDF.
- **30-day reporting rule**: businesses with AATO ≥ ₹10 crore must submit to IRP within 30 days of invoice date — after that IRP rejects it outright, no IRN, invoice is void for GST purposes and buyer loses ITC. Effective since Apr 2025, continues into FY 2026–27.
- Below ₹5cr: e-invoicing not mandatory but a normal signed tax invoice is still required.

## 3. HSN/SAC code digit requirements (by turnover)

| Turnover | HSN/SAC digits required |
|---|---|
| Up to ₹5 crore | optional/2-digit (varies by notification; safe default: include 4-digit) |
| ₹5cr – ₹10cr | 2-digit minimum |
| Above ₹10cr (e-invoice mandated) | 6-digit |
| Above ₹50cr | 4-digit minimum, often 6-digit in practice |

Sources disagree slightly on exact bands (CBIC notifications have shifted over the years) — **build this as a configurable setting** (store admin picks 2/4/6-digit HSN mode), don't hardcode.

## 4. Tax split logic

- **Intra-state sale** (seller state == place of supply state): split tax into **CGST + SGST**, each half the GST rate (e.g. 18% GST → 9% CGST + 9% SGST).
- **Inter-state sale** (seller state ≠ place of supply state) or export: **IGST** = full GST rate, CGST/SGST = 0.
- Requires knowing seller's registered state (from store settings/GSTIN) and buyer's place of supply (from shipping/billing address state) per order — not currently modeled in `DocumentSettingsDTO`/`OrderDTO` usage in this codebase; will need per-line tax_lines breakdown from Medusa's tax module or derive from `order.tax_total` + rate metadata.

## 5. Other requirements

- **Reverse charge (RCM)**: invoice must state "Tax payable on reverse charge basis: Yes/No".
- **Export invoices**: must state "SUPPLY MEANT FOR EXPORT ... UNDER LUT WITHOUT PAYMENT OF IGST" (or "WITH PAYMENT OF INTEGRATED TAX") + shipping bill/LUT details.
- **Bill of Supply**: used instead of Tax Invoice when seller is under composition scheme or supply is wholly exempt — no tax shown at all.
- **Credit/Debit notes**: same field requirements as invoices, must reference original invoice number.
- **Rounding**: standard practice — round total to nearest rupee, "Total in Words" line recommended for large invoices.
- **Invoice numbering**: must be sequential and unique per FY — current codebase's `DocumentInvoiceDTO.displayNumber`/`numberFormat` setup should be checked it doesn't exceed 16 chars and resets appropriately per FY for IN mode.

## 6. Gaps vs. current codebase (v2/src/modules/documents)

What exists today (`basic` invoice template) has none of the GST-specific fields:

- `DocumentSettingsDTO.storeAddress` is a free-form `Record<string, any>` — no dedicated GSTIN field, no seller state.
- No buyer GSTIN capture on `OrderDTO` usage.
- No per-line HSN/SAC — `OrderLineItemDTO` isn't extended with it; likely needs product/variant metadata.
- `table.ts` only shows a single `Tax` total line (`order.tax_total`) — no CGST/SGST/IGST split.
- No IRN/QR code field or e-invoice integration.
- No "Bill of Supply" / reverse-charge / export mode.

This is the scope for the actual IN template implementation (separate task from this research pass).

## Sources
- https://www.gimbooks.com/blog/5-crore-e-invoice-turnover-rule-2026/
- https://tallysolutions.com/accounting/e-invoicing-rules-in-india/
- https://www.incorpx.io/blog/gst-e-invoice-turnover-limit-2026
- https://zapinvoice.in/blog/gst-invoice-format-requirements
- https://thelearnnotes.com/blog/mandatory-fields-of-gst-tax-invoice-rule-46-explained
- https://accountune.com/gst-invoice-rules-2026
- https://www.indiafilings.com/learn/gst-einvoice-30-day-rule-10crore-turnover
- https://einvoice6.gst.gov.in/content/revised-time-limit-for-e-invoice-reporting-for-businesses-with-aato-of-%E2%82%B910-crores-above/
