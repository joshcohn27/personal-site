export type LoginSuccessResponseType = {
    Token: string;
    User: {
        User_ID: string;
        First_Name: string;
        Last_Name: string;
        Email: string;
        Phone: string;
        Death_Notify_Email: boolean;
        Death_Notify_Phone: boolean;
        Death_Notify_Application: boolean;
        Swarm_Notify_Email: boolean;
        Swarm_Notify_Phone: boolean;
        Swarm_Notify_Application: boolean;
        Cleansing_Flight_Notify_Email: boolean;
        Cleansing_Flight_Notify_Phone: boolean;
        Cleansing_Flight_Notify_Application: boolean;
        Organization_ID: string;
    }
};

export type AllHiveDataRequest = {
    Hive_ID: string;
    StartDate: string;
    EndDate: string;
    User: {
        User_ID: string | undefined;
        Organization_ID: string | undefined;
    }
}

export type HiveDataResponse = {
    Hive_ID: string;
    Hive_Name: string;
    Hive_Data: [HiveDataContent];
};

export type HiveDataContent = {
    TimeStamp: string;
    Outside_Temperature: string;
    Outside_Humidity: string;
    Temperature: string;
    Humidity: string;
    Carbon_Dioxide: string;
    Volume: string;
    Weight: string;
};

export type AllHiveDataResponse = {
    Hive_ID: string;
    Hive_Name: string;
    Hive_Data: HiveDataContent[];
}

export type SensorDataResponseType = {
    Hive_ID: number;
    Generic_Data: GenericData[];
}


/*
    eg. 
    “TimeStamp” : “YYYY-MM-DD HH24:MI:SS”,
    “Outside_Humidity” : “###.##”,
    “Humidity” : “###.##”,
*/
export type GenericData = {
    TimeStamp: string;
    OutsideData: string;
    InsideData: string;
}


export type Observation = {
    Observation_ID: string;
    TimeStamp: string;
    Description: string;
    Tags: ObservationTag[];
}

export type ObservationTag = {
    Tag_ID: string;
    Tag: string;
}