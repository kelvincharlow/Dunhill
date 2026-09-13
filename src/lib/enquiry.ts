export const serviceInterests = ["General enquiry", "Building construction", "Civil engineering & road works", "Industrial construction", "Renovation & refurbishment", "Timber joinery", "Metal & structural fabrication", "Plant & workshops", "Compliance documents", "Other"];
export const projectValues = ["Not specified", "Under KSh 10 million", "KSh 10–50 million", "KSh 50–100 million", "KSh 100–500 million", "Over KSh 500 million", "Prefer to discuss"];
export type Enquiry = { name:string; company:string; email:string; phone:string; service:string; location:string; value:string; description:string; consent:boolean; website:string };
export function validateEnquiry(input: unknown): { data?: Enquiry; error?: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {error:"Please complete the enquiry form."};
  const raw = input as Record<string, unknown>;
  const limits: Record<string, number> = {name:100, company:160, email:254, phone:40, service:80, location:160, value:80, description:5000, website:200};
  const clean:Record<string,string> = {};
  for (const [key,max] of Object.entries(limits)) {
    if (typeof raw[key] !== "string" || raw[key].length>max) return {error:"Please check the form fields and their length limits."};
    clean[key]=raw[key].trim();
  }
  if(clean.website) return {error:"Unable to accept this enquiry. Please contact us by email."};
  if(!clean.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || clean.description.length<10) return {error:"Please enter your name, a valid email and a message of at least 10 characters."};
  if(clean.phone && !/^[+\d\s().-]{7,40}$/.test(clean.phone)) return {error:"Please enter a valid phone number or leave it blank."};
  if(!serviceInterests.includes(clean.service) || !projectValues.includes(clean.value) || raw.consent!==true) return {error:"Select your enquiry interest and confirm we may contact you about it."};
  return {data:{...clean,consent:true} as Enquiry};
}
