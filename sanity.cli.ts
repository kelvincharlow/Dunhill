import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  deployment: {
    appId: "drou0xtqgcnvk0jynnon2egj",
  },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
});
