// page titles and descriptions, used for the browser tab, search results and link previews.
// the build step also uses this to write a separate html file per page (see scripts/pageMeta.js).

export const SITE_URL = "https://joshbcohn.com";
export const OG_IMAGE = "/og-image.jpg";

export interface PageMeta {
    title: string;
    description: string;
}

export const pageMeta: Record<string, PageMeta> = {
    "/": {
        title: "Josh Cohn | Software Engineer",
        description: "Software engineer in Philadelphia getting my MS in AI and Machine Learning at Drexel. Projects, background, and poetry.",
    },
    "/projects": {
        title: "Projects | Josh Cohn",
        description: "A mix of work projects, personal tools, and things I built because no one else had.",
    },
    "/poetry": {
        title: "Poetry | Josh Cohn",
        description: "Personal, unfiltered, self-published poetry.",
    },
    "/projects/beehive-monitoring": {
        title: "Beehive Monitoring System | Josh Cohn",
        description: "Senior capstone that turned physical beehive sensor data into a React dashboard for inspections, observations, and hive conditions.",
    },
    "/projects/nhl-lottery": {
        title: "NHL Draft Lottery Simulator | Josh Cohn",
        description: "Interactive NHL draft lottery and mock draft simulator that visualizes the ping-pong ball draw.",
    },
    "/projects/od-scheduler": {
        title: "OD Scheduler | Josh Cohn",
        description: "Scheduling tool that builds fair nightly on-duty coverage for Camp Seneca Lake staff, replacing a manual process that took hours.",
    },
    "/projects/committed": {
        title: "Committed | Josh Cohn",
        description: "VS Code extension that uses a local LLM to review uncommitted changes and draft commit messages for developer approval.",
    },
    "/projects/table-games": {
        title: "Table Game Simulator | Josh Cohn",
        description: "Browser casino with blackjack, poker, roulette, and more, all sharing one bankroll. No real money.",
    },
    "/projects/weekly-schedule": {
        title: "Weekly Period Schedule Builder | Josh Cohn",
        description: "Builds Camp Seneca Lake's weekly activity schedule, with auto generate, per-bunk tracking, and Excel export.",
    },
    "/projects/flight-overhead": {
        title: "Flight Overhead | Josh Cohn",
        description: "Shows which plane is flying overhead right now and where to look in the sky.",
    },
    "/projects/wrapped": {
        title: "Wrapped | Josh Cohn",
        description: "My own version of Spotify Wrapped, with listening stats from 2016 to 2026. Upload your own Spotify export to see yours.",
    },
};

export const notFoundMeta: PageMeta = {
    title: "Page not found | Josh Cohn",
    description: "This page doesn't exist.",
};

// meta for a path; anything not listed is the 404 page
export function metaFor(path: string): PageMeta {
    let clean = path;
    if (clean.length > 1 && clean.endsWith("/")) {
        clean = clean.slice(0, -1);
    }
    const found = pageMeta[clean];
    if (found) {
        return found;
    }
    return notFoundMeta;
}
