// vite plugin that turns public/poems/poem1.txt, poem2.txt, ... into /poems/index.json,
// so the homepage can load one small file instead of every poem.
// adding a poem is still just adding the next .txt file.
import fs from "node:fs";
import path from "node:path";
import { parsePoem } from "../src/poetry/parsePoem.ts";

// how many opening lines of each poem go into the index
const EXCERPT_LINES = 4;

function buildIndex(poemsDir) {
    const poems = [];
    let i = 1;

    // same rule as the Poetry page: read in order and stop at the first missing number
    while (fs.existsSync(path.join(poemsDir, `poem${i}.txt`))) {
        const text = fs.readFileSync(path.join(poemsDir, `poem${i}.txt`), "utf-8");
        const poem = parsePoem(text, i);
        const excerpt = poem.body
            .split("\n")
            .filter((line) => line.trim() !== "")
            .slice(0, EXCERPT_LINES);

        poems.push({
            index: poem.index,
            title: poem.title,
            slug: poem.slug,
            dedication: poem.dedication,
            featured: poem.featured,
            excerpt,
        });
        i += 1;
    }

    return { count: poems.length, poems };
}

export default function poemsIndex() {
    let poemsDir = "";

    return {
        name: "poems-index",

        configResolved(config) {
            poemsDir = path.join(config.publicDir, "poems");
        },

        // dev server: build the index fresh on every request
        configureServer(server) {
            server.middlewares.use("/poems/index.json", (req, res) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(buildIndex(poemsDir)));
            });
        },

        // production build: write the index next to the poem files
        generateBundle() {
            this.emitFile({
                type: "asset",
                fileName: "poems/index.json",
                source: JSON.stringify(buildIndex(poemsDir)),
            });
        },
    };
}
