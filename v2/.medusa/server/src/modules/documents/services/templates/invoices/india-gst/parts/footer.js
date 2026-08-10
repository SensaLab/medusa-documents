"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFooter = generateFooter;
async function generateFooter(doc, y, settings) {
    const gst = settings.storeIndiaGstDetails;
    const legalName = gst?.legalName || settings.storeAddress?.company || '';
    const pageHeight = doc.page.height - 100;
    let _y = y;
    if (_y > pageHeight) {
        doc.addPage();
        _y = 50;
    }
    doc
        .fillColor("#000000")
        .font("Regular")
        .fontSize(9)
        .text(`For ${legalName}`, 400, _y, { width: 155, align: 'right' });
    let signatureY = _y + 15;
    if (gst?.signatureSource) {
        try {
            const responseImage = await fetch(gst.signatureSource);
            if (responseImage.ok && responseImage.status == 200) {
                const responseImageBuffer = await responseImage.arrayBuffer();
                const responseBuffer = Buffer.from(responseImageBuffer);
                doc.image(responseBuffer, 440, signatureY, { align: 'right', width: 115, height: 40 });
            }
        }
        catch {
            // ponytail: signature is optional, silently skip on fetch failure rather than breaking the invoice
        }
        signatureY += 45;
    }
    else {
        signatureY += 40;
    }
    doc
        .fontSize(9)
        .text('Authorised Signatory', 400, signatureY, { width: 155, align: 'right' });
    return signatureY + 15;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZG9jdW1lbnRzL3NlcnZpY2VzL3RlbXBsYXRlcy9pbnZvaWNlcy9pbmRpYS1nc3QvcGFydHMvZm9vdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsd0NBd0NDO0FBeENNLEtBQUssVUFBVSxjQUFjLENBQUMsR0FBRyxFQUFFLENBQVMsRUFBRSxRQUE2QjtJQUNoRixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUM7SUFDMUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFLFNBQVMsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFFekUsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3pDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNYLElBQUksRUFBRSxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNkLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDVixDQUFDO0lBRUQsR0FBRztTQUNBLFNBQVMsQ0FBQyxTQUFTLENBQUM7U0FDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDWCxJQUFJLENBQUMsT0FBTyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUVyRSxJQUFJLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBRXpCLElBQUksR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQztZQUNILE1BQU0sYUFBYSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2RCxJQUFJLGFBQWEsQ0FBQyxFQUFFLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDcEQsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUN4RCxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLENBQUM7UUFDSCxDQUFDO1FBQUMsTUFBTSxDQUFDO1lBQ1AsbUdBQW1HO1FBQ3JHLENBQUM7UUFDRCxVQUFVLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUM7U0FBTSxDQUFDO1FBQ04sVUFBVSxJQUFJLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsR0FBRztTQUNBLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDWCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFakYsT0FBTyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLENBQUMifQ==