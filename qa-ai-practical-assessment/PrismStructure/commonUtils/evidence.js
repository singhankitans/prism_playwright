const fs = require("fs");
const path = require("path");

const EVIDENCE_DIR = path.join(__dirname, "../execution-reports/evidence");

function ensureEvidenceDir() {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.mkdirSync(path.join(EVIDENCE_DIR, "UI"), { recursive: true });
  fs.mkdirSync(path.join(EVIDENCE_DIR, "API"), { recursive: true });
}

function safeName(title) {
  return title
    .replace(/@\w+/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 100);
}

/**
 * Save a full-page screenshot for a passed (or finished) test.
 * For API tests without a meaningful UI, render a result card then capture it.
 */
async function saveScreenshotEvidence(page, testInfo, opts = {}) {
  ensureEvidenceDir();
  const folder = opts.tier === "API" ? "API" : "UI";
  const file = path.join(
    EVIDENCE_DIR,
    folder,
    `${safeName(testInfo.title)}_${testInfo.status || "done"}.png`
  );

  if (opts.renderCard) {
    const payloadHtml = opts.payload
      ? `<pre style="text-align:left;background:#111;color:#9f9;padding:12px;border-radius:8px;overflow:auto;max-width:900px">${JSON.stringify(
          opts.payload,
          null,
          2
        )}</pre>`
      : "";
    await page.setContent(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>${testInfo.title}</title></head>
<body style="font-family:Segoe UI,Arial,sans-serif;background:#0b1220;color:#e8eefc;padding:32px">
  <h1 style="margin:0 0 8px">✓ ${testInfo.title}</h1>
  <p style="opacity:.85">Status: <strong>${(testInfo.status || "passed").toUpperCase()}</strong> · Tier: ${folder}</p>
  ${payloadHtml}
</body>
</html>`);
  }

  await page.screenshot({ path: file, fullPage: true });
  await testInfo.attach(`${folder}-evidence`, {
    path: file,
    contentType: "image/png",
  });
  return file;
}

module.exports = { saveScreenshotEvidence, EVIDENCE_DIR, ensureEvidenceDir, safeName };
