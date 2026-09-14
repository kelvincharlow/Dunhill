export const credentialGroups = [
  { title: "Building works", description: "NCA contractor documentation", documents: [
    { id: "building-registration", title: "Building Works registration" },
    { id: "building-licence", title: "Building Works practising licence" },
  ] },
  { title: "Road works", description: "NCA contractor documentation", documents: [
    { id: "road-registration", title: "Road Works registration" },
    { id: "road-licence", title: "Road Works practising licence" },
  ] },
  { title: "Company records", description: "Corporate, business and tax documentation", documents: [
    { id: "incorporation", title: "Certificate of incorporation" },
    { id: "business-permits", title: "Business permits" },
    { id: "tax-compliance", title: "Tax compliance certificate" },
  ] },
];
export const credentialDocuments = credentialGroups.flatMap(group => group.documents);

export function credentialRequestDescription(input?: string | string[]) {
  const ids = new Set(typeof input === "string" ? [input] : input || []);
  const selected = credentialDocuments.filter(document => ids.has(document.id));
  if (!selected.length) return "";
  return `Please share current copies of the following documents:\n${selected.map(document => `• ${document.title}`).join("\n")}\n\nProject or tender reference:\nRequired by:\nAdditional information:`;
}
