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
                            <li><strong>Languages:</strong> Python, Java, TypeScript, JavaScript, C#, Dart, HTML, CSS</li>
                            <li><strong>Frameworks/Libraries:</strong> React, Node.js, Flutter, BLoC, Flask, FastAPI, Spring Boot, Angular, ASP.NET MVC</li>
                            <li><strong>Cloud/DevOps:</strong> Azure, Bicep, Docker, GitLab Pipelines, Git, Bash</li>
                            <li><strong>AI/Developer Tools:</strong> Claude Code (AI-Assisted Development), Vercel, Supabase</li>
                            <li><strong>Architecture/APIs:</strong> REST API, JSON, Design Patterns, Object-Oriented Design</li>
                            <li><strong>Databases/Data/Testing:</strong> SQL, Oracle, ODBC, JDBC, NumPy, scikit-learn, JUnit, Pytest</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}