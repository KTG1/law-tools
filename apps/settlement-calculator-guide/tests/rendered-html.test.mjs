import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the settlement calculator homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Settlement Calculator Guide/);
  assert.match(html, /Personal Injury Settlement Calculator/);
  assert.match(html, /Estimate your personal injury settlement range/);
  assert.match(html, /How a personal injury settlement estimate is calculated/);
  assert.match(html, /What factors affect a personal injury settlement value/);
  assert.match(html, /How to interpret your settlement estimate/);
  assert.match(html, /Frequently asked questions about settlement calculators/);
  assert.match(html, /Personal injury settlement calculators by state/);
  assert.match(html, /href="\/states\/california"/);
  assert.match(html, /href="\/states\/wyoming"/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("server-renders an indexable state settlement guide", async () => {
  const response = await render("/states/california");
  assert.equal(response.status, 200);

  const html = await response.text();
  const normalizedHtml = html.replaceAll(/<!--.*?-->/g, "");
  assert.match(normalizedHtml, /California Personal Injury Settlement Calculator/);
  assert.match(normalizedHtml, /What can affect a personal injury settlement in California/);
  assert.match(normalizedHtml, /California context, general formula/);
  assert.match(normalizedHtml, /Calculate a California personal injury settlement range/);
  assert.match(normalizedHtml, /GENERAL MODEL \/ CA/);
  assert.match(normalizedHtml, /does not apply California statutes/);
  assert.match(normalizedHtml, /for an auto collision claim in California/);
  assert.match(normalizedHtml, /Legal checks for a California settlement estimate/);
  assert.match(normalizedHtml, /Filing deadline/);
  assert.match(normalizedHtml, /Fault rules/);
  assert.match(normalizedHtml, /Which California filing deadline controls/);
  assert.match(normalizedHtml, /does not state the controlling law/);
  assert.match(html, /href="\/states\/alabama"/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});
