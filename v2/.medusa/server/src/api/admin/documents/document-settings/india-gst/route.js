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
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const documents_1 = require("../../../../../modules/documents");
const GET = async (req, res) => {
    const documentsModuleService = req.scope.resolve(documents_1.DOCUMENTS_MODULE);
    try {
        const lastDocumentSettings = await documentsModuleService.listDocumentSettings({}, {
            order: {
                created_at: "DESC"
            },
            take: 1
        });
        res.status(200).json({
            indiaGstDetails: lastDocumentSettings && lastDocumentSettings.length ? lastDocumentSettings[0].storeIndiaGstDetails : undefined
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
};
exports.GET = GET;
const POST = async (req, res) => {
    const body = req.body;
    const indiaGstDetails = body.indiaGstDetails;
    const documentsModuleService = req.scope.resolve(documents_1.DOCUMENTS_MODULE);
    try {
        if (indiaGstDetails !== undefined) {
            const newSettings = await documentsModuleService.updateStoreIndiaGstDetails(indiaGstDetails);
            if (newSettings !== undefined) {
                res.status(201).json({
                    settings: newSettings
                });
            }
            else {
                res.status(400).json({
                    message: 'Cant update India GST details'
                });
            }
        }
        else {
            res.status(400).json({
                message: 'India GST details not passed'
            });
        }
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2RvY3VtZW50cy9kb2N1bWVudC1zZXR0aW5ncy9pbmRpYS1nc3Qvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7O0dBVUc7OztBQU9ILGdFQUFtRTtBQUk1RCxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFFRixNQUFNLHNCQUFzQixHQUEyQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw0QkFBZ0IsQ0FBQyxDQUFBO0lBRTFGLElBQUksQ0FBQztRQUNILE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUU7WUFDakYsS0FBSyxFQUFFO2dCQUNMLFVBQVUsRUFBRSxNQUFNO2FBQ25CO1lBQ0QsSUFBSSxFQUFFLENBQUM7U0FDUixDQUFDLENBQUE7UUFDRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixlQUFlLEVBQUUsb0JBQW9CLElBQUksb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUNoSSxDQUFDLENBQUM7SUFFTCxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztTQUNuQixDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBdkJZLFFBQUEsR0FBRyxPQXVCZjtBQUVNLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUVGLE1BQU0sSUFBSSxHQUFRLEdBQUcsQ0FBQyxJQUFXLENBQUM7SUFDbEMsTUFBTSxlQUFlLEdBQW1DLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDN0UsTUFBTSxzQkFBc0IsR0FBMkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsNEJBQWdCLENBQUMsQ0FBQTtJQUUxRixJQUFJLENBQUM7UUFDSCxJQUFJLGVBQWUsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxNQUFNLFdBQVcsR0FBRyxNQUFNLHNCQUFzQixDQUFDLDBCQUEwQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzdGLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDbkIsUUFBUSxFQUFFLFdBQVc7aUJBQ3RCLENBQUMsQ0FBQztZQUNMLENBQUM7aUJBQU0sQ0FBQztnQkFDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDbkIsT0FBTyxFQUFFLCtCQUErQjtpQkFDekMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztRQUNILENBQUM7YUFBTSxDQUFDO1lBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSw4QkFBOEI7YUFDeEMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztJQUVILENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO1NBQ3JCLENBQUMsQ0FBQTtJQUNKLENBQUM7QUFDSCxDQUFDLENBQUE7QUFoQ1ksUUFBQSxJQUFJLFFBZ0NoQiJ9