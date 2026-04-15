import frontArrow from "../assets/FrontArrow.svg"
import { LogType, SensorType } from "../types/SensorTypeEnums";


interface OpenButtonProps {
    onClick: () => void;
}

export const OpenButton = ({ onClick }: OpenButtonProps) => {
    const buttonStyle = {
        fontSize: '1.5em',
        cursor: 'pointer',
        borderRadius: '8px',
        width: '1.5em',
        height: '1.5em',
        border: 'none',
        backgroundColor: 'transparent',
    }
    return (
        <button style={buttonStyle} onClick={onClick}>
            <img src={frontArrow} alt="Open Button"/>
        </button>
    );
}

