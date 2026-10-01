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

import { MedusaError, MedusaErrorTypes } from "@medusajs/utils"
import { InjectTransactionManager, MedusaContext, MedusaService } from "@medusajs/framework/utils"
import { ModulesSdkUtils } from "@medusajs/framework/utils"
import { Context, Logger, OrderDTO } from "@medusajs/framework/types"
import DocumentInvoice from "./models/document-invoice";
import DocumentNumber from "./models/document-number";
import DocumentPackingSlip from "./models/document-packing-slip";
import DocumentSettings from "./models/document-settings";
import DocumentInvoiceSettings from "./models/document-invoice-settings";
import DocumentPackingSlipSettings from "./models/document-packing-slip-settings";
import { DocumentAddress } from "./types/api";
import { IndiaGstDetailsDTO } from "./types/dto";
import { InvoiceTemplateKind, PackingSlipTemplateKind } from "./types/template-kind";
import { INVOICE_NUMBER_PLACEHOLDER, PACKING_SLIP_NUMBER_PLACEHOLDER, INVOICE_YEAR_PLACEHOLDER, INVOICE_MONTH_PLACEHOLDER, INVOICE_TIMEZONE } from "./types/constants";
import { generateInvoice, validateInputForProvidedKind } from "./services/generators/invoice-generator";
import { generatePackingSlip, validateInputForProvidedKind as validatePackingSlipInputForProvidedKind } from "./services/generators/packing-slip-generator";
import { DocumentInvoiceDTO, DocumentInvoiceSettingsDTO, DocumentPackingSlipDTO } from "./types/dto";

const GST_SERIAL = "gstSerial";

type ModuleOptions = {
}

type PgConnectionType = ReturnType<typeof ModulesSdkUtils.createPgConnection>;

type InjectedDependencies = {
}

class DocumentsModuleService extends MedusaService({
  DocumentInvoice,
  DocumentPackingSlip,
  DocumentSettings,
  DocumentInvoiceSettings,
  DocumentPackingSlipSettings,
  DocumentNumber
}) {

  protected options_?: ModuleOptions
  protected logger_: Logger;
  protected pgConnection: PgConnectionType;

  constructor({
  }: InjectedDependencies, options?: ModuleOptions) {
    super(...arguments)
    this.options_ = options;
  }

  // Next serial without taking it. Undefined until the "gstSerial" row is seeded.
  private async peekNextGstSerial(): Promise<number | undefined> {
    const [counter] = await this.listDocumentNumbers({ name: GST_SERIAL }, { take: 1 });
    return counter ? counter.value + 1 : undefined;
  }

  // Takes the next GST serial and saves the invoice in one transaction.
  // The row lock on the counter makes concurrent calls wait their turn; a rollback hands the serial back.
  @InjectTransactionManager()
  protected async issueInvoice_(
    orderId: string,
    expectedCurrentInvoiceId: string | undefined,
    buildEntry: (gstSerial: number) => Record<string, unknown>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ invoice: any, created: boolean }> {
    const manager = sharedContext.transactionManager as any;
    const [counter] = await manager.execute(
      `select "value" from "document_number" where "name" = ? and "deleted_at" is null for update`,
      [GST_SERIAL]
    );
    if (!counter) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invoice numbering is not set up: "${GST_SERIAL}" counter is missing`
      );
    }

    // Checked under the lock: a request that waited behind us sees the invoice we just issued
    const [current] = await this.listDocumentInvoices(
      { order_id: orderId },
      { order: { created_at: "DESC" }, take: 1 },
      sharedContext
    );
    if (current && current.id !== expectedCurrentInvoiceId) {
      return { invoice: current, created: false };
    }

    const gstSerial = Number(counter.value) + 1;
    await manager.execute(
      `update "document_number" set "value" = ?, "updated_at" = now() where "name" = ? and "deleted_at" is null`,
      [gstSerial, GST_SERIAL]
    );
    const invoice = await this.createDocumentInvoices(buildEntry(gstSerial) as any, sharedContext);
    return { invoice, created: true };
  }

  private formatInvoiceDisplayNumber(format: string | null | undefined, nextNumber: string, date: Date): string {
    if (!format) {
      return nextNumber;
    }
    const paddedNumber = nextNumber.padStart(2, '0');
    // Explicit timezone so the printed month doesn't depend on the server's TZ
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: INVOICE_TIMEZONE, year: 'numeric', month: '2-digit' }).formatToParts(date);
    const year = parts.find((p) => p.type === 'year')!.value;
    const month = parts.find((p) => p.type === 'month')!.value;
    return format
      .replace(INVOICE_YEAR_PLACEHOLDER, year)
      .replace(INVOICE_MONTH_PLACEHOLDER, month)
      .replace(INVOICE_NUMBER_PLACEHOLDER, paddedNumber);
  }

  private async getNextPackingSlipNumber() {
    const lastPackingSlip = await this.listDocumentPackingSlips({}, {
      order: {
        number: "DESC"
      },
      take: 1
    });

    if (lastPackingSlip && lastPackingSlip.length) {
      return (lastPackingSlip[0].number + 1).toString();
    }
    return '1';
  }

  async getInvoice(order: OrderDTO, invoiceId: string, includeBuffer: boolean = false) : Promise<any> {
    if (includeBuffer) {
      const invoice = await this.retrieveDocumentInvoice(invoiceId,
        {
          relations: ['invoiceSettings', 'settings']
        }
      );
      if (invoice) {
        const calculatedTemplateKind = this.calculateTemplateKind(invoice.invoiceSettings);
        const buffer = await generateInvoice(calculatedTemplateKind, invoice.settings, invoice, order);
        return {
          invoice: invoice,
          buffer: buffer
        }
      }
    } else {
      const invoice = await this.retrieveDocumentInvoice(invoiceId);
      return {
        invoice: invoice,
        buffer: undefined
      }
    }
  }

  async getPackingSlip(order: OrderDTO, packingSlipId: string, includeBuffer: boolean = false) : Promise<any> {
    if (includeBuffer) {
      const packingSlip = await this.retrieveDocumentPackingSlip(packingSlipId,
        {
          relations: ['packingSlipSettings', 'settings']
        }
      );
      if (packingSlip) {
        const calculatedTemplateKind = this.calculatePackingSlipTemplateKind(packingSlip.packingSlipSettings);
        const buffer = await generatePackingSlip(calculatedTemplateKind, packingSlip.settings, packingSlip, order);
        return {
          packingSlip: packingSlip,
          buffer: buffer
        }
      }
    } else {
      const packingSlip = await this.retrieveDocumentPackingSlip(packingSlipId);
      return {
        packingSlip: packingSlip,
        buffer: undefined
      }
    }
  }

  async generateTestPackingSlip(order: OrderDTO, templateKind: PackingSlipTemplateKind) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })

    if (lastDocumentSettings && lastDocumentSettings.length) {
      const nextNumber: string = await this.getNextPackingSlipNumber();
      
      const [validationPassed, info] = validatePackingSlipInputForProvidedKind(templateKind, lastDocumentSettings[0]);
      if (validationPassed) {
        const testPackingSlip: DocumentPackingSlipDTO = {
          number: parseInt(nextNumber),
          displayNumber: nextNumber,
          created_at: new Date(Date.now())
        }

        const buffer = await generatePackingSlip(templateKind, lastDocumentSettings[0], testPackingSlip, order);

        return {
          packingSlip: testPackingSlip,
          buffer: buffer
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          info
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Document settings are not defined'
      );
    }
  }

  async generateTestInvoice(order: OrderDTO, templateKind: InvoiceTemplateKind) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })

    if (lastDocumentSettings && lastDocumentSettings.length) {
      const lastInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
          order: {
            created_at: "DESC"
          },
          take: 1
        });
      if (lastInvoiceSettings && lastInvoiceSettings.length) {
        const invoiceSettings: any = lastInvoiceSettings[0];
        const nextNumber: string = ((await this.peekNextGstSerial()) ?? 1).toString();

        const [validationPassed, info] = validateInputForProvidedKind(templateKind, lastDocumentSettings[0]);
        if (validationPassed) {
          const testInvoice: DocumentInvoiceDTO = {
            number: parseInt(nextNumber),
            displayNumber: this.formatInvoiceDisplayNumber(invoiceSettings.numberFormat, nextNumber, order.created_at ? new Date(order.created_at) : new Date()),
            created_at: new Date(Date.now())
          }

          const buffer = await generateInvoice(templateKind, lastDocumentSettings[0], testInvoice, order);

          return {
            invoice: testInvoice,
            buffer: buffer
          }
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            info
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Invoice settings are not defined'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Document settings are not defined'
      );
    }
  }

  private calculateTemplateKind(documentInvoiceSettings: any) : InvoiceTemplateKind {
    if (documentInvoiceSettings && documentInvoiceSettings.template) {
      return documentInvoiceSettings.template as InvoiceTemplateKind;
    }
    return InvoiceTemplateKind.BASIC;
  }

  // expectedCurrentInvoiceId: the invoice the caller saw linked to the order (replaced when regenerating).
  async generateInvoiceForOrder(order?: OrderDTO, expectedCurrentInvoiceId?: string) : Promise<any> {
    if (order) {
      const lastDocumentSettings = await this.listDocumentSettings({}, {
        order: {
          created_at: "DESC"
        },
        take: 1
      })
      if (lastDocumentSettings && lastDocumentSettings.length) {
        const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
          order: {
            created_at: "DESC"
          },
          take: 1
        })
        if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
          const invoiceSettings: any = lastDocumentInvoiceSettings[0];
          const calculatedTemplateKind = this.calculateTemplateKind(lastDocumentInvoiceSettings[0]);
          const [validationPassed, info] = validateInputForProvidedKind(calculatedTemplateKind, lastDocumentSettings[0]);
          if (validationPassed) {
            const orderDate = order.created_at ? new Date(order.created_at) : new Date();
            const { invoice: invoiceResult, created } = await this.issueInvoice_(
              order.id,
              expectedCurrentInvoiceId,
              (gstSerial) => ({
                number: gstSerial,
                gstSerial: gstSerial,
                order_id: order.id,
                displayNumber: this.formatInvoiceDisplayNumber(invoiceSettings.numberFormat, gstSerial.toString(), orderDate),
                invoice_settings_id: invoiceSettings.id,
                settings_id: lastDocumentSettings[0].id
              })
            );
            if (!created) {
              return { ...(await this.getInvoice(order, invoiceResult.id, true)), created: false };
            }

            const buffer = await generateInvoice(calculatedTemplateKind, lastDocumentSettings[0], invoiceResult, order);
            return {
              invoice: invoiceResult,
              buffer: buffer,
              created: created
            }
          } else {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              info
            );
          }
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            'Invoice settings are not defined'
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Document settings are not defined'
        );
      }
    }
    return undefined;
  }

  private calculatePackingSlipTemplateKind(documentPackingSlipSettings: any) : PackingSlipTemplateKind {
    if (documentPackingSlipSettings && documentPackingSlipSettings.template) {
      return documentPackingSlipSettings.template as PackingSlipTemplateKind;
    }
    return PackingSlipTemplateKind.BASIC;
  }

  async generatePackingSlipForOrder(order: OrderDTO) : Promise<any> { 
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const lastDocumentPackingSlipSettings = await this.listDocumentPackingSlipSettings({}, {
        order: {
          created_at: "DESC"
        },
        take: 1
      })

      if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length) {
        const packingSlipSettings: any = lastDocumentPackingSlipSettings[0];
        const calculatedTemplateKind = this.calculatePackingSlipTemplateKind(lastDocumentPackingSlipSettings[0]);
        const [validationPassed, info] = validatePackingSlipInputForProvidedKind(calculatedTemplateKind, lastDocumentSettings[0]);
        
        if (validationPassed) {
          const nextNumber: string = await this.getNextPackingSlipNumber();

          const entryPackingSlip: any = {
            number: parseInt(nextNumber),
            displayNumber: packingSlipSettings.numberFormat ? packingSlipSettings.numberFormat.replace(PACKING_SLIP_NUMBER_PLACEHOLDER, nextNumber) : nextNumber,
            created_at: new Date(Date.now()),
            packing_slip_settings_id: packingSlipSettings.id,
            settings_id: lastDocumentSettings[0].id
          }

          const packingSlipResult = await this.createDocumentPackingSlips(entryPackingSlip)

          const buffer = await generatePackingSlip(calculatedTemplateKind, lastDocumentSettings[0], packingSlipResult, order);
          return {
            packingSlip: packingSlipResult,
            buffer: buffer
          }
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            info
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Retrieve packing slip settings failed. Please check if they are set - e.g. if you set template or other settings.'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Document settings are not defined'
      );
    }
  }

  async updateInvoiceTemplate(invoiceTemplate?: InvoiceTemplateKind) : Promise<any> {
    const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
      const newDocumentSettings = {
        template : invoiceTemplate ?? lastDocumentInvoiceSettings[0].template,
      }
      const result = await this.createDocumentInvoiceSettings(newDocumentSettings)
      return result;
    } else {
      const result = await this.createDocumentInvoiceSettings({
        template : invoiceTemplate
      })
      return result;
    }
  }

  async updatePackingSlipTemplate(packingSlipTemplate?: PackingSlipTemplateKind) : Promise<any> {
    const lastDocumentPackingSlipSettings = await this.listDocumentPackingSlipSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length) {
      const newDocumentSettings = {
        template : packingSlipTemplate ?? lastDocumentPackingSlipSettings[0].template,
      }
      const result = await this.createDocumentPackingSlipSettings(newDocumentSettings)
      return result;
    } else {
      const result = await this.createDocumentPackingSlipSettings({
        template : packingSlipTemplate
      })
      return result;
    }
  }

  async updatePackingSlipSettings(newFormatNumber?: string, forcedNumber?: string, template?: PackingSlipTemplateKind) : Promise<any> {
    const lastDocumentPackingSlipSettings = await this.listDocumentPackingSlipSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length) {
      const result = await this.createDocumentPackingSlipSettings({
        numberFormat: newFormatNumber ?? lastDocumentPackingSlipSettings[0].numberFormat,
        forcedNumber : forcedNumber ? parseInt(forcedNumber) : lastDocumentPackingSlipSettings[0].forcedNumber,
        template : template ?? lastDocumentPackingSlipSettings[0].template,
      })
      return result;
    } else {
      const result = await this.createDocumentPackingSlipSettings({
        numberFormat: newFormatNumber,
        forcedNumber : forcedNumber ? parseInt(forcedNumber) : undefined,
        template : template
      })
      return result;
    }
  }

  async updateInvoiceSettings(newFormatNumber?: string, invoiceTemplate?: InvoiceTemplateKind) : Promise<any> {
    const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
      const result = await this.createDocumentInvoiceSettings({
        numberFormat: newFormatNumber ?? lastDocumentInvoiceSettings[0].numberFormat,
        template : invoiceTemplate ?? lastDocumentInvoiceSettings[0].template,
      })
      return result;
    } else {
      const result = await this.createDocumentInvoiceSettings({
        numberFormat: newFormatNumber,
        template : invoiceTemplate
      })
      return result;
    }
  }

  async updateStoreLogo(logoSource: string) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const result = await this.createDocumentSettings({
        storeLogoSource: logoSource,
        storeAddress: lastDocumentSettings[0].storeAddress,
        storeIndiaGstDetails: lastDocumentSettings[0].storeIndiaGstDetails
      });
      return result;
    } else {
      const result = await this.createDocumentSettings({
        storeLogoSource: logoSource
      })
      return result;
    }
  }

  async updateStoreDocumentAddress(address: DocumentAddress) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1,
      relations: ["documentInvoice", "documentPackingSlip"]
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const result = await this.createDocumentSettings({
        id: undefined,
        // created_at: undefined,
        // updated_at: undefined,
        // deleted_at: undefined,
        storeAddress: address,
        storeLogoSource: lastDocumentSettings[0].storeLogoSource,
        storeIndiaGstDetails: lastDocumentSettings[0].storeIndiaGstDetails,
        // documentInvoice: lastDocumentSettings[0].documentInvoice,
        // documentInvoice: lastDocumentSettings[0].documentInvoice,
        // documentPackingSlip: lastDocumentSettings[0].documentPackingSlip
      });
      return result;
    } else {
      const result = await this.createDocumentSettings({
        storeAddress: address,
      })
      return result;
    }
  }

  async updateStoreIndiaGstDetails(details: IndiaGstDetailsDTO) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const result = await this.createDocumentSettings({
        storeIndiaGstDetails: details,
        storeAddress: lastDocumentSettings[0].storeAddress,
        storeLogoSource: lastDocumentSettings[0].storeLogoSource
      });
      return result;
    } else {
      const result = await this.createDocumentSettings({
        storeIndiaGstDetails: details
      })
      return result;
    }
  }

  async getTestDisplayNumber(formatNumber?: string) : Promise<string | undefined> {
    const nextSerial = await this.peekNextGstSerial();
    if (nextSerial !== undefined) {
      return this.formatInvoiceDisplayNumber(formatNumber, nextSerial.toString(), new Date());
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invoice numbering is not set up: "${GST_SERIAL}" counter is missing`
    );
  }
}

export default DocumentsModuleService