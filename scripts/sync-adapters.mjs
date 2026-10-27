#!/usr/bin/env node
// PROMPT_SHORT.md(원본) → 도구별 파일(adapters/)을 다시 만든다.
// 사용: node scripts/sync-adapters.mjs          다시 만들기
//       node scripts/sync-adapters.mjs --check  어긋났는지만 확인(어긋나면 종료 코드 1)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(resolve(root, "PROMPT_SHORT.md"), "utf8");
const [, ...rest] = src.split("\n");
const body = rest.join("\n"); // 첫 줄(제목) 뒤 전부

const targets = {
  "adapters/claude-global/CLAUDE.md": `# 범용 풀스택 원칙\n${body}`,
  "adapters/copilot/.github/copilot-instructions.md": `# 범용 풀스택 원칙\n${body}`,
  "adapters/cursor/.cursor/rules/fullstack.mdc":
    "---\ndescription: 범용 풀스택 원칙(캐시·보안·DB·외부 API·비용·봇·SEO·배포)\nalwaysApply: true\n---\n" + body,
};

const check = process.argv.includes("--check");
let stale = 0;
for (const [rel, text] of Object.entries(targets)) {
  const p = resolve(root, rel);
  let cur = "";
  try { cur = readFileSync(p, "utf8"); } catch {}
  if (cur === text) { console.log(`  같음   ${rel}`); continue; }
  stale++;
  if (check) { console.log(`  다름   ${rel}`); continue; }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text);
  console.log(`  갱신   ${rel}`);
}
if (check && stale) { console.log(`\n${stale}개 파일이 PROMPT_SHORT.md와 다릅니다. node scripts/sync-adapters.mjs 를 실행하세요.`); process.exit(1); }
