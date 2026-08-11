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

import { ArrowPath } from "@medusajs/icons"
import { DropdownMenu, toast } from "@medusajs/ui"
import { useEffect, useState } from "react";

const ForceNewInvoiceDropdownButton = ({ order, updateInvoiceNumber } : {order : any, updateInvoiceNumber: any}) => {

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
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
        force_new: true
      })
    })
    .then((res) => res.json())
    .then((responseJson) => {
      if (responseJson && responseJson.message) {
        toast.error("Invoice", {
          description: `Problem happened when generating new invoice number. ${responseJson.message}`,
        })
      } else {
        if (responseJson.buffer) {
          updateInvoiceNumber(order.id, responseJson.invoice.displayNumber)
          const anyBuffer = responseJson.buffer as any;
          const blob = new Blob([ new Uint8Array(anyBuffer.data)  ], { type : 'application/pdf'});
          toast.dismiss();
          const pdfURL = URL.createObjectURL(blob);
          window.open(pdfURL, '_blank');
        } else {
          toast.dismiss();
          toast.error("Invoice", {
            description: 'Problem happened when generating new invoice number',
          })
        }
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      toast.dismiss();
      const trueError = error as any;
      toast.error("Invoice", {
        description: trueError?.response?.data?.message,
      })
    })
  }, [isLoading])

  return (
    <DropdownMenu.Item className="gap-x-2" onClick={() => {
      if (window.confirm('This mints a brand new invoice number for this order, replacing the current one. The old number stays burned (not reusable). Continue?')) {
        setLoading(true)
      }
    }}>
      <ArrowPath/>
        Generate new invoice number
    </DropdownMenu.Item>
  )
}

export default ForceNewInvoiceDropdownButton
