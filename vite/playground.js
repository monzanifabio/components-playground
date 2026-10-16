import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { renderComponentPage, renderHomePage } from "./templates.js";

const COMPONENTS_DIR = "components";

/**
 * Every folder in components/ with a meta.json is a component page.
 * Its index.html is an HTML fragment of <demo> blocks; the plugin wraps it in
 * the shared page template. Files that start with <!doctype> are left alone.
 */
export default function playground() {
  let root;
  let base = "/";

  const componentsPath = () => resolve(root, COMPONENTS_DIR);

  function readComponent(slug) {
    const dir = join(componentsPath(), slug);
    const meta = JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"));
    const html = readFileSync(join(dir, "index.html"), "utf8");
    return { slug, ...meta, demoCount: (html.match(/<demo\b/g) ?? []).length };
  }

  function listComponents() {
    return readdirSync(componentsPath(), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(componentsPath(), entry.name, "meta.json")))
      .map((entry) => readComponent(entry.name))
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  function listHtmlEntries() {
    const entries = { main: resolve(root, "index.html") };
    for (const entry of readdirSync(componentsPath(), { recursive: true })) {
      if (entry.endsWith(".html")) {
        entries[entry.replace(/\.html$/, "").split(sep).join("/")] = join(componentsPath(), entry);
      }
    }
    return entries;
  }

  return {
    name: "playground",

    config(config) {
      root = resolve(config.root ?? process.cwd());
      return { build: { rolldownOptions: { input: listHtmlEntries() } } };
    },

    configResolved(config) {
      base = config.base;
    },

    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        if (/^\s*<!doctype/i.test(html)) return html;

        const relativePath = relative(root, ctx.filename).split(sep).join("/");
        if (relativePath === "index.html") {
          return renderHomePage({ content: html, components: listComponents(), base });
        }

        const match = relativePath.match(new RegExp(`^${COMPONENTS_DIR}/([^/]+)/index\\.html$`));
        if (match) {
          return renderComponentPage({ content: html, component: readComponent(match[1]), base });
        }

        return html;
      },
    },

    configureServer(server) {
      // meta.json isn't part of the module graph, so reload pages by hand when it changes.
      server.watcher.on("all", (event, file) => {
        if (file.startsWith(componentsPath()) && (file.endsWith("meta.json") || event === "addDir" || event === "unlinkDir")) {
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}
