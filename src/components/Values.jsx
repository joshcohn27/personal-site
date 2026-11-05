export default function Values() {
    return (
        <div id="future" className="text-block about-part">
            <h3>Goals and values</h3>

            <div className="about-columns values-columns">
                <div className="text-block">
                    <h4>Where I am now</h4>
                    <p>
                        I'm working on my MS in AI and Machine Learning at Drexel. I think ML is
                        one of the most powerful tools we have, and I want to understand it well
                        enough to use it responsibly.
                    </p>
                    <p>
                        I'm open to full-time roles and co-ops in AI/ML or frontend software
                        engineering. I've really enjoyed frontend work lately, especially building
                        clean, easy-to-use interfaces, but I like working across the stack too.
                    </p>
                </div>

                <div className="text-block">
                    <h4>What I value</h4>
                    <p>
                        The best teams I've been on were the ones where people cared. They cared
                        about the details and doing things the right way, not just getting something
                        out the door. I care as much about the people I work with as the problems
                        we're solving.
                    </p>
                    <p>
                        That's how I think about AI too. I care about who it actually helps. AI can
                        do a lot of good in areas like healthcare and education, but only if it's
                        built with intention. That's why I want to study it, not just use it.
                    </p>
                </div>

                <img
                    className="values-photo"
                    src="/images/outside/laughing-portrait-560.webp"
                    srcSet="/images/outside/laughing-portrait-560.webp 560w, /images/outside/laughing-portrait-1120.webp 1120w"
                    sizes="(max-width: 960px) 100vw, 360px"
                    width={560}
                    height={700}
                    alt="Josh laughing with his hands on his knees during a game at camp."
                    loading="lazy"
                    decoding="async"
                />
            </div>
        </div>
    );
}