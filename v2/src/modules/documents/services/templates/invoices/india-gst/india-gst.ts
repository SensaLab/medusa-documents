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

import { OrderDTO } from "@medusajs/framework/types"
import { DocumentInvoiceDTO, DocumentSettingsDTO } from '../../../../types/dto';
import PDFDocument from 'pdfkit';
import path from "path";
import { generateSellerInfo } from "./parts/seller-info";
import { generateInvoiceMeta } from "./parts/invoice-meta";
import { generateInvoiceTable } from "./parts/table";
import { generateFooter } from "./parts/footer";
import { generateHr } from "../basic/parts/hr";
import { generateHeaderLogo } from "../basic/parts/header-logo";
import { generateCustomerInformation } from "../basic/parts/customer-info";

export function validateInput(settings?: DocumentSettingsDTO): ([boolean, string]) {
  if (settings && settings.storeAddress && settings.storeAddress.company &&
    settings.storeAddress.address_1 &&
    settings.storeAddress.city &&
    settings.storeAddress.postal_code &&
    settings.storeIndiaGstDetails?.gstin
  ) return [true, ''];
  return [false, `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code, GSTIN (in India GST details)`];
}

// ponytail: state match by province string equality, upgrade to GST state-code table if buyer/seller provinces don't line up 1:1
function isInterState(settings: DocumentSettingsDTO, order: OrderDTO): boolean {
  const sellerState = settings.storeAddress?.province?.toString().trim().toLowerCase();
  const buyerState = order.billing_address?.province?.toString().trim().toLowerCase();
  if (!sellerState || !buyerState) {
    return false;
  }
  return sellerState !== buyerState;
}

export default async (settings: DocumentSettingsDTO, invoice: DocumentInvoiceDTO, order: OrderDTO): Promise<Buffer> => {
  var doc = new PDFDocument({ size: 'A4', margin: 40 });
  doc.registerFont('Regular', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Regular.ttf'))
  doc.registerFont('Bold', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Bold.ttf'))
  doc.font('Regular');

  const buffers = []
  doc.on("data", buffers.push.bind(buffers))

  if (settings.storeLogoSource) {
    await generateHeaderLogo(doc, 40, settings.storeLogoSource);
  }

  const endSeller = generateSellerInfo(doc, 40, settings);
  const endMeta = generateInvoiceMeta(doc, 130, invoice, order);
  const headerBottom = Math.max(endSeller, endMeta);

  generateHr(doc, headerBottom + 5);

  const endCustomer = generateCustomerInformation(doc, headerBottom + 5, order);

  const interState = isInterState(settings, order);
  const endTable = generateInvoiceTable(doc, endCustomer, order, order.items || [], interState);

  await generateFooter(doc, endTable);

  doc.end();

  const bufferPromise = new Promise<Buffer>(resolve => {
    doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
    })
  })

  return await bufferPromise;
};
