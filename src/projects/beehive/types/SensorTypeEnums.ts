export enum SensorType {
    TEMPERATURE = "Temperature",
    HUMIDITY = "Humidity",
    CARBON_DIOXIDE = "Carbon Dioxide",
    VOLUME = "Volume",
    WEIGHT = "Weight"
}

export enum LogType {
    OBSERVATION = "Observation",
    INSPECTION = "Inspection"
}

// map for symbol pairing of sensor types
export const SENSOR_SYMBOL: Record<SensorType, string> = {
  [SensorType.TEMPERATURE]: "°F",
  [SensorType.HUMIDITY]: "%",
  [SensorType.CARBON_DIOXIDE]: "ppm",
  [SensorType.VOLUME]: "L",
  [SensorType.WEIGHT]: "lbs",
};

export const SENSOR_ROUTE: Record<SensorType, string> = {
    [SensorType.TEMPERATURE]: "Temperature",
    [SensorType.HUMIDITY]: "Humidity",
    [SensorType.CARBON_DIOXIDE]: "CarbonDioxide",
    [SensorType.VOLUME]: "Volume",
    [SensorType.WEIGHT]: "Weight"
}

export const SENSOR_ENDPOINT: Record<SensorType, string> = {
    [SensorType.TEMPERATURE]: "/Temperature",
    [SensorType.HUMIDITY]: "/Humidity",
    [SensorType.CARBON_DIOXIDE]: "/CarbonDioxide",
    [SensorType.VOLUME]: "/Volume",
    [SensorType.WEIGHT]: "/Weight"
}

export const SENSOR_JSON_KEYS: Record<SensorType, {
    insideKey: string;        // e.g. "Temperature"
    outsideKey?: string;       // e.g. "Outside_Temperature"
}> = {
    [SensorType.TEMPERATURE]: {
        insideKey: "Temperature",
        outsideKey: "Outside_Temperature",
    },
    [SensorType.HUMIDITY]: {
        insideKey: "Humidity",
        outsideKey: "Outside_Humidity",
    },
    [SensorType.CARBON_DIOXIDE]: {
        insideKey: "Carbon_Dioxide",
    },
    [SensorType.VOLUME]: {
        insideKey: "Volume",
    },
    [SensorType.WEIGHT]: {
        insideKey: "Weight",
    },
};


export enum StatusType {
    NORMAL = "Normal",
    HIGH = "High",
    LOW = "Low",
    CRITICAL = "Critical",
    NONE = "None"
}