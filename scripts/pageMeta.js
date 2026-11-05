// vite plugin: after the build, writes one html file per page with that page's title, description
// and link-preview tags, plus sitemap.xml. link previews (slack, imessage, linkedin) don't run
// javascript, so they only see what is in the html file.
import fs from "node:fs";
import path from "node:path";
import { pageMeta, notFoundMeta, SITE_URL, OG_IMAGE } from "../src/data/meta.ts";
import { projects } from "../src/data/projects.ts";

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function headTags(meta, url) {
    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const image = SITE_URL + OG_IMAGE;
    const lines = [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="Josh Cohn" />`,
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
    ];
    if (url) {
        lines.push(`<meta property="og:url" content="${url}" />`);
        lines.push(`<link rel="canonical" href="${url}" />`);
    }
    return lines.map((line) => "    " + line).join("\n");
}

// full url for a page path, like https://joshbcohn.com/projects
function urlFor(page) {
    if (page === "/") {
        return SITE_URL + "/";
    }
    return SITE_URL + page;
}

// where a page's html file goes inside the build folder
function fileFor(page) {
    if (page === "/") {
        return "index.html";
    }
    return path.join(page.slice(1), "index.html");
}

// pages that get their own html file; hidden projects are left out
function sitePages() {
    const visible = new Set(["/", "/projects", "/poetry"]);
    for (const project of projects) {
        visible.add(`/projects/${project.slug}`);
    }
    return Object.keys(pageMeta).filter((page) => visible.has(page));
}

export default function pageMetaPlugin() {
    let outDir = "";

    return {
        name: "page-meta",
        apply: "build",

        configResolved(config) {
            outDir = path.resolve(config.root, config.build.outDir);
        },

        closeBundle() {
            const template = fs.readFileSync(path.join(outDir, "index.html"), "utf-8");
            const marker = /<!-- page-meta -->[\s\S]*?<!-- \/page-meta -->/;
            if (!marker.test(template)) {
                throw new Error("index.html is missing the <!-- page-meta --> block");
            }

            const pages = sitePages();
            for (const page of pages) {
                const html = template.replace(marker, headTags(pageMeta[page], urlFor(page)));
                const file = fileFor(page);
                fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true });
                fs.writeFileSync(path.join(outDir, file), html);
            }

            // 404.html for hosts that serve one; vercel's catch-all serves index.html instead,
            // and the page then sets its own title in the browser
            fs.writeFileSync(path.join(outDir, "404.html"), template.replace(marker, headTags(notFoundMeta, null)));

            const urls = pages.map((page) => `  <url><loc>${urlFor(page)}</loc></url>`);
            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
            fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
        },
    };
}
