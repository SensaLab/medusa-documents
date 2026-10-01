import { model } from "@medusajs/framework/utils"

// Named counters, e.g. "gstSerial" = last GST invoice serial handed out.
// Rows are created by a one-off script, never by the app.
const DocumentNumber = model.define("document_number", {
  id: model.id({ prefix: "docnum" }).primaryKey(),
  name: model.text().unique(),
  value: model.number(),
})

export default DocumentNumber
