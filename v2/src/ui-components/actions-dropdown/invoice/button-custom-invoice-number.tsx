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

import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react";

// ponytail: temporary manual-number escape hatch for GST filing while the counter redesign is pending.
// Ugly on purpose - inline input instead of a proper dialog, only edits the trailing {invoice-number} part.
const CustomInvoiceNumberDropdownButton = ({ order, updateInvoiceNumber } : {order : any, updateInvoiceNumber: any}) => {

  const [inputValue, setInputValue] = useState("")
  const [customNumber, setCustomNumber] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!customNumber) {
      return;
    }
    fetch(`/admin/documents/invoice`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order.id,
        force_new: true,
        custom_number: customNumber
      })
    })
    .then((res) => res.json())
    .then((responseJson) => {
      if (responseJson && responseJson.message) {
        toast.error("Invoice", {
          description: `Problem happened when generating invoice with custom number. ${responseJson.message}`,
        })
      } else {
        if (responseJson.buffer) {
          updateInvoiceNumber(order.id, responseJson.invoice.displayNumber)
          const anyBuffer = responseJson.buffer as any;
          const blob = new Blob([ new Uint8Array(anyBuffer.data)  ], { type : 'application/pdf'});
          toast.dismiss();
          const pdfURL = URL.createObjectURL(blob);
          window.open(pdfURL, '_blank');
          setInputValue("");
        } else {
          toast.dismiss();
          toast.error("Invoice", {
            description: 'Problem happened when generating invoice with custom number',
          })
        }
      }
      setCustomNumber(undefined);
    })
    .catch((error) => {
      console.error(error);
      toast.dismiss();
      const trueError = error as any;
      toast.error("Invoice", {
        description: trueError?.response?.data?.message,
      })
      setCustomNumber(undefined);
    })
  }, [customNumber])

  const submit = () => {
    if (inputValue.trim().length) {
      setCustomNumber(inputValue.trim())
    }
  }

  return (
    <div
      style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '6px 8px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        placeholder="e.g. 5"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            submit();
          }
        }}
        style={{ width: 50, fontSize: 12, padding: '2px 4px' }}
      />
      <button onClick={submit} style={{ fontSize: 12, cursor: 'pointer' }}>
        Generate w/ custom #
      </button>
    </div>
  )
}

export default CustomInvoiceNumberDropdownButton
