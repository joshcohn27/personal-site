import type { ReactNode } from "react";

interface SectionHeaderProps {
    title: string;
    // smaller line under the title; left out until there's text for it
    subtitle?: string;
    // optional button on the right, like "View all projects"
    action?: ReactNode;
}

// main header for a homepage section
export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
    return (
        <div className="section-heading section-heading-row">
            <div>
                <h2>{title}</h2>
                {subtitle && (
                    <p className="section-subheader">{subtitle}</p>
                )}
            </div>
            {action}
        </div>
    );
}
