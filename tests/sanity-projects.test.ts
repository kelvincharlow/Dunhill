import assert from "node:assert/strict";
import test from "node:test";
import { sanityPhoto, sanityProject, featuredProjects } from "../src/lib/project-content";
import { portfolioState } from "../src/lib/portfolio";
import { getProjects, getProject, projectsQuery } from "../src/lib/sanity-projects";

const photo = { asset: { _ref: "image-abcdef1234-2000x1500-jpg" }, alt: "Apartment courtyard", crop: { left: .1, right: .1, top: 0, bottom: .2 }, hotspot: { x: .7, y: .3 } };
const doc = { _id: "published-project", slug: { current: "new-courtyard" }, title: "New Courtyard", location: "Nairobi", category: "Residential", description: "A residential development with shared gardens.", coverImage: photo, gallery: [{ ...photo, caption: "The entrance", credit: "Dunhill" }], services: ["building", "joinery"], scope: ["Structure", "Joinery"], featured: true, completionYear: 2024 };

test("Sanity photographs retain crop, focal point, alt text and captions", () => {
  const image = sanityPhoto(photo, "x7trmz7f", "production")!;
  assert.equal(image.width, 1600);
  assert.equal(image.height, 1200);
  assert.equal(image.alt, photo.alt);
  assert.match(image.src, /^https:\/\/cdn.sanity.io\/images\/x7trmz7f\/production\//);
  assert.match(image.src, /rect=200,0,1600,1200/);
  const position = image.position!.split(" ").map(parseFloat);
  assert.ok(Math.abs(position[0] - 75) < .0001);
  assert.ok(Math.abs(position[1] - 37.5) < .0001);
  assert.equal(sanityPhoto({ ...photo, alt: " " }, "x7trmz7f", "production"), undefined);
  assert.equal(sanityPhoto({ ...photo, asset: { _ref: "bad" } }, "x7trmz7f", "production"), undefined);
});

test("published projects map details and reject unsafe/incomplete documents", () => {
  const project = sanityProject(doc, "x7trmz7f", "production")!;
  assert.equal(project.service, "building");
  assert.deepEqual(project.services, ["building", "joinery"]);
  assert.equal(project.gallery?.[0].caption, "The entrance");
  assert.equal(project.completionYear, 2024);
  assert.equal(project.year, "");
  for (const changes of [{ _id: "drafts.project" }, { _id: "versions.release.project" }, { slug: { current: "../contact" } }, { services: ["unknown"] }, { coverImage: null }, { category: "All projects" }]) {
    assert.equal(sanityProject({ ...doc, ...changes }, "x7trmz7f", "production"), undefined);
  }
});

test("featured selection and category return links use CMS records", () => {
  const project = sanityProject(doc, "x7trmz7f", "production")!;
  const another = { ...project, slug: "another", featured: false, category: "Villas & townhouses" };
  assert.deepEqual(featuredProjects([another, project]).map(p => p.slug), [project.slug]);
  assert.deepEqual(featuredProjects([another]).map(p => p.slug), [another.slug]);
  const state = portfolioState("Villas & townhouses", [project, another]);
  assert.deepEqual(state.visible.map(p => p.slug), ["another"]);
  assert.equal(new URL(state.href, "https://example.com").searchParams.get("category"), "Villas & townhouses");
  assert.equal(portfolioState("invalid", [project, another]).visible.length, 2);
});

test("queries exclude drafts, support empty states, new slugs and CMS authority", async () => {
  const originalFetch = globalThis.fetch;
  const originalId = process.env.SANITY_STUDIO_PROJECT_ID;
  const originalDataset = process.env.SANITY_STUDIO_DATASET;
  process.env.SANITY_STUDIO_PROJECT_ID = "x7trmz7f";
  process.env.SANITY_STUDIO_DATASET = "production";
  let result: unknown[] = [];
  globalThis.fetch = async (input, options) => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get("perspective"), "published");
    assert.equal(url.searchParams.get("query"), projectsQuery);
    assert.equal((options as { next: { revalidate: number } }).next.revalidate, 60);
    return Response.json({ result });
  };
  try {
    assert.equal((await getProjects()).filter(p => p.image).length, 0);
    result = [doc, { ...doc, _id: "duplicate" }];
    assert.deepEqual((await getProjects()).map(p => p.slug), ["new-courtyard"]);
    assert.equal((await getProject("new-courtyard"))?.title, doc.title);
    assert.equal(await getProject("crescent-pearl"), undefined);
    assert.equal(await getProject("national-park-villas"), undefined);
    assert.equal(await getProject("unknown-project"), undefined);
    assert.equal((await getProject("pms-warehousing"))?.slug, "pms-warehousing");
    result = [{ ...doc, slug: { current: "crescent-pearl" } }];
    assert.equal((await getProject("crescent-pearl"))?.title, doc.title);
    result = [];
    assert.equal(await getProject("crescent-pearl"), undefined);
    assert.deepEqual(featuredProjects(await getProjects()), []);
    result = [{ ...doc, coverImage: null }];
    assert.equal((await getProjects()).length, 0);
    globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
    const originalError = console.error;
    console.error = () => {};
    try { assert.equal((await getProjects()).filter(p => p.image).length, 0); }
    finally { console.error = originalError; }
  } finally {
    globalThis.fetch = originalFetch;
    if (originalId === undefined) delete process.env.SANITY_STUDIO_PROJECT_ID; else process.env.SANITY_STUDIO_PROJECT_ID = originalId;
    if (originalDataset === undefined) delete process.env.SANITY_STUDIO_DATASET; else process.env.SANITY_STUDIO_DATASET = originalDataset;
  }
});
