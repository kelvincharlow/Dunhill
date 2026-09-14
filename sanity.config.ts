import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) {
  throw new Error("Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in .env.local before starting Sanity Studio. See docs/sanity.md.");
}

export default defineConfig({
  name: "dunhill",
  title: "Dunhill — Projects",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
