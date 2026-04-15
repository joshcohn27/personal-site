import Plus from "../assets/Plus.svg"
import { LogType, SensorType } from "../types/SensorTypeEnums";


interface AddLogButtonProps {
    logType: LogType
    onClick: () => void;
}

export const AddLogButton = ({ logType, onClick }: AddLogButtonProps) => {
    const buttonStyle = {
        fontSize: '1.5em',
        cursor: 'pointer',
        backgroundColor: '#181818',
        borderRadius: '8px',
        width: '1.5em',
        height: '1.5em',
        border: 'none',
    }
    return (
        <button style={buttonStyle} onClick={onClick}>
            <img src={Plus} alt="Add Log"/>
        </button>
    );
}

