"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsTab = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
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
const ui_1 = require("@medusajs/ui");
const material_1 = require("@mui/material");
const settings_address_1 = __importDefault(require("../settings/settings-address"));
const settings_logo_1 = __importDefault(require("../settings/settings-logo"));
const settings_invoice_1 = __importDefault(require("../settings/settings-invoice"));
const settings_india_gst_1 = __importDefault(require("../settings/settings-india-gst"));
const SettingsTab = () => {
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 6, md: 6, xl: 6, children: (0, jsx_runtime_1.jsxs)(ui_1.Container, { children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, direction: 'column', children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: "h1", children: "Store information" }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Text, { size: "small", children: "Change information about your store to have it included in generated documents" }) })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, marginTop: 5, direction: 'row', columnSpacing: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(settings_address_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(settings_logo_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(settings_india_gst_1.default, {}) })] })] }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 6, md: 6, xl: 6, children: (0, jsx_runtime_1.jsxs)(ui_1.Container, { children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, direction: 'column', children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: "h1", children: "Invoice" }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Text, { size: "small", children: "Change settings how invoices are generated" }) })] }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, marginTop: 5, direction: 'row', columnSpacing: 2, children: (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(settings_invoice_1.default, {}) }) })] }) })] }));
};
exports.SettingsTab = SettingsTab;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtdGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3VpLWNvbXBvbmVudHMvdGFicy9zZXR0aW5ncy10YWIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7OztHQVVHO0FBRUgscUNBQXVEO0FBQ3ZELDRDQUFxQztBQUNyQyxvRkFBOEQ7QUFDOUQsOEVBQXdEO0FBQ3hELG9GQUFnRTtBQUNoRSx3RkFBaUU7QUFFMUQsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFO0lBQzlCLE9BQU8sQ0FDTCx3QkFBQyxlQUFJLElBQUMsU0FBUyxRQUFDLE9BQU8sRUFBRSxDQUFDLGFBQ3hCLHVCQUFDLGVBQUksSUFBQyxJQUFJLFFBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQzVCLHdCQUFDLGNBQVMsZUFDUix3QkFBQyxlQUFJLElBQUMsU0FBUyxRQUFDLFNBQVMsRUFBRSxRQUFRLGFBQ2pDLHVCQUFDLGVBQUksSUFBQyxJQUFJLGtCQUNSLHVCQUFDLFlBQU8sSUFBQyxLQUFLLEVBQUMsSUFBSSxrQ0FFVCxHQUNMLEVBQ1AsdUJBQUMsZUFBSSxJQUFDLElBQUksa0JBQ1IsdUJBQUMsU0FBSSxJQUFDLElBQUksRUFBQyxPQUFPLCtGQUVYLEdBQ0YsSUFDRixFQUNQLHdCQUFDLGVBQUksSUFBQyxTQUFTLFFBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLGFBQzlELHVCQUFDLGVBQUksSUFBQyxJQUFJLGtCQUNSLHVCQUFDLDBCQUFrQixLQUFFLEdBQ2hCLEVBQ1AsdUJBQUMsZUFBSSxJQUFDLElBQUksa0JBQ1IsdUJBQUMsdUJBQWUsS0FBRSxHQUNiLEVBQ1AsdUJBQUMsZUFBSSxJQUFDLElBQUksa0JBQ1IsdUJBQUMsNEJBQW1CLEtBQUUsR0FDakIsSUFDRixJQUNHLEdBQ1AsRUFDUCx1QkFBQyxlQUFJLElBQUMsSUFBSSxRQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxZQUM1Qix3QkFBQyxjQUFTLGVBQ1Isd0JBQUMsZUFBSSxJQUFDLFNBQVMsUUFBQyxTQUFTLEVBQUUsUUFBUSxhQUNqQyx1QkFBQyxlQUFJLElBQUMsSUFBSSxrQkFDUix1QkFBQyxZQUFPLElBQUMsS0FBSyxFQUFDLElBQUksd0JBRVQsR0FDTCxFQUNQLHVCQUFDLGVBQUksSUFBQyxJQUFJLGtCQUNSLHVCQUFDLFNBQUksSUFBQyxJQUFJLEVBQUMsT0FBTywyREFFWCxHQUNGLElBQ0YsRUFDUCx1QkFBQyxlQUFJLElBQUMsU0FBUyxRQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxZQUM5RCx1QkFBQyxlQUFJLElBQUMsSUFBSSxrQkFDUix1QkFBQywwQkFBb0IsS0FBRSxHQUNsQixHQUNGLElBQ0csR0FDUCxJQUNGLENBQ1IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQXJEWSxRQUFBLFdBQVcsZUFxRHZCIn0=