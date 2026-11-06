import type { ReactNode } from "react";

interface IconButtonProps {
    // what screen readers say, since the button only shows an icon
    label: string;
    onClick: () => void;
    // greyed out and not clickable
    disabled?: boolean;
    // extra class for placement, like the card row arrows
    className?: string;
    // the svg icon
    children: ReactNode;
}

// round 44px button holding a small icon, like the share and close buttons on an open poem
export default function IconButton({ label, onClick, disabled = false, className, children }: IconButtonProps) {
    let classes = "icon-button";
    if (className) {
        classes += " " + className;
    }
    return (
        <button type="button" className={classes} aria-label={label} title={label} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
