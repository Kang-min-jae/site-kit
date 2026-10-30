#!/usr/bin/env node
// 시안용 정물 렌더 실행기: scene.ts를 묶어 헤드리스 Chromium에서 그린 뒤 PNG로 저장한다.
// 사용: node scripts/render-stills/render.mjs [출력 폴더] [샷 이름...]
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(process.argv[2] ?? resolve(root, ".tmp/stills"));
const shots = process.argv.slice(3).length ? process.argv.slice(3) : ["hero", "soup", "main", "dessert", "glass"];
mkdirSync(out, { recursive: true });

const js = await build({ entryPoints: [resolve(here, "scene.ts")], bundle: true, write: false, format: "iife", target: "es2020" });
const html = resolve(root, ".tmp/render.html");
mkdirSync(dirname(html), { recursive: true });
writeFileSync(html, `<!doctype html><body style="margin:0"><script>${js.outputFiles[0].text}</script>`);

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = await import("playwright")); }
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const s of shots) {
  const page = await browser.newPage();
  page.on("console", (m) => m.type() === "error" && console.error(m.text()));
  await page.goto("file://" + html);
  const t = Date.now();
  const url = await page.evaluate((n) => window.renderShot(n), s);
  writeFileSync(resolve(out, `${s}.png`), Buffer.from(url.split(",")[1], "base64"));
  console.log(`${s}.png ${((Date.now() - t) / 1000).toFixed(1)}s`);
  await page.close();
}
await browser.close();
