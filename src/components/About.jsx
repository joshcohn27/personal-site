export default function About() {
    return (
        <section id="about" className="section">
            <div className="container">
                <div className="section-heading">
                    <p className="section-label">About</p>
                    <h2>More than just code.</h2>
                </div>

                <div className="about-grid">
                    <div className="content-card">
                        <p>
                            I’m a software engineer in training who enjoys building products
                            that are clean, practical, and genuinely useful. My background at
                            RIT has pushed me to work across frontend development, backend
                            logic, project architecture, and team-based software delivery.
                        </p>
                        <p>
                            I’m especially drawn to work where technology can support people
                            in meaningful ways, whether that means improving a workflow,
                            making a tool more intuitive, or building systems that are more
                            responsible and sustainable in how they’re designed.
                        </p>
                    </div>

                    <div className="content-card">
                        <h3>What I bring</h3>
                        <ul className="bullet-list">
                            <li>Strong React and JavaScript/TypeScript foundations</li>
                            <li>Experience building full academic and personal software projects</li>
                            <li>A product mindset, not just a coding mindset</li>
                            <li>Attention to detail, usability, and structure</li>
                            <li>Real interest in ethics, impact, and long-term value in tech</li>
                            <li>Interest in constantly growing and learning</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}