"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
const seller_info_1 = require("./parts/seller-info");
const invoice_meta_1 = require("./parts/invoice-meta");
const table_1 = require("./parts/table");
const footer_1 = require("./parts/footer");
const hr_1 = require("../basic/parts/hr");
const header_logo_1 = require("../basic/parts/header-logo");
const customer_info_1 = require("../basic/parts/customer-info");
function validateInput(settings) {
    if (settings && settings.storeAddress && settings.storeAddress.company &&
        settings.storeAddress.address_1 &&
        settings.storeAddress.city &&
        settings.storeAddress.postal_code &&
        settings.storeIndiaGstDetails?.gstin)
        return [true, ''];
    return [false, `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code, GSTIN (in India GST details)`];
}
// ponytail: state match by province string equality, upgrade to GST state-code table if buyer/seller provinces don't line up 1:1
function isInterState(settings, order) {
    const sellerState = settings.storeAddress?.province?.toString().trim().toLowerCase();
    const buyerState = order.billing_address?.province?.toString().trim().toLowerCase();
    if (!sellerState || !buyerState) {
        return false;
    }
    return sellerState !== buyerState;
}
exports.default = async (settings, invoice, order) => {
    var doc = new pdfkit_1.default({ size: 'A4', margin: 40 });
    doc.registerFont('Regular', path_1.default.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Regular.ttf'));
    doc.registerFont('Bold', path_1.default.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Bold.ttf'));
    doc.font('Regular');
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    if (settings.storeLogoSource) {
        await (0, header_logo_1.generateHeaderLogo)(doc, 40, settings.storeLogoSource);
    }
    const endSeller = (0, seller_info_1.generateSellerInfo)(doc, 40, settings);
    const endMeta = (0, invoice_meta_1.generateInvoiceMeta)(doc, 130, invoice, order);
    const headerBottom = Math.max(endSeller, endMeta);
    (0, hr_1.generateHr)(doc, headerBottom + 5);
    const endCustomer = (0, customer_info_1.generateCustomerInformation)(doc, headerBottom + 5, order);
    const interState = isInterState(settings, order);
    const endTable = (0, table_1.generateInvoiceTable)(doc, endCustomer, order, order.items || [], interState);
    await (0, footer_1.generateFooter)(doc, endTable, settings);
    doc.end();
    const bufferPromise = new Promise(resolve => {
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
    });
    return await bufferPromise;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kaWEtZ3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZG9jdW1lbnRzL3NlcnZpY2VzL3RlbXBsYXRlcy9pbnZvaWNlcy9pbmRpYS1nc3QvaW5kaWEtZ3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7OztHQVVHOzs7OztBQWNILHNDQVFDO0FBbEJELG9EQUFpQztBQUNqQyxnREFBd0I7QUFDeEIscURBQXlEO0FBQ3pELHVEQUEyRDtBQUMzRCx5Q0FBcUQ7QUFDckQsMkNBQWdEO0FBQ2hELDBDQUErQztBQUMvQyw0REFBZ0U7QUFDaEUsZ0VBQTJFO0FBRTNFLFNBQWdCLGFBQWEsQ0FBQyxRQUE4QjtJQUMxRCxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTztRQUNwRSxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVM7UUFDL0IsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJO1FBQzFCLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVztRQUNqQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsS0FBSztRQUNwQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsc0pBQXNKLENBQUMsQ0FBQztBQUN6SyxDQUFDO0FBRUQsaUlBQWlJO0FBQ2pJLFNBQVMsWUFBWSxDQUFDLFFBQTZCLEVBQUUsS0FBZTtJQUNsRSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyRixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNw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