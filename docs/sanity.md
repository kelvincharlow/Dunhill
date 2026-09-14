# Project editing with Sanity

The website reads published Sanity projects for the grid, detail pages and homepage. Only published Sanity records appear in the visual portfolio; incomplete records are omitted. The former Crescent Pearl and National Park Villas fallback records have been removed and will appear only if published in Sanity.

Requires Node.js 22.12 or newer.

## Connect a Sanity project

Create or choose a project at https://www.sanity.io/manage and note its project ID and dataset name. Add these public identifiers to the existing `.env.local` file (do not replace other settings):

```dotenv
SANITY_STUDIO_PROJECT_ID=x7trmz7f
SANITY_STUDIO_DATASET=production
```

The Dunhill project is `x7trmz7f`; its verified dataset name is lowercase `production`. No API token belongs in these settings. Studio handles editor authentication through Sanity sign-in.

Run `npm run studio` and open http://localhost:3333. Sign in with an account that can edit the selected project. If requested, add this exact local origin to the project's Studio CORS configuration. The Studio runs separately from Next.js so website typography, dark mode and navigation do not affect the editor.

## Add a project

1. Create a Project and enter its name, generated page address, category, location and overview.
2. Upload a cover photograph, describe it with alt text, and set its focal point. Add optional gallery photographs and drag them into order.
3. Choose the related services; the first is intended for the project's enquiry prefill. Add optional scope, status, confirmed completion year and project-team details.
4. Set the display order (lower numbers first), optionally feature it on the homepage, and publish when ready.

The same category list drives the website filters and Sanity, excluding the synthetic “All projects” option. Existing service IDs are reused. Queries use the published perspective and exclude draft and release-version documents. The first related service prefills the contact form; all selected services appear on the detail page.

Do not copy the local `year` field into `completionYear`: current records use company-profile years, which are not confirmed completion dates. Preserve `crescent-pearl` and `national-park-villas` as slugs when adding these projects so their links continue to work. No content or assets have been uploaded automatically.

## Schema and validation

- `sanity/schemaTypes/project.ts`: project fields, groups, preview and sort orders.
- `sanity/schemaTypes/projectImage.ts`: image uploads, crop/hotspot, required alt text, optional captions and credits.
- `sanity.config.ts`: Studio configuration and schema registration.
- `sanity.cli.ts`: CLI project/dataset configuration.

Commands:

```sh
npm run studio
npm run studio:build
npm run studio:schema
```

The latter two commands build a local Studio and extract its schema; they do not deploy a Studio or publish content. Generated files are ignored by Git. A real project ID and dataset are needed to use the editor. Local compilation can be checked with temporary syntactically valid identifiers; that does not verify access to a Sanity account.

## Website behaviour

- Projects sort by display order, then name. Duplicate slugs appear only once; keep every slug unique.
- The homepage shows up to two featured projects in this order; the first supplies the hero photograph and link. If none are marked featured, it uses the first two photographed projects.
- The grid shows only the cover photo and name, retaining category filters and the category when returning from a detail page.
- Detail pages show the gallery in editorial order, optional captions/credits, scope, related services and confirmed project facts. Gallery photos can be opened at a larger size. CDN images respect the editor's crop; cover layouts preserve the focal point.
- New project URLs are generated when requested; publishing does not require rebuilding the website.
- The server caches queries for 60 seconds. After that interval, a visit triggers background refresh, so the first visitor can still receive the previous version. Refresh again after revalidation to see the update. This is not a guaranteed 60-second publication deadline.
- The remaining company-profile records without photography retain their direct URLs for service links and bookmarks during migration. Sanity overrides a local record with the same slug. Local records do not join the CMS grid; if a matching Sanity record is unpublished, its older profile detail page remains accessible until that local record is removed from the code.
- API failures are logged on the server and return an empty portfolio; hardcoded cards are never substituted. A successful response containing only invalid records produces an empty portfolio; correct and publish those records in Studio.

## Deploying

Add `SANITY_STUDIO_PROJECT_ID=x7trmz7f` and `SANITY_STUDIO_DATASET=production` in the Vercel project's environment variables for Production and Preview. Use Node.js 22.12 or newer. Variables take effect on the next deployment; `.env.local` is ignored by Git and does not configure Vercel.

Deploy the updated website code after testing. No API token is needed for this public dataset. No webhook is required for the 60-second cache policy, and no webhook receiver has been added. A signed on-demand revalidation endpoint can be added later if faster updates are needed.

Studio is live at https://dunhill-contractors.sanity.studio/. Sign in using the email-and-password method for the Dunhill administrator account. Run `npx sanity deploy sanity-dist` to update the hosted editor; `sanity.cli.ts` records its deployment app ID. This is separate from deploying the Next.js website and does not publish project documents automatically. For a custom Studio host, authorize its exact origin in Sanity CORS with credentials for editor sign-in. Server-side website queries do not need a browser CORS entry.

## Validation

Run `npm run test:sanity`, `npm run lint`, `npm run build` and `npm run studio:build`. Data tests cover draft exclusion, CMS authority, removed fallback records and empty/error states, new slugs, filtering, featured selection, image crops and focal points. Real project photographs should be checked after the first Sanity content is published.

References: [Sanity image fields](https://www.sanity.io/docs/studio/image-type), [validation](https://www.sanity.io/docs/studio/validation), [Studio configuration](https://www.sanity.io/docs/studio/configuration).

Dependency overrides in package.json pin patched transitive CLI dependencies for YAML/TOML parsing, archive extraction and UUID generation. Revisit these when upgrading Sanity; do not remove them without running npm audit and rebuilding Studio.
