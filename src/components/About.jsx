export default function About() {
    return (
        <section id="about" className="section">
            <div className="container">
                <div className="section-heading">
                    <h2>Background and skills</h2>
                </div>

                <div className="about-columns">
                    <div className="text-block">
                        <h3>Background</h3>
                        <p>
                            I have a BS in Computing and Information Technologies from RIT with a
                            minor in Software Engineering. I've been coding since 2017.
                        </p>
                        <p>
                            At Discovery Machine, I built most of a cross-platform Air Force app in
                            Flutter. At Chameleon Consulting Group, I automated virtual machine setup
                            with Docker, worked on a Flask API, and set up GitLab pipelines.
                        </p>
                        <p>
                            I care about writing software that's clear, maintainable, and useful to
                            the people relying on it.
                        </p>
                    </div>

                    <div className="text-block">
                        <h3>Technical skills</h3>
                        <ul className="skills-list">
                            <li><span className="skills-label">Languages:</span><span>Python, Java, TypeScript, JavaScript, C#, Dart, HTML, CSS</span></li>
                            <li><span className="skills-label">Frameworks/Libraries:</span><span>React, Node.js, Flutter, BLoC, Flask, FastAPI, Spring Boot, Angular, ASP.NET MVC</span></li>
                            <li><span className="skills-label">Cloud/DevOps:</span><span>Azure, Bicep, Docker, GitLab Pipelines, Git, Bash</span></li>
                            <li><span className="skills-label">AI/Developer Tools:</span><span>Claude Code (AI-Assisted Development), Vercel, Supabase</span></li>
                            <li><span className="skills-label">Architecture/APIs:</span><span>REST API, JSON, Design Patterns, Object-Oriented Design</span></li>
                            <li><span className="skills-label">Databases/Data/Testing:</span><span>SQL, Oracle, ODBC, JDBC, NumPy, scikit-learn, JUnit, Pytest</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}