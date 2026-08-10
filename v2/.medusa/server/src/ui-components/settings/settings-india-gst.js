"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const react_hook_form_1 = require("react-hook-form");
const ui_2 = require("@medusajs/ui");
const react_1 = require("react");
const GstField = ({ name, placeholder, initValue, register }) => {
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, direction: 'column', spacing: 1, marginTop: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Label, { size: "small", children: name }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: placeholder, ...register, defaultValue: initValue }) })] }));
};
const IndiaGstForm = ({ details, setOpenModal }) => {
    const { register, handleSubmit } = (0, react_hook_form_1.useForm)();
    const onSubmit = (data) => {
        fetch(`/admin/documents/document-settings/india-gst`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                indiaGstDetails: data
            })
        })
            .then(async (response) => {
            if (response.ok) {
                ui_2.toast.success('India GST details', {
                    description: "New details saved",
                });
                setOpenModal(false);
            }
            else {
                const error = await response.json();
                ui_2.toast.error('India GST details', {
                    description: `Details cannot be saved. ${error.message}`,
                });
            }
        })
            .catch((e) => {
            ui_2.toast.error('India GST details', {
                description: `Details cannot be saved. ${e.toString()}`,
            });
            console.error(e);
        });
    };
    return ((0, jsx_runtime_1.jsx)("form", { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, direction: 'column', rowSpacing: 4, paddingTop: 8, children: [(0, jsx_runtime_1.jsx)(GstField, { name: "Legal Name", placeholder: "SensaLabs Wellness Private Limited", register: register('legalName'), initValue: details?.legalName }), (0, jsx_runtime_1.jsx)(GstField, { name: "GSTIN", placeholder: "27ABSCS6019B1ZX", register: register('gstin'), initValue: details?.gstin }), (0, jsx_runtime_1.jsx)(GstField, { name: "PAN", placeholder: "ABSCS6019B", register: register('pan'), initValue: details?.pan }), (0, jsx_runtime_1.jsx)(GstField, { name: "CIN (optional)", placeholder: "U12345MH2020PTC123456", register: register('cin'), initValue: details?.cin }), (0, jsx_runtime_1.jsx)(GstField, { name: "Signature image URL (optional)", placeholder: "https://.../signature.png", register: register('signatureSource'), initValue: details?.signatureSource }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Button, { type: "submit", variant: 'primary', onClick: handleSubmit(onSubmit), children: "Save" }) })] }) }));
};
const IndiaGstModalDetails = ({ setOpenModal }) => {
    const [data, setData] = (0, react_1.useState)(undefined);
    const [error, setError] = (0, react_1.useState)(undefined);
    const [isLoading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (!isLoading) {
            return;
        }
        fetch(`/admin/documents/document-settings/india-gst`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((result) => {
            setData(result);
            setLoading(false);
        })
            .catch((error) => {
            setError(error);
            console.error(error);
        });
    }, [isLoading]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(ui_1.FocusModal.Body, { children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) }));
    }
    return ((0, jsx_runtime_1.jsx)(ui_1.FocusModal.Body, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, direction: 'column', alignContent: 'center', paddingTop: 8, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Heading, { children: "India GST details" }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Used on the India GST invoice template. GSTIN and Legal Name are required to generate that template." }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Optional fields (CIN, signature) are only printed when a value is set." }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, children: (0, jsx_runtime_1.jsx)(IndiaGstForm, { details: data?.indiaGstDetails, setOpenModal: setOpenModal }) })] }) }));
};
const IndiaGstChangeModal = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)(ui_1.FocusModal, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(ui_1.FocusModal.Trigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(ui_1.Button, { children: "India GST details" }) }), (0, jsx_runtime_1.jsxs)(ui_1.FocusModal.Content, { children: [(0, jsx_runtime_1.jsx)(ui_1.FocusModal.Header, {}), (0, jsx_runtime_1.jsx)(IndiaGstModalDetails, { setOpenModal: setOpen })] })] }));
};
exports.default = IndiaGstChangeModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtaW5kaWEtZ3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3VpLWNvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MtaW5kaWEtZ3N0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7OztHQVVHO0FBRUgscUNBQThFO0FBQzlFLDRDQUF1RDtBQUN2RCxxREFBMEM7QUFDMUMscUNBQW9DO0FBQ3BDLGlDQUE0QztBQVU1QyxNQUFNLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUE0RSxFQUFFLEVBQUU7SUFDeEksT0FBTyxDQUNMLHdCQUFDLGVBQUksSUFBQyxTQUFTLFFBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLGFBQzNELHVCQUFDLGVBQUksSUFBQyxJQUFJLGtCQUNSLHVCQUFDLFVBQUssSUFBQyxJQUFJLEVBQUMsT0FBTyxZQUNoQixJQUFJLEdBQ0MsR0FDSCxFQUNQLHVCQUFDLGVBQUksSUFBQyxJQUFJLGtCQUNSLHVCQUFDLFVBQUssSUFDSixXQUFXLEVBQUUsV0FBVyxLQUNwQixRQUFRLEVBQ1osWUFBWSxFQUFFLFNBQVMsR0FDdkIsR0FDRyxJQUNGLENBQ1IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFvRCxFQUFFLEVBQUU7SUFFbkcsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFBLHlCQUFPLEdBQW1CLENBQUE7SUFFN0QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFxQixFQUFFLEVBQUU7UUFDekMsS0FBSyxDQUFDLDhDQUE4QyxFQUFFO1lBQ3BELE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFLFNBQVM7WUFDdEIsT0FBTyxFQUFFO2dC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