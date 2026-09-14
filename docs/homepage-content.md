# Homepage content and publication notes

The homepage is a visual introduction with direct routes to About, Services, Projects, Plant & Workshops, Compliance and Contact. Its sequence is hero, company highlights, two photographic project cards, six service links, company/resources, selected clients and an enquiry call to action. Internal header links use Next.js navigation; the active item identifies the page, including when scrolling the homepage.

## Homepage refresh — September 2026

Reviewed the supplied `../Dunhill profile 2026.pdf` directly. History and NCA category come from pages 8–9; workshop scope from page 17; values from page 14; selected clients from pages 19–30; Crescent Pearl and National Park Villas from pages 28 and 23. The NCA highlight remains explicitly attributed to the profile and links to requests for current licences.

Project cards use the shared portfolio records and open project detail pages. Only the two existing project photographs with established associations are featured; the ambiguous Nyahururu image is omitted. The industrial photograph is labelled as construction-site context. Client names are text, not logos or testimonials. Detailed company, service, equipment and compliance information stays on the respective inner pages. No staff, asset or completion totals were added.

## About page

The About page has a distinct photographic opening with overlaid typography, followed by a centered introduction and an asymmetric construction/finished-project photo story. Founding and incorporation dates sit beside the images. Values use large open rows, leadership uses a simple directory, and the resources feature overlays a light panel on site photography. The former split hero, timeline, shortcut strip, numbered section bars and leadership cards were removed after visual feedback. Names and roles retain their 2026 profile attribution; no portraits or biographies were invented. Sources: history pages 8–9, leadership page 11, mission and values pages 13–14, workshop location/scope pages 9 and 17, National Park Villas page 23. Enquiry links open `/contact`.

- History and timeline: profile pages 8–9 and project records on pages 19–20. Project years describe profile records, not independently verified completion dates.
- Mission, vision and values: lightly edited for clarity from pages 13–14.
- Leadership names and titles follow the organizational chart on page 11; confirm current roles before publication. No invented biographies or portraits.
- Client and consulting relationships: project records on pages 19–20. Confirm approved public names and current relationships before publication.

## Sources

Plant & Workshops is available at /plant-workshops. Equipment categories use the previously extracted profile pages 15–18; workshop capabilities use page 17. Quantities and current availability are deliberately not asserted. Images industrial-03, industrial-01 and industrial-04 show construction-site context, not workshop interiors. Approved timber and metal workshop photographs remain outstanding. Delivery-support explanations are editorial descriptions, not guarantees or equipment-hire offers.

Company information and images come from the supplied Dunhill profile 2026 PDF.

- History: operating since 1983, incorporated in 1997 (pages 8–9).
- Core values: trust, integrity, collaboration (pages 13–14).
- Workshop scope: timber joinery and metal fabrication (page 17).
- Projects: National Park Villas (page 23), Crescent Pearl and Nyahururu housing (page 28).
- Address and provisional email: pages 2 and 9.
- NCA 1: stated in the company summary; current practising licence needs confirmation.

## Services refresh

The six service choices appear immediately below the introduction. Native disclosure panels show concise scope lists and evidence, with one service open at a time. Incoming service hashes open and scroll to the correct panel; selecting a closed panel with the same hash reopens it. All six existing homepage service anchors are preserved.

Building, civil and industrial services link to their relevant portfolio records. Refurbishment evidence now references the Nairobi Gymkhana Club entry on profile page 29. Workshop scope follows page 17. The photograph shows industrial construction context and is not presented as a photograph of every service.

Service enquiry links lead to `/contact?service=…#enquiry`. The contact page accepts only known service interests and preselects the field; absent, invalid or repeated parameters leave the choice empty. The existing enquiry delivery/email-draft behavior is unchanged. `scripts/review-services.mjs` checks six viewport widths, disclosure deep links, same-hash reopening, service-to-form navigation and destination responses without submitting enquiries.

## Portfolio refresh

The Projects listing uses a single photo-and-name grid with the two confirmed project photographs. Search and the archive rows have been removed. All category filters remain; counts reflect the visual portfolio, and categories without displayed projects offer a return to all projects. Category context is retained in detail and return links. Invalid categories fall back to all projects; obsolete search parameters are ignored. Source records without photographs remain available through existing service/detail links, but are excluded from the grid and its previous/next navigation. Sanity integration is deferred.

Detail pages present the scope and project facts, preserve source/year caveats, and link to the related service and preselected contact enquiry. Records without photographs use a compact overview. No additional project photos, completion dates, client endorsements or project claims were invented. The Projects listing reads query parameters on the server; individual project detail pages remain statically generated with client navigation controls behind Suspense boundaries.

`review-portfolio.mjs` checks listing and both detail variants at six widths, category counts, empty categories, removal of search, return context, next-project navigation, enquiry preselection and detail-page destinations.

## Plant & Workshops refresh

The page now opens with direct choices for equipment, timber joinery and metal fabrication. A concise equipment inventory sits beside optimized construction-site photography. Workshop panels use decorative line illustrations of a door and steel frame, rather than images presented as actual workshop interiors. Location and capabilities follow profile pages 9 and 15–18. Existing `#equipment`, `#workshops`, `#delivery` and `#contact` anchors remain available.

Workshop service links open the corresponding Services disclosure; enquiry links preselect Plant & workshops, Timber joinery or Metal & structural fabrication. Scope, location and timing prompts replace the repetitive delivery section. No equipment quantities, current availability, hire service or workshop-photo claims were added. `review-plant.mjs` checks six widths, image/anchor validity, destinations, service disclosure links and contact preselection without submitting enquiries.

## Compliance refresh

Seven existing document request categories are presented as a grouped checklist, with select-all/clear controls and a live selection summary. Requests continue to Contact with Compliance documents selected and a generated list of chosen documents in the editable message. Only known document IDs are accepted; duplicate/unknown IDs are discarded and document prefilling applies only to compliance enquiries. A general request can continue without selected documents. No requests are submitted from the Compliance page.

A short availability note replaces repeated unknown-date/status grids and internal publication-process content. No certificates, IDs, verified validity dates or download links were published. The document-selection form supports a native GET navigation fallback; keyboard selection, six viewport widths, select-all/clear, request composition and parameter handling are covered in `review-compliance.mjs` without submitting enquiries.

## Contact refresh

Contact now pairs the enquiry form with direct phone/email links and an office photo/address panel. Mobile places the form before the office details, while quick contact links remain near the top. The required enquiry fields appear first; company, phone, location and budget are available in a native optional-details disclosure. Existing service and compliance document prefills remain supported.

The email-draft mode explains that visitors must review and send from their email app. Editing a prepared enquiry clears its stale draft/status. Submission validation, consent, delivery handling and all optional payload fields remain intact. No webhook configuration was changed. The contact review intercepts any delivery requests in the browser and checks layouts, invalid/empty input, optional details, prefills, draft contents and stale-draft clearing without sending enquiries.

## Before publication

- Compliance now has a dedicated /compliance route with seven document request entries. No certificates, dates, registration IDs or current validity claims are published. No document viewer or download is enabled until verified current copies and public-sharing approval are supplied. Request links open email drafts; no verification backend or automatic expiry monitor has been implemented. Publishing documents will require checking issuer records, dates, redactions, approval, and ongoing expiry/removal handling; do not upload unapproved files to public/.

- Services and Projects are now dedicated routes, including eight project detail routes. Project content reuses previously extracted profile records; the original PDF was no longer present at its supplied Downloads path during this iteration.
- Projects without confirmed photography are excluded from the visual listing. PMS warehousing has no year in the extracted record. Commercial classification for this warehousing entry is an editorial grouping, to be approved.
- Services uses documented examples for building, civil and industrial work. Refurbishment, joinery and fabrication request relevant examples instead of inventing project associations.

- Replace the interim geometric mark with the official logo.
- Replace extracted photographs with original, approved files.
- Confirm image-to-project associations, project years and current status. Years are profile years, not completion claims.
- The previous homepage labelled an apartment rendering as Nyahururu; this version uses the profile's construction image. Confirm the association before release.
- Confirm info@dunhillbcon.com is the intended general enquiry inbox.
- Confirm licence validity and approve publicly shared certificates.
- Client names are text treatments, not official client logos.

## Design and review

Light neutral backgrounds, dark green-charcoal text, soft sage accents and blue focus indicators form a proposed direction pending brand approval.

Manrope is the primary font; Cormorant Garamond supports selected italic phrases. Fonts are self-hosted through Next.js.

Screenshots and browser results are in artifacts/. Reviewed at 1440px, 768px, 390px and 320px. No horizontal overflow or broken images was detected. The former project dialog and capability accordion have been replaced by direct page links. Current homepage browser checks cover responsive layout, images, destination links and mobile navigation.
