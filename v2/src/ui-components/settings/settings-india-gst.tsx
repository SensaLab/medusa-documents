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

import { Heading, Text, FocusModal, Button, Input, Label } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react";

type IndiaGstDetails = {
  gstin?: string
  legalName?: string
  pan?: string
  cin?: string
  signatureSource?: string
}

const GstField = ({ name, placeholder, initValue, register }: { name: string, placeholder: string, initValue?: string, register: any }) => {
  return (
    <Grid container direction={'column'} spacing={1} marginTop={2}>
      <Grid item>
        <Label size="small">
          {name}
        </Label>
      </Grid>
      <Grid item>
        <Input
          placeholder={placeholder}
          {...register}
          defaultValue={initValue}
        />
      </Grid>
    </Grid>
  )
}

const IndiaGstForm = ({ details, setOpenModal }: { details?: IndiaGstDetails, setOpenModal: any }) => {

  const { register, handleSubmit } = useForm<IndiaGstDetails>()

  const onSubmit = (data: IndiaGstDetails) => {
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
        toast.success('India GST details', {
          description: "New details saved",
        });
        setOpenModal(false);
      } else {
        const error = await response.json();
        toast.error('India GST details', {
          description: `Details cannot be saved. ${error.message}`,
        });
      }
    })
    .catch((e) => {
      toast.error('India GST details', {
        description: `Details cannot be saved. ${e.toString()}`,
      });
      console.error(e)
    })
  }

  return (
    <form>
      <Grid container direction={'column'} rowSpacing={4} paddingTop={8}>
        <GstField
          name="Legal Name"
          placeholder="SensaLabs Wellness Private Limited"
          register={register('legalName')}
          initValue={details?.legalName}
        />
        <GstField
          name="GSTIN"
          placeholder="27ABSCS6019B1ZX"
          register={register('gstin')}
          initValue={details?.gstin}
        />
        <GstField
          name="PAN"
          placeholder="ABSCS6019B"
          register={register('pan')}
          initValue={details?.pan}
        />
        <GstField
          name="CIN (optional)"
          placeholder="U12345MH2020PTC123456"
          register={register('cin')}
          initValue={details?.cin}
        />
        <GstField
          name="Signature image URL (optional)"
          placeholder="https://.../signature.png"
          register={register('signatureSource')}
          initValue={details?.signatureSource}
        />
        <Grid item>
          <Button
            type="submit"
            variant={'primary'}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

const IndiaGstModalDetails = ({ setOpenModal }) => {

  const [data, setData] = useState<any | undefined>(undefined)

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/document-settings/india-gst`, {
      credentials: "include",
    })
    .then((res) => res.json())
    .then((result) => {
      setData(result)
      setLoading(false)
    })
    .catch((error) => {
      setError(error);
      console.error(error);
    })
  }, [isLoading])

  if (isLoading) {
    return (
      <FocusModal.Body>
        <CircularProgress/>
      </FocusModal.Body>
    )
  }

  return (
    <FocusModal.Body>
      <Grid container direction={'column'} alignContent={'center'} paddingTop={8}>
        <Grid item>
          <Heading>India GST details</Heading>
        </Grid>
        <Grid item>
          <Text>
            Used on the India GST invoice template. GSTIN and Legal Name are required to generate that template.
          </Text>
        </Grid>
        <Grid item>
          <Text>
            Optional fields (CIN, signature) are only printed when a value is set.
          </Text>
        </Grid>
        <Grid item>
          <IndiaGstForm details={data?.indiaGstDetails as IndiaGstDetails | undefined} setOpenModal={setOpenModal}/>
        </Grid>
      </Grid>
    </FocusModal.Body>
  )
}

const IndiaGstChangeModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <FocusModal
      open={open}
      onOpenChange={setOpen}
    >
      <FocusModal.Trigger asChild>
        <Button>India GST details</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header/>
        <IndiaGstModalDetails setOpenModal={setOpen}/>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default IndiaGstChangeModal
