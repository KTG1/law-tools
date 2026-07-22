import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
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
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});
