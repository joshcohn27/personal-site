export default function Hero() {
	return (
		<section id="top" className="hero-section">
			<div className="container hero-grid">
				<div className="hero-copy">
					<p className="eyebrow">Software Engineer · RIT '26 · Exton, PA</p>

					<h1>
						I build software and care deeply about who it impacts
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
							<li>
								Taught myself Flutter and Dart on the job, then built out majority of webapp screens from wireframes at Discovery Machine Inc.
							</li>
							<li>
								Owned frontend features for a team senior project, integrating with a REST API built by a teammate
							</li>
							<li>
								Led staff teams at Camp Seneca Lake across multiple summers, stepping into new roles, learning quickly, and earning trust from people I was responsible for
							</li>
							<li>
								Worked on cloud infrastructure and automation using Terraform, Docker, and Go at Chameleon Consulting
							</li>
						</ul>
					</div>

					<div className="hero-card">
						<p className="hero-card-label">What I'm focused on</p>
						<p className="hero-card-text">
							Heading to Drexel in Fall 2026 for my MS in AI and Machine Learning.
							I'm open to part-time opportunities during school where I can keep
							contributing and learning. I care as much about the people I work with
							as the problems I'm solving, and I try to bring that into my everyday life.
						</p>
					</div>
				</aside>
			</div>
		</section>
	);
}