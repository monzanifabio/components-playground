# Components Playground

One Vite project with a page per UI component. The home page lists every component and links to it.

```bash
npm install
npm run dev
```

`@krakentech/tako-html` is private: set `NPM_TOKEN` (see `.npmrc`) before `npm install`.

## Adding a component

Create a folder in `components/` with these files:

```
components/my-component/
  meta.json    title and description, shown on the home page and the page header
  index.html   the demos (an HTML fragment, not a full page)
  main.js      the component's script; import its CSS from here
```

`meta.json`:

```json
{
  "title": "My component",
  "description": "One sentence on what it is."
}
```

`index.html` is a list of `<demo>` blocks plus a script tag:

```html
<demo title="Default" description="What this demo shows.">
  <!-- component markup -->
</demo>

<demo title="Wide variant" layout="fill">
  <!-- ... -->
</demo>

<script type="module" src="./main.js"></script>
```

The folder is picked up automatically, in dev and in the build.

## The page template

`vite/playground.js` wraps every `components/*/index.html` in the template from `vite/templates.js`, so all pages get the same structure:

- top nav with the site name and the theme toggle
- breadcrumb, title and description from `meta.json`
- jump links when the page has more than one demo
- each `<demo>` as a section with a heading, description and bordered canvas

`<demo>` attributes:

| Attribute     | Description                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| `title`       | Section heading. Also used for the section's anchor link.                                    |
| `description` | Optional line under the heading.                                                             |
| `layout`      | `center` (default) centres the component, `fill` uses the full width, `bleed` has no padding. |

Template styles live in `src/page/page.css`. Their classes start with `pg-` so they don't clash with component CSS.

### Theme

The template sets `data-theme="light"` or `"dark"` on `<html>` and keeps the choice in `localStorage` for every page. Write dark styles under `:root[data-theme="dark"]`. Components that paint with JavaScript (e.g. charts) can listen for the `themechange` event on `document`.

The shared tokens (`--foreground-primary`, `--surface-primary`, `--border-subtle`, `--focus-ring`, `--font-sans`, …) are defined in `src/page/page.css`.

### Full-page components

An HTML file that starts with `<!doctype html>` isn't templated. `components/layout/` uses this: `frame.html` is a standalone app shell, and `index.html` shows it in an iframe.

### Assets

Files in `public/` are served from the site root. In JavaScript, build their URLs from `import.meta.env.BASE_URL` so they still work when the site is deployed under a sub-path (GitHub Pages).

## Deploying

`.github/workflows/deploy-pages.yml` builds and deploys to GitHub Pages on every push to `main`. The repository needs an `NPM_TOKEN` secret for the private Tako package.

## Table component

See [components/table/README.md](components/table/README.md) for the custom table classes.
