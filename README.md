# joshbcohn.com

This is the code for my personal site, which is mostly my portfolio: who I am, what I've worked on, and links out to the projects I've built. It also has a page for my poetry.

Live at https://joshbcohn.com

## What's on the site

The site is a single page React app with client side routing. The routes are defined in `src/App.jsx`.

| Route | What it is |
| --- | --- |
| `/` | Homepage |
| `/projects` | Full list of projects |
| `/poetry` | My poems |
| `/NHLMock` | An NHL draft lottery and mock draft simulator (not linked in the nav) |
| anything else | 404 page with links back to home and projects |

### Homepage

The homepage is a stack of sections, in this order:

- **Hero**: short intro, an experience list, what I'm focused on, and buttons for the projects page and my resume (`/resume.pdf`)
- **Selected work**: two featured projects with a link to the full projects page
- **About**: background and a technical skills list
- **What I'm looking for next**: where I'm headed and what I care about in the work
- **Beyond Tech**: sports, volunteering, the outdoors, cooking, Catan, and poetry
- **Contact**: email, GitHub, and LinkedIn

The header links to each section, plus Projects, Poetry, and my GitHub.

### Projects page

`/projects` lists every project as a card with a type, a description, tech tags, and a link to the live version when there is one.

### Poetry page

`/poetry` loads the poems from text files and lists them by title. You can:

- search by title or by the text of the poem
- sort A to Z, Z to A, newest, or oldest
- click a poem to open it in a full screen modal (Escape or clicking outside closes it)
- share a poem with the Share button in the modal

Opening a poem puts a `poem` query parameter in the URL, like `/poetry?poem=the-one`, where the value is a slug made from the title. Visiting a link like that opens the poem directly. The Share button copies that link to the clipboard, or opens the native share sheet on iOS.

Some poems have a dedication, which shows up as a small info icon in the list and as a line under the title in the modal.

### NHL mock draft page

`/NHLMock` is a version of my NHL draft lottery simulator that lives in this repo. It runs the lottery draw ball by ball, has a lookup for the full combination table, then moves into a mock draft with prospect search and position filters. Results can be copied or printed. It reads its data from two CSV files in `public/mock/`. The version I actually link to from the site is the standalone one at nhlmock.joshbcohn.com.

## Where the projects live

The projects shown on the site are not in this repo. Each one has its own repo and is deployed separately on its own joshbcohn.com subdomain:

- https://nhlmock.joshbcohn.com
- https://casino.joshbcohn.com
- https://scheduler.joshbcohn.com
- https://autopick.joshbcohn.com
- https://weekly.joshbcohn.com
- https://wrapped.joshbcohn.com

The beehive capstone demo is the one exception to the subdomain pattern. It is also a separate deployment, but it is served under https://joshbcohn.com/projects/beehive through a rewrite in `vercel.json`.

## Tech stack

- React 18
- React Router 6 for routing
- Vite 7 with the SWC React plugin
- A mix of JSX and TSX files. There is no `tsconfig.json` and TypeScript is not installed, so Vite strips the types at build time and nothing type checks them.
- Plain CSS in `src/index.css`, plus inline styles in some components. Inter is loaded from Google Fonts.
- ESLint, configured for `.js` and `.jsx` files only
- Hosted on Vercel

## Project structure

```
index.html              Vite entry point
vercel.json             Redirects and rewrites for Vercel
vite.config.js          Vite config (dev server on 127.0.0.1)
eslint.config.js        ESLint config
public/
  resume.pdf            Resume linked from the hero
  jc.png                Favicon
  poems/                One text file per poem (poem1.txt, poem2.txt, ...)
  mock/                 CSV data for the /NHLMock page
src/
  main.jsx              React entry point
  App.jsx               Routes and the homepage layout
  index.css             Site wide styles and color variables
  components/           Header, footer, homepage sections, and the 404 page
  projects/             ProjectsPage.tsx, the /projects page
  poetry/               PoetryMain.tsx, the /poetry page
  lotto/                NHLMockAndLotto.tsx, the /NHLMock page
```

### Where to edit content

- **Projects page**: the `projects` array at the top of `src/projects/ProjectsPage.tsx`
- **Featured projects on the homepage**: the `featured` array in `src/components/Projects.tsx`. This is a separate list, so a project that appears in both needs to be updated in both places.
- **Poems**: add a new file to `public/poems/` using the next number, like `poem23.txt`. The first line is the title. An optional second line starting with `Dedication:` adds a dedication. Everything after that is the poem. The numbers have to be consecutive, because the page loads files in order and stops at the first one that is missing. Newest and oldest sorting goes by that number.
- **Homepage text**: each section is its own file in `src/components/` (`Hero.jsx`, `About.jsx`, `Values.jsx`, `Interests.jsx`, `Contact.jsx`)
- **Nav links**: `src/components/Header.jsx`
- **Resume**: replace `public/resume.pdf`
- **NHL mock data**: `public/mock/combos.csv` and `public/mock/prospects.csv`. The team lists and odds are hardcoded in `src/lotto/NHLMockAndLotto.tsx`.

### Leftovers

A few things in the repo are not part of the live site:

- `src/components/NFLPredictor.jsx` and the `backend/` folder are an old NFL play predictor experiment. The component is not routed anywhere and the backend is not deployed. This is also why `express`, `cors`, `body-parser`, and `axios` are in `package.json`.
- `dist/` is a committed build from an earlier version of the site. `npm run build` overwrites it.
- `src.zip` is an old snapshot of the `src` folder.

## Running it locally

You need Node.js and npm.

```
npm install
npm run dev
```

The dev server runs on `127.0.0.1` and Vite prints the URL when it starts.

Other scripts:

```
npm run build      Build to dist/
npm run preview    Serve the built site locally
npm run lint       Run ESLint
```

The `/projects/beehive` rewrite only exists on Vercel, so that link will not work locally.

## Environment variables and config

The site does not use any environment variables or API keys. There is no `.env` file and nothing to set up beyond `npm install`.

## Deployment

The site is hosted on Vercel. `vercel.json` does three things:

- redirects `/projects/beehive` to `/projects/beehive/`
- rewrites `/projects/beehive/` and everything under it to the separate beehive deployment
- rewrites every other path to `/index.html`, so React Router can handle routes like `/projects` and `/poetry` on a direct visit or a refresh

That last rewrite also matters for the poetry page. A request for a poem file that does not exist comes back as the HTML page, which is how the loader knows it has reached the end of the poems.

DNS note: the joshbcohn.com domain is registered through Squarespace, and each project subdomain is a CNAME record pointing to Vercel. None of that is configured in this repo.
