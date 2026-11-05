// square photo for the About section; files are public/images/outside/<name>-560.webp and -1120.webp
const ALT = {
    laughing: "Josh laughing with his hands on his knees during a game at camp.",
    flyers: "A packed Flyers game, with Gritty on the jumbotron.",
    rainbow: "Double rainbow over Seneca Lake at sunset, with sailboats lined up on the shore.",
    pasta: "A bowl of tagliatelle with meat sauce and grated cheese.",
    catan: "A Catan game in progress, with roads and settlements on the board.",
    dock: "Josh lifeguarding on a dock at Seneca Lake, holding a rescue tube.",
    torch: "Josh holding a lit torch at Camp Seneca Lake, with the lake behind him.",
};

// size of the 560 file; each photo keeps its own shape
const SIZE = {
    laughing: [560, 374],
    flyers: [560, 373],
    rainbow: [560, 373],
    pasta: [560, 560],
    catan: [560, 560],
    dock: [560, 700],
    torch: [560, 373],
};

export default function OutsidePhoto({ name }) {
    const base = `/images/outside/${name}`;
    const [width, height] = SIZE[name];
    return (
        <img
            className="outside-photo"
            src={`${base}-560.webp`}
            srcSet={`${base}-560.webp 560w, ${base}-1120.webp 1120w`}
            sizes="(max-width: 720px) 100vw, 520px"
            width={width}
            height={height}
            alt={ALT[name]}
            loading="lazy"
            decoding="async"
        />
    );
}
