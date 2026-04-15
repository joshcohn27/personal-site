import React from "react";
import { Observation, ObservationTag } from "../types/JSONTypes";
import { LogType, SensorType } from "../types/SensorTypeEnums";
import Plus from "../assets/Plus.svg"
import FrontArrow from "../assets/FrontArrow.svg";
import {AddLogButton} from "./AddLogButton";
import { height } from "highcharts";

interface ObservationPanelProps {
    sensorType: SensorType;
    observations?: Observation[];
}
const ObservationPanel = ({sensorType, observations}: ObservationPanelProps) => {

    const observationPanelStyle = {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        padding: '1em',
        textAlign: 'left' as const,
        backgroundColor: 'var(--foreground-color, #ffffff)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
    }

    const panelHeader = {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: 'space-between'
    }

    const observationTitle = {
        fontWeight: '600',
        fontSize: '1.2em',
        marginBottom: '0.2em',
    }

    const observationDescription = {
        marginBottom: '1em',
    }

    function addObservation() {
        console.log("Add Observation clicked");
    }
    return (
        <div style={observationPanelStyle}>
            <div style={panelHeader}>
                <p>{sensorType} Observations</p>
                <AddLogButton logType={LogType.OBSERVATION} onClick={addObservation}/>
            </div>
            <div>
                {observations?.map((observation) => (
                    <div key={observation.Observation_ID}>
                        <p style={observationTitle}>
                        {new Date(observation.TimeStamp).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                        </p>
                        <p
                            style={{
                                ...observationDescription,
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {observation.Description}
                        </p>
                    </div>
                ))}
            </div>
                <img
                    src={FrontArrow}
                    alt="All Observations"
                    style={{ display: "block", marginLeft: "auto" }}
                />
        </div>
    );
};


export { ObservationPanel };
