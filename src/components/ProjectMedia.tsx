import { useEffect, useState } from "react";
import type { Screenshot } from "../data/projects";

interface ProjectMediaProps {
    screenshot: Screenshot;
    // css sizes hint so the browser picks the 640 or 1280 file
    sizes: string;
    className?: string;
}

// true when the visitor has asked their system to reduce motion
function usePrefersReducedMotion() {
    const query = "(prefers-reduced-motion: reduce)";
    const [reduced, setReduced] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const onChange = () => {
            setReduced(media.matches);
        };
        media.addEventListener("change", onChange);
        return () => {
            media.removeEventListener("change", onChange);
        };
    }, []);

    return reduced;
}

// screenshot for a project card or detail page; plays the looping clip when there is one,
// unless the visitor prefers reduced motion
export default function ProjectMedia({ screenshot, sizes, className }: ProjectMediaProps) {
    const reducedMotion = usePrefersReducedMotion();
    const still640 = `${screenshot.src}-640.webp`;
    const still1280 = `${screenshot.src}-1280.webp`;

    let classes = "project-media";
    if (className) {
        classes += " " + className;
    }

    if (screenshot.video && !reducedMotion) {
        return (
            <video
                className={classes}
                poster={still1280}
                width={1280}
                height={800}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                role="img"
                aria-label={screenshot.alt}
            >
                <source src={`${screenshot.video}.webm`} type="video/webm" />
                <source src={`${screenshot.video}.mp4`} type="video/mp4" />
            </video>
        );
    }

    return (
        <img
            className={classes}
            src={still640}
            srcSet={`${still640} 640w, ${still1280} 1280w`}
            sizes={sizes}
            width={1280}
            height={800}
            alt={screenshot.alt}
            loading="lazy"
            decoding="async"
        />
    );
}
