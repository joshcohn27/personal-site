import { useState } from "react";
import BeeGraphic from "/bee-graphic.svg";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);

    const landingPageStyle: React.CSSProperties = {
        margin: 0,
        height: "100vh",
        overflow: "hidden",
        position: "relative",
    };

    const textBlockStyle: React.CSSProperties = {
        position: "absolute",
        left: "8%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        width: "min(520px, 80vw)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        opacity: 1
    };

    const textBlockEndStyle: React.CSSProperties = {
        opacity: 0,
        transition: "opacity 1s ease-in-out",
    }


    const headingStyle: React.CSSProperties = {
        fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
        fontWeight: 600,
        marginBottom: "0.5em",
        lineHeight: 1.1,
    };

    const subTextStyle: React.CSSProperties = {
        fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
        fontWeight: 500,
        marginBottom: "1em",
        opacity: 0.85,
        lineHeight: 1.4,
    };

    const beeSvgStyleStart: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        left: "-15%",
        transform: "translate(100%, -50%)",
        width: "50em",
        height: "50em",
        zIndex: 1,
        pointerEvents: "none",
        userSelect: "none",
        transition: "transform 1s ease-in-out",
    };

    const beeSvgStyleEnd: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        left: "-15%",
        transform: "translate(0, -50%)",
        width: "50em",
        height: "50em",
        zIndex: 1,
        pointerEvents: "none",
        userSelect: "none",
        transition: "transform 1s ease-in-out",
    };

    const buttonStyle = {
        fontSize: '1em',
        fontWeight: 600,
        cursor: 'pointer',
        backgroundColor: '#181818',
        color: '#ffffff',
        borderRadius: '8px',
        border: 'none',
        width: 'fit-content',
        padding: '0.75em 1.5em',
    }



    const onGetStartedClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }


    return (
        <div style={landingPageStyle}>
            <div style={{...textBlockStyle, ...(isAnimating ? textBlockEndStyle : {})}} id="text-block">
                <p style={headingStyle}>Monitor your hive's health. Anytime, anywhere.</p>
                <p style={subTextStyle}>
                    Connect your sensor and get real-time insights into temperature, humidity, volume, and more.
                </p>
                <button style={buttonStyle} onClick={onGetStartedClick}>Get Started</button>
            </div>

            <img 
                src={BeeGraphic} 
                id="bee-graphic" 
                alt="Illustration of a bee" 
                style={isAnimating ? beeSvgStyleEnd : beeSvgStyleStart} 
            />
        </div>
    );
};
