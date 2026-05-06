import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NHLMockAndLotto from "./lotto/NHLMockAndLotto";

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
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/poetry" element={<Poetry />} />
                <Route path="/NHLMock" element={<NHLMockAndLotto />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
