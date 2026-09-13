import { validateEnquiry } from "@/lib/enquiry";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({error:"Request origin not accepted."},{status:403});
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({error:"JSON required."},{status:415});
  const reader=request.body?.getReader();
  if(!reader) return Response.json({error:"Form data required."},{status:400});
  const chunks:Uint8Array[]=[];let size=0;
  while(true) { const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16384){await reader.cancel();return Response.json({error:"Your enquiry is too long."},{status:413});}chunks.push(value); }
  let input:unknown;
  try { input=JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return Response.json({error:"Invalid form data."},{status:400}); }
  const result=validateEnquiry(input);
  if(!result.data) return Response.json({error:result.error},{status:400});
  const endpoint=process.env.ENQUIRY_WEBHOOK_URL;
  const token=process.env.ENQUIRY_WEBHOOK_TOKEN;
  if(!endpoint || !token) return Response.json({error:"Online delivery is not connected yet. Please use the email draft option or call our office."},{status:503});
  try {
    if(new URL(endpoint).protocol!=="https:") throw new Error("HTTPS required");
    const {website: _website, ...enquiry}=result.data;
    void _website;
    const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({enquiry,submittedAt:new Date().toISOString()}),signal:AbortSignal.timeout(10000),redirect:"error",cache:"no-store"});
    if(!response.ok) throw new Error("Delivery rejected");
    return Response.json({accepted:true});
  } catch { return Response.json({error:"We could not confirm delivery. Your details are still in the form. Please try again later or use the email draft option."},{status:502}); }
}
