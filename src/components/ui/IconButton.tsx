import type { ReactNode } from "react";

interface IconButtonProps {
    // what screen readers say, since the button only shows an icon
    label: string;
    onClick: () => void;
    // the svg icon
    children: ReactNode;
}

// round 44px button holding a small icon, like the share and close buttons on an open poem
export default function IconButton({ label, onClick, children }: IconButtonProps) {
    return (
        <button type="button" className="icon-button" aria-label={label} title={label} onClick={onClick}>
            {children}
        </button>
    );
}
