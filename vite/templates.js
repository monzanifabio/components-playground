const SITE_TITLE = "Components Playground";
export const THEME_STORAGE_KEY = "playground-theme";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function parseAttributes(source) {
  const attributes = {};
  for (const [, name, value] of source.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)) {
    attributes[name] = value;
  }
  return attributes;
}

/**
 * Turns each <demo title="" description="" layout="center|fill"> block into a
 * section with a heading and a bordered canvas. Attribute values are already
 * HTML, so they're inserted as written.
 */
function renderDemos(content) {
  const demos = [];
  const usedIds = new Set();

  const html = content
    .replace(/<demo\b([^>]*)>/g, (_, source) => {
      const { title = "Demo", description = "", layout = "center" } = parseAttributes(source);
      let id = slugify(title) || "demo";
      for (let i = 2; usedIds.has(id); i++) id = `${slugify(title)}-${i}`;
      usedIds.add(id);
      demos.push({ id, title });

      return `<section class="pg-demo" id="${id}" aria-labelledby="${id}-title">
        <header class="pg-demo__header">
          <h2 class="pg-demo__title" id="${id}-title"><a class="pg-demo__anchor" href="#${id}">${title}</a></h2>
          ${description ? `<p class="pg-demo__description">${description}</p>` : ""}
        </header>
        <div class="pg-demo__canvas pg-demo__canvas--${layout}">`;
    })
    .replace(/<\/demo>/g, "</div></section>");

  return { html, demos };
}

function renderDocument({ title, description, base, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${description ? `<meta name="description" content="${escapeHtml(description)}" />` : ""}
    <link rel="icon" type="image/svg+xml" href="${base}favicon.svg" />
    <script>
      document.documentElement.dataset.theme = localStorage.getItem("${THEME_STORAGE_KEY}") === "dark" ? "dark" : "light";
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="/src/page/page.css" />
  </head>
  <body class="pg-body">
    <a class="pg-skip-link" href="#main">Skip to content</a>
    <header class="pg-nav">
      <div class="pg-nav__inner">
        <a class="pg-nav__brand" href="${base}">${SITE_TITLE}</a>
        <button class="pg-theme-toggle" type="button" data-theme-toggle>Dark mode</button>
      </div>
    </header>
    <main class="pg-page" id="main">
      ${body}
    </main>
    <script type="module" src="/src/page/page.js"></script>
  </body>
</html>`;
}

export function renderHomePage({ content, components, base }) {
  const rows = components
    .map(
      (component) => `<tr>
        <th scope="row"><a class="pg-index__link" href="${base}components/${component.slug}/">${escapeHtml(component.title)}</a></th>
        <td>${escapeHtml(component.description ?? "")}</td>
        <td class="pg-index__count">${component.demoCount}</td>
      </tr>`,
    )
    .join("");

  return renderDocument({
    title: SITE_TITLE,
    base,
    body: `
      <header class="pg-page__header">
        <h1 class="pg-page__title">${SITE_TITLE}</h1>
        <div class="pg-page__description">${content}</div>
      </header>
      <section class="pg-index" aria-labelledby="pg-index-title">
        <h2 class="pg-index__title" id="pg-index-title">Components <span class="pg-index__total">${components.length}</span></h2>
        <div class="pg-index__wrapper">
          <table class="pg-index__table">
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Description</th>
                <th scope="col" class="pg-index__count">Demos</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`,
  });
}

export function renderComponentPage({ content, component, base }) {
  const { html, demos } = renderDemos(content);
  const title = escapeHtml(component.title);
  const jumpLinks =
    demos.length > 1
      ? `<nav class="pg-toc" aria-label="Demos on this page">
          <ul class="pg-toc__list">${demos.map((demo) => `<li><a class="pg-toc__link" href="#${demo.id}">${demo.title}</a></li>`).join("")}</ul>
        </nav>`
      : "";

  return renderDocument({
    title: `${title} — ${SITE_TITLE}`,
    description: component.description,
    base,
    body: `
      <header class="pg-page__header">
        <nav class="pg-breadcrumb" aria-label="Breadcrumb">
          <ol class="pg-breadcrumb__list">
            <li><a class="pg-breadcrumb__link" href="${base}">Components</a></li>
            <li aria-current="page">${title}</li>
          </ol>
        </nav>
        <h1 class="pg-page__title">${title}</h1>
        ${component.description ? `<p class="pg-page__description">${escapeHtml(component.description)}</p>` : ""}
        ${jumpLinks}
      </header>
      <div class="pg-demos">${html}</div>`,
  });
}
