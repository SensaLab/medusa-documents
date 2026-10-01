/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { model } from "@medusajs/framework/utils"
import DocumentInvoiceSettings from "./document-invoice-settings"
import DocumentSettings from "./document-settings"

const DocumentInvoice = model.define("document_invoice", {
  id: model.id().primaryKey(),
  // Legacy counter, has duplicates from the old "forced number" setting. Not used for numbering any more.
  number: model.number(),
  // Serial printed on GST invoices. Null on legacy/test rows.
  gstSerial: model.number().nullable(),
  order_id: model.text().nullable(),
  displayNumber: model.text(),
  invoiceSettings: model.belongsTo(() => DocumentInvoiceSettings, {
    mappedBy: 'documentInvoice'
  }),
  settings: model.belongsTo(() => DocumentSettings, {
    mappedBy: 'documentInvoice'
  })
}).indexes([
  {
    name: "IDX_document_invoice_gstSerial_unique",
    on: ["gstSerial"],
    unique: true,
    where: `"gstSerial" IS NOT NULL`,
  },
  {
    name: "IDX_document_invoice_order_id",
    on: ["order_id"],
  },
])

export default DocumentInvoice