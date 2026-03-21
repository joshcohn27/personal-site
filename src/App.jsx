import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Values from "./components/Values";
import Interests from "./components/Interests";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
    return (
        <div className="site-shell">
            <Header />
            <main>
                <Hero />
                <About />
                <Projects />
                <Values />
                <Interests />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}