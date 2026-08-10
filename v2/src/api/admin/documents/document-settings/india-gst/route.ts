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

import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { DOCUMENTS_MODULE } from "../../../../../modules/documents"
import DocumentsModuleService from "../../../../../modules/documents/service"
import { IndiaGstDetailsDTO } from "../../../../../modules/documents/types/dto"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    const lastDocumentSettings = await documentsModuleService.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    res.status(200).json({
      indiaGstDetails: lastDocumentSettings && lastDocumentSettings.length ? lastDocumentSettings[0].storeIndiaGstDetails : undefined
    });

  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const body: any = req.body as any;
  const indiaGstDetails: IndiaGstDetailsDTO | undefined = body.indiaGstDetails;
  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    if (indiaGstDetails !== undefined) {
      const newSettings = await documentsModuleService.updateStoreIndiaGstDetails(indiaGstDetails);
      if (newSettings !== undefined) {
        res.status(201).json({
          settings: newSettings
        });
      } else {
        res.status(400).json({
          message: 'Cant update India GST details'
        })
      }
    } else {
      res.status(400).json({
        message: 'India GST details not passed'
      })
    }

  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}
