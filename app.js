const sourceMarkdown =
  "3【汇报版】从个人经验到组织资产_蓝标AI能力资产化方案_副本.md";

const content = document.querySelector("#content");
const toc = document.querySelector("#toc");

marked.use({
  gfm: true,
  breaks: false,
});

function makeHeadingId(text, index) {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

  return normalized ? `${normalized}-${index}` : `section-${index}`;
}

function buildToc() {
  const headings = [...content.querySelectorAll("h1, h2, h3")];
  toc.replaceChildren();

  headings.forEach((heading, index) => {
    const text = heading.textContent.trim();
    const depth = heading.tagName.replace("H", "");
    heading.id = makeHeadingId(text, index + 1);

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = text;
    link.dataset.depth = depth;
    toc.appendChild(link);
  });
}

function trimLeadingTitles() {
  const children = [...content.children];

  for (const element of children) {
    if (element.tagName === "H1") {
      element.remove();
      continue;
    }

    break;
  }
}

async function renderReport() {
  try {
    const cacheBust = Date.now();
    const response = await fetch(`${encodeURI(sourceMarkdown)}?v=${cacheBust}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();
    const dirtyHtml = marked.parse(markdown);
    content.innerHTML = DOMPurify.sanitize(dirtyHtml);
    trimLeadingTitles();
    buildToc();
  } catch (error) {
    content.innerHTML = `<p class="error">内容加载失败：${error.message}</p>`;
  }
}

renderReport();
