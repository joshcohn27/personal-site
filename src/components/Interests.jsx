import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import TextLink from "./ui/TextLink";
import IconButton from "./ui/IconButton";

// one card per item, in this order. photo is optional: add
//   photo: { name: "file-name", alt: "..." },
// to an item to give its card a photo (files are public/images/outside/<name>-thumb-320/640/960.webp)
const ITEMS = [
    {
        title: "Camp Seneca Lake",
        text: "I've spent 14 summers at Camp Seneca Lake, going from camper to counselor to the leadership team. My role changes from year to year, but I'm always responsible for a lot. It's a big part of my life.",
        photo: { name: "torch", alt: "Josh holding a lit torch at Camp Seneca Lake, with the lake behind him." },
    },
    {
        title: "Philadelphia Sports",
        text: "Lifelong Philly fan. Sports have always been a big part of my life. They have taught me a lot about resilience, patience, and sticking with something even when it is frustrating. Also helps that the Eagles have given me some unforgettable moments. At RIT, I was a member of Sports Fans of RIT and served as the club's treasurer.",
        photo: { name: "flyers", alt: "A packed Flyers game, with Gritty on the jumbotron." },
    },
    {
        title: "The Outdoors",
        text: "I spend time outside whenever I can. Whether it's being near water, going for walks, or just getting fresh air, it helps me slow down and think more clearly.",
        photo: { name: "rainbow", alt: "Double rainbow over Seneca Lake at sunset, with sailboats lined up on the shore." },
    },
    {
        title: "Cooking",
        text: "I enjoy trying new foods, but more than that I like cooking for other people. There is something satisfying about putting a meal in front of someone and watching them enjoy it. It is a different kind of joy for both of us.",
        photo: { name: "pasta", alt: "A bowl of tagliatelle with meat sauce and grated cheese." },
    },
    {
        title: "Catan",
        text: "Strategy, negotiation, and a bit of luck. It is a great combination. I have been playing for years and have played around 1500 games. I am always up for one more.",
        photo: { name: "catan", alt: "A Catan game in progress, with roads and settlements on the board." },
    },
    {
        title: "Teaching",
        text: "I'm a certified American Red Cross instructor for lifeguarding, water safety, and CPR.",
        photo: { name: "dock-fit", alt: "Josh lifeguarding on a dock at Seneca Lake, holding a rescue tube." },
    },
    {
        title: "Writing Poetry",
        text: "I spend a lot of time writing poetry. It is something I really enjoy and a way for me to slow down and think differently. It is how I process my thoughts and a more personal way of telling stories.",
    },
    {
        title: "Volunteering",
        text: "I volunteer as a driver for the American Cancer Society Road to Recovery program, giving rides to patients traveling to and from cancer treatment. It is one of the most rewarding things I do, and it matters a lot to me.",
    },
];

// extra links under two of the items
function Extra({ title }) {
    if (title === "Camp Seneca Lake") {
        return (
            <div className="interest-links">
                <TextLink to="/projects/od-scheduler">OD Scheduler</TextLink>
                <TextLink to="/projects/weekly-schedule">Weekly Period Schedule Builder</TextLink>
            </div>
        );
    }
    if (title === "Writing Poetry") {
        return (
            <div className="interest-links">
                <TextLink to="/#poetry">View my poems</TextLink>
            </div>
        );
    }
    return null;
}

function CardPhoto({ photo }) {
    if (!photo) {
        return null;
    }
    const base = `/images/outside/${photo.name}-thumb`;
    return (
        <img
            className="outside-card-photo"
            src={`${base}-640.webp`}
            srcSet={`${base}-320.webp 320w, ${base}-640.webp 640w, ${base}-960.webp 960w`}
            sizes="(max-width: 720px) 85vw, 360px"
            width={640}
            height={480}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
        />
    );
}

function ArrowIcon({ direction }) {
    let points = "15 6 9 12 15 18";
    if (direction === "next") {
        points = "9 6 15 12 9 18";
    }
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points={points} />
        </svg>
    );
}

// true when the visitor has asked their system to reduce motion
function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Interests() {
    // a short duration keeps it snappy; with reduced motion the row settles almost instantly
    let duration = 20;
    if (prefersReducedMotion()) {
        duration = 1;
    }
    const [viewportRef, embla] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        duration,
    });
    const [selected, setSelected] = useState(0);
    const [snapCount, setSnapCount] = useState(0);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);

    const update = useCallback((api) => {
        setSelected(api.selectedScrollSnap());
        setSnapCount(api.scrollSnapList().length);
        setCanPrev(api.canScrollPrev());
        setCanNext(api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!embla) {
            return;
        }
        update(embla);
        embla.on("select", update);
        embla.on("reInit", update);
        return () => {
            embla.off("select", update);
            embla.off("reInit", update);
        };
    }, [embla, update]);

    const goPrev = () => {
        if (embla) {
            embla.scrollPrev(prefersReducedMotion());
        }
    };
    const goNext = () => {
        if (embla) {
            embla.scrollNext(prefersReducedMotion());
        }
    };

    // arrow keys move the row while it has focus
    const onKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goPrev();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            goNext();
        }
    };

    const dots = [];
    for (let i = 0; i < snapCount; i++) {
        let dotClass = "outside-dot";
        if (i === selected) {
            dotClass = "outside-dot is-current";
        }
        dots.push(<span key={i} className={dotClass}></span>);
    }

    return (
        <div id="interests" className="text-block about-part">
            <div className="outside-head">
                <h3 id="outside-title">Outside of work</h3>
                <div className="outside-arrows">
                    <IconButton label="Previous" onClick={goPrev} disabled={!canPrev}>
                        <ArrowIcon direction="prev" />
                    </IconButton>
                    <IconButton label="Next" onClick={goNext} disabled={!canNext}>
                        <ArrowIcon direction="next" />
                    </IconButton>
                </div>
            </div>

            <div
                className="outside-viewport"
                ref={viewportRef}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-labelledby="outside-title"
                onKeyDown={onKeyDown}
            >
                <div className="outside-track">
                    {ITEMS.map((item) => (
                        <div key={item.title} className="outside-slide">
                            <article className="outside-card">
                                <CardPhoto photo={item.photo} />
                                <div className="outside-card-body">
                                    <h4>{item.title}</h4>
                                    <p>{item.text}</p>
                                    <Extra title={item.title} />
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {/* which card you're on */}
            <div className="outside-dots" aria-hidden="true">
                {dots}
            </div>
        </div>
    );
}
