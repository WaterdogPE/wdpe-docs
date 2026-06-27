# WaterdogPE Documentation

The documentation site for [WaterdogPE](https://github.com/WaterdogPE) — a fast,
customizable proxy for Minecraft: Bedrock Edition. Built with
[VitePress](https://vitepress.dev/). **All content is plain Markdown** — you do
not need to know how to code to contribute.

## Editing or adding a page

Everything under `docs/` is the site content. Each book has its own folder
(e.g. `docs/waterdogpe-setup/`, `docs/plugins/`, `docs/stargate-plugins/`), and
every page is one `.md` file inside it.

**To edit a page**, open its `.md` file and change the text. Each page is normal
Markdown (headings, lists, code blocks, images).

**To add a new page:**

1. Create a new `.md` file inside the relevant book folder, e.g.
   `docs/plugins/my-new-page.md`.
2. Add a link to it in the `sidebar` array inside
   [`docs/.vitepress/config.js`](docs/.vitepress/config.js), under the matching
   book section:
   ```js
   { text: 'My New Page', link: '/plugins/my-new-page' }
   ```
3. Open a pull request. That's it.

**To add a whole new book**, create a new folder under `docs/`, add its pages,
then add a new section to the `sidebar` array (and optionally an entry to `nav`).

**To add an image**, drop the file into `docs/public/img/` and reference it as
`![alt](/img/your-image.png)`.

## Running locally (optional)

Requires Node.js 20+.

```bash
npm install
npm run docs:dev       # live preview at http://localhost:5173
npm run docs:build     # production build into docs/.vitepress/dist
npm run docs:preview   # serve the production build locally
```

## Deployment

On every push to `master`, a GitHub Action builds the site and publishes a Docker
image (nginx serving the static output) to
`ghcr.io/WaterdogPE/docs-website:latest`.
