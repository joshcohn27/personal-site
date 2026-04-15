import React, { useState } from "react";
import white_x_svg from "../assets/whiteX.svg";


export enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
}

interface MessagePopupProps {
    message: string;
    type: MessageType;
    onClose: () => void;
}

export const MessagePopup = (props: MessagePopupProps) => {
    const [closing, setClosing] = useState(false);

    const popupStyle: React.CSSProperties = {
        position: 'fixed',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1em',
        bottom: '1em',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1em',
        borderRadius: '8px',
        color: '#fff',
        backgroundColor:
            props.type === MessageType.SUCCESS
                ? '#4CAF50'
                : props.type === MessageType.ERROR
                ? '#F44336'
                : '#2196F3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.5s',
    };


    const buttonStyle: React.CSSProperties = {   
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#fff',
        margin: "0.5em"
    }

    function handleClose() {
        setClosing(true);
        setTimeout(() => {
            props.onClose();
        }, 500);
    }

    return (
        <div style={popupStyle} id="message-popup">
            <p>{props.message}</p>
            <button
                onClick={handleClose}
                style={buttonStyle}
            >
                <img src={white_x_svg} alt="Close" style={{ width: '1.5em', height: '1.5em' }} />
            </button>
        </div>
    );
};