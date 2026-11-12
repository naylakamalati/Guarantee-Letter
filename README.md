# AirNav Guarantee Letter Generator

A browser-based tool for preparing and previewing A4 hotel guarantee letters. The interface is in Indonesian and includes guest rows, Excel paste, recipient and room settings, templates, local history, PDF export, and printing.

## Privacy

- Letter drafts, templates, history, and uploaded images are stored in the user's browser; the app has no application server or environment variables.
- Do not enter real guest details into a public demo.
- The starter letter uses clearly fictional guest and signatory placeholders, not real people.
- The official stamp and signature image files are intentionally excluded from Git and deployment. Users should upload only assets they are authorized to use. Uploads are processed in the browser.
- The app loads Inter and Tinos fonts from Google Fonts.

## Requirements

- Node.js 20 or newer
- npm

## Local development

```sh
npm ci
npm test
npm run build
npm run dev
```

Vite serves the development app at `http://localhost:3000`. No environment variables are required.

## Production build

`npm run build` type-checks the TypeScript source and builds the static site into `dist/`. `npm run preview` serves that build locally.

PDF export renders each A4 page in the browser with `html2canvas` and `jsPDF`. Printing uses the browser print dialog and the app's A4 print stylesheet. Both operations use the current browser data and do not send letter contents to an application server.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, import that repository and select the Vite project.
3. Use the settings in `vercel.json`: build command `npm run build`, output directory `dist`.
4. No environment variables are required.
5. After deployment, test editing a draft, uploading an authorized asset, PDF download, and browser printing.

`.gitignore` excludes build output, dependencies, local environment files, generated PDFs, and the stamp/signature assets.

## Project layout

```text
public/       Static public assets
src/
  components/ React UI components
  config/     Starter data and selection lists
  lib/        PDF, storage, formatting, and validation helpers
    __tests__/ Unit tests
```

`DESIGN.md` documents the visual and document layout conventions.
