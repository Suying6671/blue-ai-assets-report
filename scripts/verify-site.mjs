import { readFileSync, existsSync } from "node:fs";

const sourceMarkdown =
  "3【汇报版】从个人经验到组织资产_蓝标AI能力资产化方案_副本.md";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "slides-cobalt-grid.html",
  ".nojekyll",
  ".gitignore",
  sourceMarkdown,
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing required file: ${file}`);
  }
}

if (existsSync("index.html")) {
  const html = readFileSync("index.html", "utf8");
  if (!html.includes("app.js")) {
    failures.push("index.html must load app.js");
  }
  if (!html.includes("styles.css")) {
    failures.push("index.html must load styles.css");
  }
  if (!html.includes("report-shell")) {
    failures.push("index.html must include the report shell");
  }
}

if (existsSync("app.js")) {
  const app = readFileSync("app.js", "utf8");
  if (!app.includes(sourceMarkdown)) {
    failures.push("app.js must fetch the requested Markdown source");
  }
  if (!app.includes("marked.parse")) {
    failures.push("app.js must render Markdown through marked");
  }
  if (!app.includes("cacheBust")) {
    failures.push("app.js must bypass stale browser caches on refresh");
  }
  if (!app.includes("trimLeadingTitles")) {
    failures.push("app.js must remove duplicate leading Markdown titles");
  }
}

if (existsSync(".gitignore")) {
  const gitignore = readFileSync(".gitignore", "utf8");
  for (const file of ["index.html", "styles.css", "app.js", sourceMarkdown]) {
    if (!gitignore.includes(`!${file}`)) {
      failures.push(`.gitignore must explicitly allow ${file}`);
    }
  }
  if (!gitignore.includes("!slides-cobalt-grid.html")) {
    failures.push(".gitignore must explicitly allow slides-cobalt-grid.html");
  }
}

if (existsSync("slides-cobalt-grid.html")) {
  const slides = readFileSync("slides-cobalt-grid.html", "utf8");
  for (const text of [
    "Cobalt Grid",
    "deck-stage",
    "width: 1920px",
    "height: 1080px",
    "class SlidePresentation",
  ]) {
    if (!slides.includes(text)) {
      failures.push(`slides-cobalt-grid.html must include ${text}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Site verification passed.");
