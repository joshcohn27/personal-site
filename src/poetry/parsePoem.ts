// reads one poem file. line 1 is the title; any lines right after it that start with
// "Dedication:" or "Featured:" are settings, and everything after those is the poem.
// used by the Poetry page and by the build step that writes /poems/index.json.

export interface Poem {
    title: string;
    body: string;
    // the number in the file name, poem7.txt -> 7
    index: number;
    dedication?: string;
    featured: boolean;
    slug: string;
}

export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function parsePoem(text: string, index: number): Poem {
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const title = lines[0].trim();

    let dedication: string | undefined;
    let featured = false;
    let bodyStart = 1;

    while (bodyStart < lines.length) {
        const line = lines[bodyStart];
        const lower = line.toLowerCase();
        if (lower.startsWith("dedication:")) {
            dedication = line.slice("dedication:".length).trim();
        } else if (lower.startsWith("featured:")) {
            const value = line.slice("featured:".length).trim().toLowerCase();
            featured = value === "yes" || value === "true";
        } else {
            break;
        }
        bodyStart += 1;
    }

    const body = lines.slice(bodyStart).join("\n").trimStart();
    return { title, body, index, dedication, featured, slug: slugify(title) };
}
