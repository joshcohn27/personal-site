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
                            I'm a software engineer with a BS in Computing and Information
                            Technologies from RIT and a minor in Software Engineering.
                            I've been coding since 2017, and I've worked on real engineering
                            teams along the way. At Discovery Machine, I built a cross-platform
                            mobile app in Flutter. At Chameleon Consulting Group LLC, I
                            automated virtual machine spin-up in Docker, modified a Flask API in
                            an air-gapped environment, and configured GitLab pipelines.
                        </p>
                        <p>
                            I've built a range of projects both on my own and through school,
                            including a VS Code extension to improve commit workflows, a full-stack
                            financial platform with Spring Boot and Angular, and a beehive monitoring
                            system. I care about writing software that is clear, maintainable, and
                            useful to the people relying on it.
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