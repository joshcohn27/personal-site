import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import HomePoetry from "./components/HomePoetry";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import ProjectsPage from "./projects/ProjectsPage";
import ProjectDetail from "./projects/ProjectDetail";
import { metaFor } from "./data/meta";

// the poetry page (and the radix popover it uses) only downloads when someone opens it
const Poetry = lazy(() => import("./poetry/PoetryMain"));

// after each navigation, go to the #section in the url if there is one, otherwise to the top.
// a new page jumps straight there; moving between sections on the same page scrolls smoothly.
function ScrollManager() {
    const { pathname, hash } = useLocation();
    const lastPath = useRef(null);

    useEffect(() => {
        const samePage = lastPath.current === pathname;
        lastPath.current = pathname;

        let behavior = "instant";
        if (samePage) {
            behavior = "smooth";
        }

        let target = null;
        if (hash) {
            target = document.getElementById(decodeURIComponent(hash.slice(1)));
        }

        if (!target) {
            if (!samePage) {
                window.scrollTo({ top: 0, behavior });
            }
            return;
        }

        target.scrollIntoView({ behavior });
        if (samePage) {
            return;
        }

        // arriving from another page: parts of the homepage (like the featured poems) load a moment
        // later and can push the section down, so keep it lined up until the page settles.
        // stop as soon as the visitor scrolls on their own.
        let stopped = false;
        const stop = () => {
            stopped = true;
        };
        const keepAligned = new ResizeObserver(() => {
            if (!stopped) {
                target.scrollIntoView({ behavior: "instant" });
            }
        });
        keepAligned.observe(document.body);
        window.addEventListener("wheel", stop, { passive: true });
        window.addEventListener("touchstart", stop, { passive: true });
        window.addEventListener("keydown", stop);
        const timer = setTimeout(stop, 2000);

        return () => {
            keepAligned.disconnect();
            clearTimeout(timer);
            window.removeEventListener("wheel", stop);
            window.removeEventListener("touchstart", stop);
            window.removeEventListener("keydown", stop);
        };
    }, [pathname, hash]);

    return null;
}

// keeps the tab title and description in step with the page when moving around inside the site
function PageMeta() {
    const { pathname } = useLocation();

    useEffect(() => {
        const meta = metaFor(pathname);
        document.title = meta.title;
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", meta.description);
        }
    }, [pathname]);

    return null;
}

function HomePage() {
    return (
        <div className="site-shell">
            <Header />
            <main>
                <Hero />
                <Projects />
                <About />
                <HomePoetry />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollManager />
            <PageMeta />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route
                    path="/poetry"
                    element={
                        <Suspense fallback={null}>
                            <Poetry />
                        </Suspense>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}