import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NFLPredictor from "./components/NFLPredictor";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Home page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Contact />
              </>
            }
          />

          {/* NFL Predictor page */}
          <Route path="/NFLPredictor" element={<NFLPredictor />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
