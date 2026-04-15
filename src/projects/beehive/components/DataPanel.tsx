import React from "react";
import { StatusType } from "../types/SensorTypeEnums";
import { OpenButton } from "./OpenButton";
import { LoadingSpinner } from "./LoadingComponents";
import { useNavigate } from "react-router-dom";
import { howLongSinceTimestamp } from "../utils/SQLUtils";

interface DataPanelProps {
    title: string;
    dataSnapshot: any; // 72
    unit?: string; // %, ppm, °F, etc.
    lastUpdated?: string; // If it has a timestamp, show it 
    status?: StatusType;
    redirectLink?: string; // If provided, make the panel clickable and redirect to this link
    isMega?: boolean; // If true, use the larger styling for the panel (for MegaDataPanel)
    // If true, text scales down with card size
    responsiveText?: boolean;
}

const getStatusBg = (status?: StatusType) => {
    if (!status) return "transparent";
    if (status === StatusType.NORMAL) return "#BFF1BA";
    if (status === StatusType.HIGH || status === StatusType.LOW) return "#E76B6B";
    if (status === StatusType.CRITICAL) return "#000000";
    if (status === StatusType.NONE) return "#707070";
    return "transparent";
};

const getStatusColor = (status?: StatusType) => {
    return status === StatusType.CRITICAL ? "#ffffff" : "#000000";
};

const DataPanel = ({
    title,
    dataSnapshot,
    unit,
    lastUpdated,
    status,
    redirectLink,
    responsiveText = false,
    isMega=false,
    
}: DataPanelProps) => {
    const navigate = useNavigate();

    const panelStyle: React.CSSProperties = {
        boxShadow: "0 4px 16px #00000022",
        borderRadius: 16,
        backgroundColor: "var(--foreground-color, #ffffff)",

        width: "100%",
        height: "auto",
        boxSizing: "border-box",
        padding: "clamp(0.75rem, 1.2vw, 1rem)",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "0.6rem",

        // clickable affordance only when redirectLink exists
        textDecoration: "none",
    };

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.75rem",
        minWidth: 0,
    };

    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontWeight: 400,
        marginBottom: "0.5rem",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: responsiveText ? "clamp(0.8rem, 1.2vw, 1rem)" : "0.95rem",
    };

    const statusStyle: React.CSSProperties = {
        fontSize: "0.7rem",
        fontWeight: 600,
        borderRadius: "8px",
        padding: "0.35rem 0.85rem",
        whiteSpace: "nowrap",
        flexShrink: 0,
        backgroundColor: getStatusBg(status),
        color: getStatusColor(status),
    };

    const dataRowStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "baseline",
        gap: "0.45rem",
        minWidth: 0,
        marginBottom: "1rem",
    };

    const valueStyle: React.CSSProperties = {
        margin: 0,
        fontWeight: 600,
        lineHeight: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "3rem"
    };

    const unitStyle: React.CSSProperties = {
        fontWeight: 600,
        opacity: 0.75,
        whiteSpace: "nowrap",
        fontSize: responsiveText ? "clamp(0.75rem, 1.6vw, 0.95rem)" : "0.95rem",
    };

    const footerTextStyle: React.CSSProperties = {
        marginTop: "1.5rem",
        fontSize: "0.7rem",
        fontWeight: 500,
        color: "#707070",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        

    };

    const megaStyle: React.CSSProperties = {
        boxShadow: "none",
        borderRadius: 16,
        backgroundColor: "transparent",

        width: "100%",
        height: "auto",
        boxSizing: "border-box",
        padding: "clamp(0.75rem, 1.2vw, 1rem)",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "0.6rem",

        // clickable affordance only when redirectLink exists
        textDecoration: "none",
    };

    const footerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        justifySelf: "flex-end",
    }


    return (
        <div style={isMega ? megaStyle : panelStyle}>
            <div style={headerStyle}>
                <p style={titleStyle}>{title}</p>
                <p style={statusStyle}>{status ?? ""}</p>
            </div>

            <div style={dataRowStyle}>
                {
                    dataSnapshot !== undefined ? 
                    <>
                        <p style={valueStyle}>{dataSnapshot}</p>
                        <span style={unitStyle}>{unit ?? ""}</span>
                    </> 
                    :
                    <>
                        <p style={valueStyle}>{"--"}</p>
                    </> 
                }

            </div>

            <div style={footerStyle}>
                <p style={footerTextStyle}>{lastUpdated ?? ""}</p>
                {redirectLink && <OpenButton onClick={() => { navigate(redirectLink); }} />}
            </div>
        </div>
    );
};

export { DataPanel };
