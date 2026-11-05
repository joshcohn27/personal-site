// every project on the site, used by the homepage, the Projects page, and the detail pages.
// order here is the order on the Projects page.

export interface Project {
    slug: string;
    title: string;
    // small label above the title, like "Interactive Web App"
    type: string;
    // full description, shown on the Projects page
    description: string;
    // shorter description for the homepage card (featured projects only)
    summary?: string;
    stack: string[];
    link?: string;
    linkLabel?: string;
    repo?: string;
    // shown on the homepage
    featured?: boolean;
    // set to true to take a project off the site without deleting it
    hidden?: boolean;
    // screenshot of the live demo; files are <src>-640.webp and <src>-1280.webp
    screenshot?: Screenshot;
    // detail page sections, filled in later; each one only shows once it has a heading and text
    problem?: DetailSection;
    built?: DetailSection;
    role?: DetailSection;
}

export interface Screenshot {
    src: string;
    alt: string;
    // short looping clip played instead of the still; files are <video>.webm and <video>.mp4
    video?: string;
    // there is also a <src>-2560.webp, for screenshots shown large enough to need it
    hiRes?: boolean;
}

export interface DetailSection {
    heading: string;
    text: string;
}

// every project, including hidden ones; the site uses visibleProjects below
export const allProjects: Project[] = [
    {
        slug: "beehive-monitoring",
        title: "Beehive Monitoring System",
        type: "Undergrad Senior Capstone",
        description:
            "Led frontend development for a six-person senior capstone project that monitored data from a physical beehive and displayed it through a React dashboard. I established the frontend structure, built core dashboard and inspection views, and helped create patterns the rest of the team could build on. I also contributed to the Oracle database design, giving me experience working across the full stack from sensor data to backend services to user-facing visualization.",
        summary:
            "A full-stack capstone project that turned physical hive sensor data into a React dashboard for monitoring inspections, observations, and hive conditions.",
        stack: ["React", "TypeScript", "Vite", "Node.js", "Oracle", "REST API"],
        link: "https://joshbcohn.com/projects/beehive",
        linkLabel: "View Demo",
        repo: "https://github.com/joshcohn27/beehive-frontend",
        featured: true,
        screenshot: {
            src: "/screenshots/beehive",
            alt: "BeeMonitor dashboard showing hive temperature, humidity, outside temperature, and the latest hive observation.",
        },
    },
    {
        slug: "nhl-lottery",
        title: "NHL Draft Lottery Simulator",
        type: "Interactive Web App",
        description:
            "Built an interactive NHL draft lottery and mock draft simulator that combines two tools fans usually have to use separately. The app models real lottery constraints, visualizes the ping-pong ball draw, and then carries the finalized draft order directly into a mock draft workflow. What started as a small Python script became a full React and TypeScript project focused on accurate rules logic, data-driven rankings, and a smooth user experience.",
        summary:
            "An interactive simulator that models the NHL draft lottery, visualizes the ping-pong ball draw, and carries the final order directly into a mock draft workflow.",
        stack: ["React", "TypeScript", "REST API"],
        link: "https://hockeylotto.com",
        linkLabel: "Open Simulator",
        repo: "https://github.com/joshcohn27/nhl-lottery-sim",
        featured: true,
        screenshot: {
            src: "/screenshots/nhl-lottery",
            alt: "NHL Draft Lottery Simulator for the 2027 draft, ready to draw the first lottery ball.",
            video: "/screenshots/nhl-lottery-draw",
            hiRes: true,
        },
    },
    {
        slug: "od-scheduler",
        title: "OD Scheduler",
        type: "Interactive Web App",
        description:
            "Built a scheduling tool for Camp Seneca Lake to automate nightly on-duty staff coverage across 5 villages with 20-30 staff and uneven bunk groups, replacing a manual process that used to take hours every session. The engine runs 800 candidate schedules per generation, scores each one against fairness rules covering night-type severity, raw duty counts, and pairing diversity, and picks the best one that passes validation, with bunk-based slot restrictions and automatic fallback to floater staff when a bunk can't fill its own slot. Includes admin controls to freeze, lock out, or manually override any assignment, and I stress-tested the algorithm across dozens of synthetic rosters to make sure the fairness held up on edge cases, not just typical ones. Also built a second independent scheduling mode for Porch OD / Director-on-Duty coverage, plus print-ready Word calendar export.",
        summary:
            "A scheduling engine built for Camp Seneca Lake that generates fair nightly on-duty coverage for 20-30 staff, replacing a manual process that took hours every session.",
        stack: ["React", "TypeScript", "Vite", "CSS Modules", "docx"],
        link: "https://scheduler.joshbcohn.com",
        linkLabel: "Open Scheduler",
        repo: "https://github.com/joshcohn27/od_new",
        featured: true,
        screenshot: {
            src: "/screenshots/od-scheduler",
            alt: "OD Scheduler showing a generated night duty schedule with three staff on duty each night.",
        },
    },
    {
        slug: "committed",
        title: "Committed",
        type: "VS Code Extension",
        description:
            "Built the VS Code interface for a team project that uses a local LLM to review uncommitted code changes and generate commit messages for developer approval. I owned the sidebar UI and extension integration work, connecting the user-facing VS Code experience with Git data and local model output. The project gave me hands-on experience designing AI-assisted developer tooling that keeps the human in control.",
        stack: ["VS Code Extension API", "Node.js", "Ollama", "Git", "JavaScript"],
    },
    {
        slug: "autopick",
        title: "Autopick",
        type: "Interactive Web App",
        description:
            "A live draft assistant for my fantasy league that reads our Google Sheet and tells whoever is on the clock who to take, with reasoning and runner-ups. It shows who is on the clock, suggests the best pick for that team, and tracks trades as they happen. There is also an ADP board and a view of every team's roster, and the whole thing works without a backend.",
        stack: ["React", "TypeScript", "Vite", "Vitest", "Google Sheets API"],
        link: "https://autopick.joshbcohn.com",
        linkLabel: "Open Autopick",
        repo: "https://github.com/joshcohn27/autopick-react",
        // hidden until the revamp
        hidden: true,
    },
    {
        slug: "wrapped",
        title: "Wrapped",
        type: "Interactive Web App",
        description:
            "My own Spotify Wrapped built from my full streaming history, 2016 to 2026, with a stats dashboard and search. Anyone can upload their own export and see theirs. A build script precomputes the stats so the page loads fast, and uploaded exports are processed entirely in the browser and never sent anywhere.",
        stack: ["HTML", "CSS", "JavaScript", "Node.js", "Web Workers", "IndexedDB"],
        link: "https://wrapped.joshbcohn.com",
        linkLabel: "Open Wrapped",
        repo: "https://github.com/joshcohn27/wrapped",
        screenshot: {
            src: "/screenshots/wrapped",
            alt: "Wrapped dashboard showing all-time Spotify listening stats.",
        },
    },
    {
        slug: "table-games",
        title: "Table Game Simulator",
        type: "Interactive Web App",
        description:
            "Built a browser-based casino-style table game simulator focused on accurate game rules, clean interaction design, and complex state handling. The project includes multiple games and variants, each requiring careful logic for betting flows, hand evaluation, payouts, edge cases, and player/dealer actions. A small group of friends use it regularly, which has helped me improve the app through real feedback instead of just building in isolation.",
        stack: ["React", "TypeScript"],
        link: "https://casino.joshbcohn.com",
        linkLabel: "Open Simulator",
        repo: "https://github.com/joshcohn27/casino",
        screenshot: {
            src: "/screenshots/table-games",
            alt: "Cohn Casino home page listing blackjack and poker table games with a shared bankroll.",
        },
    },
    {
        slug: "weekly-schedule",
        title: "Weekly Period Schedule Builder",
        type: "Interactive Web App",
        description:
            "A schedule builder I made for camp staff to plan a four week session of activity periods, with auto-merging, Excel import and export, and one click schedule generation. A tracking tab counts program areas per bunk, and the auto generate button builds a full week while keeping totals fair across the session. It runs entirely in the browser with no backend.",
        stack: ["React", "TypeScript", "Vite", "SheetJS"],
        link: "https://weekly.joshbcohn.com",
        linkLabel: "Open Builder",
        repo: "https://github.com/joshcohn27/weekly-schedule",
        screenshot: {
            src: "/screenshots/weekly-schedule",
            alt: "Weekly Period Schedule Builder showing a generated week of activities for each bunk, period by period.",
        },
    },
    {
        slug: "flight-overhead",
        title: "Flight Overhead",
        type: "Interactive Web App",
        description:
            "Flight Overhead tells you which plane is flying closest to you right now. It shows the airline, the route, the aircraft type, and where to look in the sky. It's like FlightAware or Flightradar24, but it only shows the one plane over your head. It runs as a web app on my phone using live public flight data.",
        stack: ["React", "TypeScript", "Vite", "Vercel serverless functions"],
        link: "https://flight.joshbcohn.com",
        linkLabel: "Open Tracker",
        repo: "https://github.com/joshcohn27/flight-app",
        screenshot: {
            src: "/screenshots/flight-overhead",
            alt: "Flight Overhead showing the nearest plane, its altitude and distance, and where to look in the sky.",
        },
    },
];

// projects shown on the site, in Projects page order
export const projects = allProjects.filter((project) => !project.hidden);

export const featuredProjects = projects.filter((project) => project.featured);

// hidden projects have no detail page
export function findProject(slug: string | undefined) {
    return projects.find((project) => project.slug === slug);
}
