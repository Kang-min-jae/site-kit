#!/usr/bin/env node
// 완성본 예시 빌드 — examples/<이름>/main.tsx + app.css를 묶어 정적 페이지로 만든다.
// 사용: node scripts/build-example.mjs house-restaurant
// 결과: dist/examples/<이름>/index.html + stills/ + fonts/
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { cpSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2] ?? "house-restaurant";
const src = resolve(root, "examples", name);
const out = resolve(root, "dist/examples", name);
rmSync(out, { recursive: true, force: true });
mkdirSync(resolve(out, "fonts"), { recursive: true });
mkdirSync(resolve(root, ".tmp"), { recursive: true });

// 디렉션별 글꼴 (모두 SIL OFL 1.1, Google Fonts에서 불러옴)
const FONTS = {
  "house-restaurant": "family=Cormorant+Garamond:wght@500;600&family=Inter+Tight:wght@400..600&family=Noto+Serif+KR:wght@500;600",
};
const ATTRS = { "house-restaurant": 'data-preset="calm" data-direction="house" data-mode="light"' };
const TITLE = { "house-restaurant": "여울 YEOUL — 완성본 예시 (house)" };

const cssPath = resolve(out, "app.css");
execFileSync(resolve(root, "node_modules/.bin/tailwindcss"), ["-i", resolve(src, "app.css"), "-o", cssPath, "--minify"], { stdio: "inherit" });
const css = readFileSync(cssPath, "utf8");
rmSync(cssPath);

const reactGlobals = {
  name: "react-globals",
  setup(b) {
    b.onResolve({ filter: /^react(-dom\/client|-dom)?$/ }, (a) => ({ path: a.path, namespace: "g" }));
    b.onLoad({ filter: /.*/, namespace: "g" }, (a) => ({
      contents: a.path === "react" ? "module.exports = window.React" : "module.exports = window.ReactDOM",
      loader: "js",
    }));
  },
};
const shim = resolve(root, ".tmp/react-shim.js");
writeFileSync(shim, "export const React = window.React;\n");
const js = await build({
  entryPoints: [resolve(src, "main.tsx")],
  bundle: true, write: false, format: "iife", minify: true, target: "es2020",
  tsconfigRaw: { compilerOptions: { jsx: "react" } },
  jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
  inject: [shim], define: { "process.env.NODE_ENV": '"production"' }, plugins: [reactGlobals], charset: "utf8",
});
const bundle = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

copyFileSync(resolve(root, "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"), resolve(out, "fonts/PretendardVariable.woff2"));
// 글꼴 파일을 함께 배포하므로 OFL 1.1 라이선스 전문을 옆에 둔다 (OFL 조건)
const ofl = readFileSync(resolve(root, "node_modules/@fontsource/noto-serif-kr/LICENSE"), "utf8").replace(/^[\s\S]*?(This Font Software is licensed)/, "$1");
writeFileSync(resolve(out, "fonts/LICENSE-Pretendard.txt"), `Pretendard — https://github.com/orioncactus/pretendard\nCopyright (c) The Pretendard Project Authors.\n\n${ofl}`);
if (existsSync(resolve(src, "public"))) cpSync(resolve(src, "public"), out, { recursive: true });

const REACT = "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js";
const REACT_DOM = "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js";
const page = `<!DOCTYPE html>
<html lang="ko" ${ATTRS[name] ?? 'data-preset="calm" data-mode="light"'}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE[name] ?? name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${FONTS[name] ?? ""}&display=swap">
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script src="${REACT}"></script>
<script src="${REACT_DOM}"></script>
<script>${bundle}</script>
</body>
</html>
`;
writeFileSync(resolve(out, "index.html"), page);
console.log(`dist/examples/${name}/index.html ${(Buffer.byteLength(page) / 1024).toFixed(0)}KB`);
