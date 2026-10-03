export default function Hero() {
	return (
		<section id="top" className="hero-section">
			<div className="container hero-grid">
				<div className="hero-copy">
					<p className="eyebrow">Software Engineer · RIT '26 · Philadelphia, PA</p>

					<h1>
						I build software and care deeply about who it impacts
					</h1>

					<p className="hero-text">
						I'm Josh Cohn. I graduated from RIT with a BS in Computing and
						Information Technologies and a minor in Software Engineering, and
						I'm pursuing an MS in AI and Machine Learning at Drexel. I've worked
						in full-time engineering roles building mobile apps at Discovery
						Machine and cloud infrastructure at Chameleon Consulting Group LLC.
					</p>

					<p className="hero-text">
						I care a lot about how software impacts people. That means thinking
						about ethics, sustainability, and building things that are not just
						functional, but responsible. I want to work on systems that actually
						help people and hold up over time, not just ship fast and move on.
					</p>

					<div className="hero-actions">
						<a href="/projects" className="button button-primary" onClick={() => window.scrollTo(0, 0)}>
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
								Taught myself Flutter and Dart on the job, then built the majority of a cross-platform app's screens from design mockups at Discovery Machine Inc.
							</li>
							<li>
								Owned frontend features for a team senior project, integrating with a REST API built by a teammate
							</li>
							<li>
								Grew from camper to staff to leadership over 14 summers at Camp Seneca Lake, with 6 summers on staff and 4 of them on the Seasonal Leadership Team
							</li>
							<li>
								Serve as Operations & Logistics Manager and Pool Director at Camp Seneca Lake, and I'm a certified ARC Lifeguarding Instructor, Water Safety Instructor, and CPR Instructor
							</li>
							<li>
								Worked on cloud infrastructure and automation using Terraform, Docker, and Go at Chameleon Consulting Group LLC
							</li>
						</ul>
					</div>

					<div className="hero-card">
						<p className="hero-card-label">What I'm focused on</p>
						<p className="hero-card-text">
							I'm pursuing my MS in AI and Machine Learning at Drexel. I'm open
							to full-time opportunities and co-ops in and around AI/ML software
							engineering or frontend software engineering. I care as much about the people I work with
							as the problems I'm solving, and I try to bring that into my everyday life.
						</p>
					</div>
				</aside>
			</div>
		</section>
	);
}