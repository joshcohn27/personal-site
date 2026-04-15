import React, { useState, useEffect, useMemo } from "react";
import "./DashboardPage.css";
import Graph from "../components/Graph";
import { SensorType, SENSOR_SYMBOL, StatusType, SENSOR_ENDPOINT } from "../types/SensorTypeEnums";
import { useParams, useNavigate } from "react-router-dom";
import { DataPanel } from "../components/DataPanel";
import { ObservationPanel } from "../components/ObservationPanel";
import BackArrow from "../assets/BackArrow.svg";
import { fetchJson, ApiError } from "../utils/FetchUtil";
import { dateToSqlTimestamp } from "../utils/SQLUtils";
import { GenericData, SensorDataResponseType } from "../types/JSONTypes";
import { getUser } from "../utils/AuthStore";
import { MessagePopup, MessageType } from "../components/MessagePopup";
import { useCacheStore } from "../utils/CacheHandler";
import { useSettingsStore } from "../utils/SettingsStore";

/**
 * THIS PAGE IS A CATCHALL FOR EVERY SINGLE DATA PAGE WE HAVE
 * TEMPERATURE, HUMIDITY, VOLUME, ETC
 *
 * MUST PASS IN SENSORTYPE PROP, AND THEN THE API CALL SHOULD BE MADE BASED ON THAT
 */

interface DataPageProps {
    sensorType: SensorType;
}

const DataPage = ({ sensorType }: DataPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user] = useState(getUser());
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [data, setData] = useState<any[]>([]);
    const { getCache } = useCacheStore();
    const { celsius } = useSettingsStore();

    const resolveSensorValue = (record: Record<string, any>, key: string) => {
        const underscoreKey = key.replace(/ /g, "_");
        const spacedKey = key.replace(/_/g, " ");

        return (
            record[key] ??
            record[underscoreKey] ??
            record[spacedKey] ??
            null
        );
    };

    function getDataFromRange(startDate: Date, endDate: Date) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (startDate > endDate) {
            setError("ERROR: Start date must be before end date.");
            return;
        }

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        if (endDate > endOfToday) {
            setError("ERROR: End date cannot be in the future.");
            return;
        }

        if (startDate == endDate) {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 0);
        }

        setStartDate(start);
        setEndDate(end);

        setError("");
        fetchDataFromRange(start, end);
    }

    function fetchDataFromRange(startDate: Date, endDate: Date) {
        console.log("Fetching data for range:\n", startDate, "\n", endDate);

        fetchJson<SensorDataResponseType>(SENSOR_ENDPOINT[sensorType], {
            method: "POST",
            body: {
                Hive_ID: id,
                StartDate: dateToSqlTimestamp(startDate),
                EndDate: dateToSqlTimestamp(endDate),
                User: {
                    User_ID: user?.userID,
                    Organization_ID: user?.organizationID
                }
            },
        })
            .then((response) => {
                const responseKey = `${sensorType}_Data` as keyof SensorDataResponseType;
                const genericData = (response as SensorDataResponseType)[responseKey] as GenericData[];

                const fetchedData = genericData.map((entry: GenericData) => {
                    const record = entry as Record<string, number | string>;

                    return {
                        TimeStamp: record["TimeStamp"],
                        [sensorType]: resolveSensorValue(record, sensorType),
                        [`Outside_${sensorType}`]: resolveSensorValue(record, `Outside_${sensorType}`)
                    };
                });

                console.log(fetchedData);
                setData(fetchedData);
            })
            .catch((err: ApiError) => {
                if (err.status === 400) {
                    setError("400: There is no data for inputted range");
                } else {
                    setError(err.message);
                }
            });
    }

    const tempObservations = [
        {
            Observation_ID: "1",
            Tags: [],
            Description: "The hive's temperature is holding steady around 95°F, which tells me the colony is regulating the brood nest well. I’ve noticed plenty of bright yellow and orange pollen coming in, suggesting a strong forage nearby and healthy brood rearing. Toward late afternoon, some bearding forms on the landing board — likely just the bees cooling off and ventilating the hive in the warm weather.",
            TimeStamp: "2024-06-15T14:00:00Z"
        },
        {
            Observation_ID: "2",
            Tags: [],
            Description: "The hive's temperature is holding steady around 95°F, which tells me the colony is regulating the brood nest well. I’ve noticed plenty of bright yellow and orange pollen coming in, suggesting a strong forage nearby and healthy brood rearing. Toward late afternoon, some bearding forms on the landing board — likely just the bees cooling off and ventilating the hive in the warm weather.",
            TimeStamp: "2024-06-15T13:30:00Z"
        }
    ];

    const title = `Beehive ${sensorType}`;

    const dataPanelRowStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap: "1em",
        justifyContent: "space-between",
    };

    useEffect(() => {
        console.log("Cache data for hive " + id + ": ", getCache(String(id)));

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        getDataFromRange(todayStart, todayEnd);
    }, [id, sensorType]);

    const backToDashboard = () => {
        navigate("/dashboard", { replace: true });
    };

    function getDataTrend() {
        if (!data || data.length === 0) return 0;

        const values = data
            .map((entry: any) => Number(resolveSensorValue(entry, sensorType)))
            .filter((value: number) => Number.isFinite(value));

        if (values.length === 0) return "No data selected";

        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        const trend = (lastValue - firstValue).toFixed(1);

        return parseFloat(trend) >= 0 ? `+${trend}` : `${trend}`;
    }

    const currentReading = useMemo(() => {
        const latestEntry = data.length > 0 ? data[data.length - 1] : null;
        const latestValue = latestEntry ? resolveSensorValue(latestEntry, sensorType) : null;
        const cacheValue = getCache(String(id))?.[sensorType]?.value;

        return latestValue ?? cacheValue ?? "--";
    }, [data, sensorType, id, getCache]);

    const lastUpdatedLabel = useMemo(() => {
        const latestEntry = data.length > 0 ? data[data.length - 1] : null;
        const latestTimestamp = latestEntry?.TimeStamp;
        const cacheTimestamp = getCache(String(id))?.[sensorType]?.timestamp;
        const timestamp = latestTimestamp ?? cacheTimestamp;

        return `Last updated ${timestamp ? new Date(timestamp).toLocaleTimeString() : "N/A"}`;
    }, [data, sensorType, id, getCache]);

    return (
        <div>
            <div className="data-page-responsive">
                <div>
                    <div
                        style={{ display: "flex", alignItems: "center", gap: "0.5em", marginBottom: "1em", cursor: "pointer" }}
                        onClick={backToDashboard}
                    >
                        <img src={BackArrow} alt="Back to Dashboard" />
                        <p>Back to Dashboard</p>
                    </div>
                    <h1 style={{ fontWeight: 600, fontSize: "clamp(1.8rem, 4vw, 3rem)", margin: 0 }}>{title}</h1>
                </div>

                <div style={dataPanelRowStyle}>
                    <DataPanel
                        title={`Current ${sensorType}`}
                        dataSnapshot={currentReading}
                        unit={SENSOR_SYMBOL[sensorType]}
                        lastUpdated={lastUpdatedLabel}
                        status={StatusType.NORMAL}
                    />

                    <DataPanel
                        title={`Trend`}
                        dataSnapshot={getDataTrend()}
                        unit={SENSOR_SYMBOL[sensorType]}
                    />
                </div>

                <div>
                    <ObservationPanel observations={tempObservations} sensorType={sensorType} />
                </div>

                <Graph
                    title={sensorType}
                    dataObject={data}
                    dateRange={{ start: startDate, end: endDate }}
                    sensorType={sensorType}
                    getDateRange={getDataFromRange}
                    allowDateSelection={true}
                />
            </div>
            {error && <MessagePopup type={MessageType.ERROR} message={error} onClose={() => setError("")} />}
        </div>
    );
};

export { DataPage };