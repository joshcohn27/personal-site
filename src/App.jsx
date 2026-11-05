import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import HomePoetry from "./components/HomePoetry";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Poetry from "./poetry/PoetryMain";
import ProjectsPage from "./projects/ProjectsPage";
import ProjectDetail from "./projects/ProjectDetail";

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

        if (target) {
            target.scrollIntoView({ behavior });
        } else if (!samePage) {
            window.scrollTo({ top: 0, behavior });
        }
    }, [pathname, hash]);

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
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/poetry" element={<Poetry />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}