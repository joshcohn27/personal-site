

interface DashboardGraphToggleProps {
    dashboardView: boolean
    message?: string
    onToggle?: () => void
}


export const DashboardGraphToggle = ({ dashboardView, message, onToggle }: DashboardGraphToggleProps) => {

    const toggleStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap: "0.5em",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5em 1em",
        borderRadius: "20px",
        backgroundColor: dashboardView ? "#4CAF50" : "#ccc",
        color: dashboardView ? "#fff" : "#000",
        cursor: "pointer",
        userSelect: "none",
        position: "fixed",
        bottom: "1em",
        right: "1em"
    }

    const buttonStyle: React.CSSProperties = {
        background: "transparent",
        border: "none",
        color: dashboardView ? "#fff" : "#000",
        fontSize: "1em",
        cursor: "pointer",
    }

    return (
        <div style={toggleStyle}>
            <button style={buttonStyle} onClick={onToggle}>
                {message || "Toggle Graph Page"}
            </button>
        </div>
    )
}