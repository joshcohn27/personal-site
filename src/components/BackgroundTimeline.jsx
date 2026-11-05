// background timeline: a proportional 2021 to 2028 axis on desktop, a vertical list on phones.
// dates are placed by real month, and the "Now" marker uses today's date.

// axis runs from the start of 2021 to the end of 2028
const AXIS_START = new Date(2021, 0, 1).getTime();
const AXIS_END = new Date(2029, 0, 1).getTime();
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];

// percent along the axis for a year and month (1 to 12), at mid-month
function at(year, month) {
    const time = new Date(year, month - 1, 15).getTime();
    return ((time - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
}

function nowPercent() {
    const percent = ((Date.now() - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
    return Math.min(100, Math.max(0, percent));
}

// high school graduation month isn't known, so it sits at June 2021
const HIGH_SCHOOL = at(2021, 6);
const RIT_START = at(2021, 8);
const RIT_END = at(2026, 5);
const DREXEL_START = at(2026, 9);
const DREXEL_END = at(2028, 6);
// internship dots sit at the middle of each Aug to Dec stretch
const CHAMELEON = at(2023, 10);
const DISCOVERY = at(2024, 10);
const CAMP_2021 = at(2021, 7);
const CAMP_2023 = at(2023, 7);

// cards are a quarter of the axis wide, centered on their date but kept inside the axis
const CARD_WIDTH = 25;

function cardLeft(center) {
    return Math.min(100 - CARD_WIDTH, Math.max(0, center - CARD_WIDTH / 2));
}

function Card({ label, date, center, stems, side, children }) {
    const left = cardLeft(center);
    let className = "tl2-card tl2-card-below";
    if (side === "above") {
        className = "tl2-card tl2-card-above";
    }
    return (
        <article className={className} style={{ marginLeft: `${left}%`, width: `${CARD_WIDTH}%` }}>
            <h4>{label}</h4>
            <p className="tl2-date">{date}</p>
            {children}
            {stems.map((x) => (
                <span key={x} className="tl2-stem" style={{ left: `${((x - left) / CARD_WIDTH) * 100}%` }} aria-hidden="true"></span>
            ))}
        </article>
    );
}

const TEXT = {
    highSchool: "I started coding in high school. My school offered programming classes all four years, which I was lucky to have, and I took every one. They were all taught by the same teacher, and he believed in my ability to solve problems. I learned Java and Python there and kept going.",
    rit: "At RIT, I learned real object-oriented programming and developed my problem-solving skills. I got my BS in Computing and Information Technologies with a minor in Software Engineering and an immersion in Creative Writing.",
    internships: "My internships at Discovery Machine, Inc. and Chameleon Consulting Group LLC let me keep learning while putting my skills to work on real teams. They taught me things you can only learn on the job.",
};

export default function BackgroundTimeline() {
    const now = nowPercent();
    const ritMiddle = (RIT_START + RIT_END) / 2;
    const drexelMiddle = (DREXEL_START + DREXEL_END) / 2;
    const internshipsMiddle = (CHAMELEON + DISCOVERY) / 2;
    // the RIT stem drops just inside the card's left edge so it doesn't run through the company labels
    const ritStem = cardLeft(ritMiddle) + 2;

    return (
        <>
            {/* desktop: proportional axis */}
            <div className="tl2">
                <div className="tl2-row tl2-row-above">
                    <Card label="RIT" date="Aug 2021 – May 2026" center={ritMiddle} stems={[ritStem]} side="above">
                        <p>{TEXT.rit}</p>
                    </Card>
                    <Card label="Drexel" date="Sep 2026 – Jun 2028 (expected)" center={drexelMiddle} stems={[drexelMiddle]} side="above" />
                </div>

                <div className="tl2-axis" aria-hidden="true">
                    <span className="tl2-line"></span>
                    <span className="tl2-band tl2-band-rit" style={{ left: `${RIT_START}%`, width: `${RIT_END - RIT_START}%` }}></span>
                    <span className="tl2-band tl2-band-drexel" style={{ left: `${DREXEL_START}%`, width: `${DREXEL_END - DREXEL_START}%` }}></span>
                    <span className="tl2-dot" style={{ left: `${HIGH_SCHOOL}%` }}></span>
                    <span className="tl2-dot" style={{ left: `${CHAMELEON}%` }}></span>
                    <span className="tl2-dot" style={{ left: `${DISCOVERY}%` }}></span>
                    <span className="tl2-dot-label" style={{ left: `${CHAMELEON}%` }}>Chameleon Consulting Group LLC</span>
                    <span className="tl2-dot-label" style={{ left: `${DISCOVERY}%` }}>Discovery Machine, Inc.</span>
                    <span className="tl2-now" style={{ left: `${now}%` }}>
                        <span className="tl2-now-label">Now</span>
                    </span>
                    {YEARS.map((year) => (
                        <span key={year} className="tl2-year" style={{ left: `${at(year, 1) - 0.5}%` }}>{year}</span>
                    ))}

                    {/* quieter second row for camp, right under the years */}
                    <span className="tl2-camp-title">Camp Seneca Lake</span>
                    <span className="tl2-camp-line"></span>
                    <span className="tl2-camp-mark" style={{ left: `${CAMP_2021}%` }}>Summer 2021: First-year staff</span>
                    <span className="tl2-camp-mark" style={{ left: `${CAMP_2023}%` }}>Summer 2023: Joined the leadership team</span>
                </div>

                <div className="tl2-row tl2-row-below">
                    <Card label="High school" date="Graduated 2021" center={HIGH_SCHOOL} stems={[HIGH_SCHOOL]} side="below">
                        <p>{TEXT.highSchool}</p>
                    </Card>
                    <Card label="Internships" date="Aug–Dec 2023 · Aug–Dec 2024" center={internshipsMiddle} stems={[CHAMELEON, DISCOVERY]} side="below">
                        <p>{TEXT.internships}</p>
                    </Card>
                </div>

            </div>

            {/* phones: the same story, top to bottom in date order */}
            <ol className="tl2-mobile">
                <li className="tl2m-item">
                    <span className="tl2m-dot tl2m-dot-ring" aria-hidden="true"></span>
                    <div className="tl2-card">
                        <h4>High school</h4>
                        <p className="tl2-date">Graduated 2021</p>
                        <p>{TEXT.highSchool}</p>
                    </div>
                </li>
                <li className="tl2m-item tl2m-quiet">
                    <span className="tl2m-dot" aria-hidden="true"></span>
                    <p className="tl2m-note">Summer 2021: First-year staff</p>
                </li>
                <li className="tl2m-item tl2m-rit">
                    <span className="tl2m-dot tl2m-dot-ring" aria-hidden="true"></span>
                    <div className="tl2-card">
                        <h4>RIT</h4>
                        <p className="tl2-date">Aug 2021 – May 2026</p>
                        <p>{TEXT.rit}</p>
                    </div>
                </li>
                <li className="tl2m-item tl2m-rit tl2m-quiet">
                    <span className="tl2m-dot" aria-hidden="true"></span>
                    <p className="tl2m-note">Summer 2023: Joined the leadership team</p>
                </li>
                <li className="tl2m-item tl2m-rit">
                    <span className="tl2m-dot tl2m-dot-ring" aria-hidden="true"></span>
                    <p className="tl2m-note">Chameleon Consulting Group LLC</p>
                </li>
                <li className="tl2m-item tl2m-rit">
                    <span className="tl2m-dot tl2m-dot-ring" aria-hidden="true"></span>
                    <p className="tl2m-note">Discovery Machine, Inc.</p>
                    <div className="tl2-card">
                        <h4>Internships</h4>
                        <p className="tl2-date">Aug–Dec 2023 · Aug–Dec 2024</p>
                        <p>{TEXT.internships}</p>
                    </div>
                </li>
                <li className="tl2m-item tl2m-rit tl2m-quiet">
                    <span className="tl2m-dot" aria-hidden="true"></span>
                    <p className="tl2m-note">May 2026</p>
                </li>
                <li className="tl2m-item tl2m-drexel">
                    <span className="tl2m-dot tl2m-dot-ring" aria-hidden="true"></span>
                    <div className="tl2-card">
                        <h4>Drexel</h4>
                        <p className="tl2-date">Sep 2026 – Jun 2028 (expected)</p>
                    </div>
                </li>
                <li className="tl2m-item tl2m-drexel tl2m-quiet">
                    <span className="tl2m-dot tl2m-dot-now" aria-hidden="true"></span>
                    <p className="tl2m-note">Now</p>
                </li>
            </ol>
        </>
    );
}
