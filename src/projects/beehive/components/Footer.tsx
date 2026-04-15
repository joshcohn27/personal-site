import React from 'react'
import LogoMark from "../assets/logo_mark.svg";

const Footer = () => {

    const footerStyle = {
        padding: '1em 3em',
        backgroundColor: 'var(--foreground-color, #ffffff)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '.9em',
    }

    const logoMarkStyle = {
        width: '1em',
    }

    const simpleFooter = (
        <div style={footerStyle}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                <p>&copy; {new Date().getFullYear()} Reykjavik</p>
                <img src={LogoMark} style={logoMarkStyle} alt="Reykjavik logo mark" />
            </div>
            <p>BeehiveMonitor</p>
        </div>
    )

    return (
        simpleFooter
    )
}

export { Footer }
