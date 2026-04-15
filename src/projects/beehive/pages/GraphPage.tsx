
import React, { useMemo , useState } from "react";
import DateTimePicker from "../components/DateTimePicker";
import { SensorType, SENSOR_ENDPOINT } from "../types/SensorTypeEnums";
import { fetchJson, ApiError } from "../utils/FetchUtil";
import { dateToSqlTimestamp } from "../utils/SQLUtils";
import { SensorDataResponseType, HiveDataContent, AllHiveDataResponse } from "../types/JSONTypes";
import { getUser } from "../utils/AuthStore";
import { MessagePopup, MessageType } from "../components/MessagePopup";
import ToggleSwitch from "../components/ToggleSwitch";
import Graph from "../components/Graph";

const GraphPage = () => {

  const [user, setUser] = useState(getUser());
  const [startData, setStartDate] = useState<Date>(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)); // default to 2 weeks ago
  const [endDate, setEndDate] = useState<Date>(new Date()); // default to now
  const [error, setError] = useState("");
  const [isAggregate, setIsAggregate] = useState<boolean>(false);
  const [id, setId] = useState<string>("1");
  const [data, setData] = useState<AllHiveDataResponse | null>(null);
  const temperatureData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.Hive_Data.map(entry => ({
      TimeStamp: entry.TimeStamp,
      Temperature: entry.Temperature,
      Outside_Temperature: entry.Outside_Temperature,
    }));
  }, [data]);

  const humidityData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.Hive_Data.map(entry => ({
      TimeStamp: entry.TimeStamp,
      Humidity: entry.Humidity,
      Outside_Humidity: entry.Outside_Humidity,
    }));
  }, [data]);

  const co2Data = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.Hive_Data.map(entry => ({
      TimeStamp: entry.TimeStamp,
      Carbon_Dioxide: entry.Carbon_Dioxide,
    }));
  }, [data]);

  const volumeData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.Hive_Data.map(entry => ({
      TimeStamp: entry.TimeStamp,
      Volume: entry.Volume,
    }));
  }, [data]);

  const weightData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.Hive_Data.map(entry => ({
      TimeStamp: entry.TimeStamp,
      Weight: entry.Weight,
    }));
  }, [data]);

  const aggregateSeriesConfig = useMemo(
    () => [
      { name: "Temperature", valueKey: "Temperature", color: "#FF6B6B" },
      { name: "Outside Temperature", valueKey: "Outside_Temperature", color: "#FF9F1C" },
      { name: "Humidity", valueKey: "Humidity", color: "#1E88E5" },
      { name: "Outside Humidity", valueKey: "Outside_Humidity", color: "#42A5F5" },
      { name: "Carbon Dioxide", valueKey: "Carbon_Dioxide", color: "#8E24AA" },
      { name: "Volume", valueKey: "Volume", color: "#43A047" },
      { name: "Weight", valueKey: "Weight", color: "#FDD835" },
    ],
    []
  );

    const graphPageStyle: React.CSSProperties = {
        width: "100%",
    };

    const contentWrapperStyle: React.CSSProperties = {
        maxWidth: "80%",
        margin: "2em auto",
        padding: "0 1em",
        display: "flex",
        flexDirection: "column",
        gap: "2em",
    };

    const graphSectionStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(20em, 1fr))",
        gap: "4em",
    };

    const graphContainerStyle: React.CSSProperties = {
        boxShadow: "0 4px 16px #00000022",
        borderRadius: 16,
        backgroundColor: "var(--foreground-color, #ffffff)",

        width: "100%",
        height: "18em",
        padding: "1rem",

        display: "flex",
        flexDirection: "column",
    };

    const graphHeaderStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "var(--foreground-color, #ffffff)",
        padding: "1em",
        borderRadius: "16px",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "start",
        marginBottom: "1em",
    };

  function getDataFromRange(startDate: Date, endDate: Date) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (startDate > endDate) {
            setError("Start date must be before end date");
            return;
        }
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      if (endDate > endOfToday) {
            setError("End date cannot be in the future");
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

        fetchJson<AllHiveDataResponse>("/HiveData", {
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
        .then((data) => {

      const allHiveData = data as AllHiveDataResponse;

      const fetchedData: AllHiveDataResponse = {
        Hive_ID: allHiveData.Hive_ID,
        Hive_Name: allHiveData.Hive_Name,
        Hive_Data: allHiveData.Hive_Data.map((entry: HiveDataContent) => ({
          TimeStamp: entry.TimeStamp,
          Outside_Temperature: entry.Outside_Temperature,
          Outside_Humidity: entry.Outside_Humidity,
          Temperature: entry.Temperature,
          Humidity: entry.Humidity,
          Carbon_Dioxide: entry.Carbon_Dioxide,
          Volume: entry.Volume,
          Weight: entry.Weight,
        })),
      };

      setData(fetchedData);
      console.log(fetchedData);
  })
        .catch((err: ApiError) => {
            if (err.status === 400) {
                setError("Date range is invalid or there is no data for that range");
            } else {
                setError(err.message);
            }
        });
    }

    function combineGraphs() {
      setIsAggregate(isAggregate => !isAggregate);
    }

  return (
    <div style={graphPageStyle}>
      <div style={contentWrapperStyle}>
        <div style={graphHeaderStyle}>
          <DateTimePicker
            getDateRange={getDataFromRange}
          />
          <div>
            <ToggleSwitch
              checked={isAggregate}
              onChange={combineGraphs}
              label="Aggregate"
            />
          </div>
        </div>

        {/*   IF DATA IS TOGGLED AGGREGATE  */ }
        {isAggregate ? (
          <div style={graphSectionStyle}>
            <Graph
              title={"Hive Data Overview"}
              dataObject={data?.Hive_Data ?? []}
              dateRange={{ start: startData, end: endDate }}
              sensorType={SensorType.TEMPERATURE}
              hasOutsideData={false}
              allowOutsideToggle={false}
              allowDateSelection={false}
              getDateRange={getDataFromRange}
              customSeries={aggregateSeriesConfig}
              yAxisLabel={"Measurement Value"}
            />
          </div>
        ) : (
        <>
          <div style={graphSectionStyle}>
            <Graph
              title={"Temperature"}
              dataObject={temperatureData}
              dateRange={{ start: startData, end: endDate }}
              sensorType={SensorType.TEMPERATURE}
              hasOutsideData={true}
              allowOutsideToggle={false}
              allowDateSelection={false}
              getDateRange={getDataFromRange}
            />
          </div>
          <div style={graphSectionStyle}>
            <Graph
              title={"Humidity"}
              dataObject={humidityData}
              dateRange={{ start: startData, end: endDate }}
              sensorType={SensorType.HUMIDITY}
              hasOutsideData={true}
              allowOutsideToggle={false}
              allowDateSelection={false}
              getDateRange={getDataFromRange}
            />
          </div>
          <div style={graphSectionStyle}>
            <Graph
              title={"Carbon Dioxide"}
              dataObject={co2Data}
              dateRange={{ start: startData, end: endDate }}
              sensorType={SensorType.CARBON_DIOXIDE}
              hasOutsideData={false}
              allowOutsideToggle={false}
              allowDateSelection={false}
              getDateRange={getDataFromRange}
            />
          </div>
          <div style={graphSectionStyle}>
            <Graph
              title={"Volume"}
              dataObject={volumeData}
              dateRange={{ start: startData, end: endDate }}
              sensorType={SensorType.VOLUME}
              hasOutsideData={false}
              allowOutsideToggle={false}
              allowDateSelection={false}
              getDateRange={getDataFromRange}
            />
          </div>
          <div style={graphSectionStyle}>
            <Graph
              title={"Weight"}
              dataObject={weightData}
              dateRange={{ start: startData, end: endDate }}
              sensorType={SensorType.WEIGHT}
              hasOutsideData={false}
              allowOutsideToggle={false}
              allowDateSelection={false}
              getDateRange={getDataFromRange}
            />
          </div>
        </>
        )}
      </div>
      {error && (
        <MessagePopup
          message={error}
          type={MessageType.ERROR}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
};

export default GraphPage;