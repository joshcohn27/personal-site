export default function Hero() {
	return (
		<section id="top" className="hero-section">
			<div className="container hero-grid">
				<div className="hero-copy">
					<p className="eyebrow">Software Engineer · RIT '26 · Exton, PA</p>

					<h1>
						I build software that is thoughtful, reliable, and actually useful.
					</h1>

					<p className="hero-text">
						I'm Josh Cohn, a Computing and Information Technologies student at
						RIT graduating in May 2026, with a minor in Software Engineering.
						Over the past two years, I have worked in full-time engineering roles
						building mobile apps at Discovery Machine and working on cloud
						infrastructure at Chameleon Consulting.
					</p>

					<p className="hero-text">
						I care a lot about how software impacts people. That means thinking
						about ethics, sustainability, and building things that are not just
						functional, but responsible. I want to work on systems that actually
						help people and hold up over time, not just ship fast and move on.
					</p>

					<div className="hero-actions">
						<a href="#projects" className="button button-primary">
							View Projects
						</a>
						<a
							href="/resume.pdf"
							target="_blank"
							rel="noreferrer"
							className="button button-secondary"
						>
							View Resume
						</a>
					</div>
				</div>

				<aside className="hero-panel">
					<div className="hero-card">
						<p className="hero-card-label">Experience</p>
						<ul className="hero-list">
							<li>Flutter and Dart mobile development at Discovery Machine</li>
							<li>Cloud infrastructure with Terraform, Docker, and Go at Chameleon</li>
							<li>Full-stack web apps with React and Spring Boot</li>
							<li>Developer tooling and VS Code extension work</li>
						</ul>
					</div>

					<div className="hero-card">
						<p className="hero-card-label">What I'm focused on</p>
						<p className="hero-card-text">
							Finishing my degree at RIT, building side projects, and looking for
							a full-time software engineering role. I am especially interested in
							teams working on tools, infrastructure, or applied AI where I can
							contribute to building things that are both useful and responsible.
						</p>
					</div>
				</aside>
			</div>
		</section>
	);
}