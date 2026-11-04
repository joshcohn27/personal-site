import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Values from "./components/Values";
import Interests from "./components/Interests";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Poetry from "./poetry/PoetryMain";
import ProjectsPage from "./projects/ProjectsPage";

// After each navigation: go to the #section in the URL if there is one, otherwise to the top.
// A new page jumps straight there; moving between sections on the same page scrolls smoothly.
function ScrollManager() {
    const { pathname, hash } = useLocation();
    const lastPath = useRef(null);

    useEffect(() => {
        const samePage = lastPath.current === pathname;
        lastPath.current = pathname;
        const behavior = samePage ? "smooth" : "instant";

        const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
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
                <Values />
                <Interests />
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
                <Route path="/poetry" element={<Poetry />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}