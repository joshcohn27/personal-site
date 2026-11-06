interface TechChipsProps {
    items: string[];
}

// lavender tech tags on project cards
export default function TechChips({ items }: TechChipsProps) {
    return (
        <ul className="tech-chips">
            {items.map((item) => (
                <li key={item} className="tech-chip">
                    {item}
                </li>
            ))}
        </ul>
    );
}
