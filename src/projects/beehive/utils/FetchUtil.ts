export class ApiError extends Error {
  status: number;
  url: string;
  body?: unknown;

  constructor(message: string, args: { status: number; url: string; body?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = args.status;
    this.url = args.url;
    this.body = args.body;
  }
}

type FetchJsonOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
  baseUrl?: string;
};

type MockTag = {
  Tag_ID?: string | number;
  Tag?: string;
};

type MockObservation = {
  Observation_ID: string;
  TimeStamp: string;
  Description: string;
  Tags: MockTag[];
};

type MockInspection = {
  Inspection_ID: string;
  TimeStamp: string;
  Description: string;
  Tags: MockTag[];
};

type MockHiveDataPoint = {
  TimeStamp: string;
  Outside_Temperature: number | string;
  Outside_Humidity: number | string;
  Temperature: number | string;
  Humidity: number | string;
  Carbon_Dioxide: number | string;
  Volume: number | string;
  Weight: number | string;
};

type MockHive = {
  Hive_ID: string;
  Hive_Name: string;
  Hive_Data: MockHiveDataPoint[];
  Observations: MockObservation[];
  Inspections: MockInspection[];
};

type MockUser = {
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
};

type MockApiData = {
  User: MockUser;
  Hives: MockHive[];
};

const MOCK_STORAGE_KEY = "beemonitor_mock_api_v1";
let mockDataPromise: Promise<MockApiData> | null = null;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const toTimestamp = (value: string | undefined | null): number => {
  if (!value) return 0;
  const normalized = value.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const toNumber = (value: number | string | undefined | null): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeHiveDataPoint = (entry: MockHiveDataPoint): MockHiveDataPoint => ({
  TimeStamp: entry.TimeStamp,
  Outside_Temperature: toNumber(entry.Outside_Temperature),
  Outside_Humidity: toNumber(entry.Outside_Humidity),
  Temperature: toNumber(entry.Temperature),
  Humidity: toNumber(entry.Humidity),
  Carbon_Dioxide: toNumber(entry.Carbon_Dioxide),
  Volume: toNumber(entry.Volume),
  Weight: toNumber(entry.Weight),
});

const normalizeMockData = (data: MockApiData): MockApiData => ({
  User: {
    ...data.User,
    User_ID: String(data.User.User_ID),
    Organization_ID: String(data.User.Organization_ID),
  },
  Hives: data.Hives.map((hive) => ({
    ...hive,
    Hive_ID: String(hive.Hive_ID),
    Hive_Data: hive.Hive_Data.map(normalizeHiveDataPoint),
    Observations: hive.Observations.map((observation) => ({
      ...observation,
      Observation_ID: String(observation.Observation_ID),
      Tags: Array.isArray(observation.Tags) ? observation.Tags : [],
    })),
    Inspections: hive.Inspections.map((inspection) => ({
      ...inspection,
      Inspection_ID: String(inspection.Inspection_ID),
      Tags: Array.isArray(inspection.Tags) ? inspection.Tags : [],
    })),
  })),
});

const getBodyObject = (body: unknown): Record<string, any> => {
  if (!body || typeof body !== "object") return {};
  return body as Record<string, any>;
};

const getHiveById = (data: MockApiData, hiveId: string | number | undefined): MockHive | undefined => {
  return data.Hives.find((hive) => String(hive.Hive_ID) === String(hiveId));
};

const filterHiveDataByRange = (
  hiveData: MockHiveDataPoint[],
  startDate?: string,
  endDate?: string
): MockHiveDataPoint[] => {
  const start = toTimestamp(startDate ?? null);
  const end = toTimestamp(endDate ?? null);

  return hiveData.filter((entry) => {
    const ts = toTimestamp(entry.TimeStamp);
    if (start && ts < start) return false;
    if (end && ts > end) return false;
    return true;
  });
};

const getNextNumericId = (items: Array<{ Observation_ID?: string; Inspection_ID?: string }>): string => {
  const max = items.reduce((currentMax, item) => {
    const raw = item.Observation_ID ?? item.Inspection_ID ?? "0";
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? Math.max(currentMax, numeric) : currentMax;
  }, 0);

  return String(max + 1);
};

const loadMockData = async (): Promise<MockApiData> => {
  if (mockDataPromise) {
    return mockDataPromise;
  }

  mockDataPromise = (async () => {
    const fromStorage = window.localStorage.getItem(MOCK_STORAGE_KEY);
    if (fromStorage) {
      return normalizeMockData(JSON.parse(fromStorage) as MockApiData);
    }

    const response = await fetch("/mock-api.json", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new ApiError("Unable to load local mock data.", {
        status: response.status,
        url: "/mock-api.json",
      });
    }

    const data = normalizeMockData((await response.json()) as MockApiData);
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
    return data;
  })();

  return mockDataPromise;
};

const saveMockData = (data: MockApiData) => {
  const normalized = normalizeMockData(data);
  window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(normalized));
  mockDataPromise = Promise.resolve(normalized);
};

const buildLoginResponse = (user: MockUser) => ({
  Token: "static-demo-token",
  User: clone(user),
});

const buildSessionUserPatch = (body: Record<string, any>) => ({
  User_ID: String(body.User_ID ?? "21"),
  First_Name: String(body.First_Name ?? "Josh"),
  Last_Name: String(body.Last_Name ?? "Cohn"),
  Email: String(body.Email ?? "josh@example.com"),
  Phone: String(body.Phone ?? "5551234567"),
  Death_Notify_Email: Boolean(body.Death_Notify_Email),
  Death_Notify_Phone: Boolean(body.Death_Notify_Phone),
  Death_Notify_Application: Boolean(body.Death_Notify_Application),
  Swarm_Notify_Email: Boolean(body.Swarm_Notify_Email),
  Swarm_Notify_Phone: Boolean(body.Swarm_Notify_Phone),
  Swarm_Notify_Application: Boolean(body.Swarm_Notify_Application),
  Cleansing_Flight_Notify_Email: Boolean(body.Cleansing_Flight_Notify_Email),
  Cleansing_Flight_Notify_Phone: Boolean(body.Cleansing_Flight_Notify_Phone),
  Cleansing_Flight_Notify_Application: Boolean(body.Cleansing_Flight_Notify_Application),
  Organization_ID: String(body.Organization_ID ?? "1"),
});

const buildSensorResponse = (hive: MockHive, sensorName: string, filteredData: MockHiveDataPoint[]) => {
  if (sensorName === "/Temperature") {
    return {
      Hive_ID: Number(hive.Hive_ID),
      Temperature_Data: filteredData.map((entry) => ({
        TimeStamp: entry.TimeStamp,
        Temperature: toNumber(entry.Temperature),
        Outside_Temperature: toNumber(entry.Outside_Temperature),
      })),
    };
  }

  if (sensorName === "/Humidity") {
    return {
      Hive_ID: Number(hive.Hive_ID),
      Humidity_Data: filteredData.map((entry) => ({
        TimeStamp: entry.TimeStamp,
        Humidity: toNumber(entry.Humidity),
        Outside_Humidity: toNumber(entry.Outside_Humidity),
      })),
    };
  }

  if (sensorName === "/CarbonDioxide") {
    return {
      Hive_ID: Number(hive.Hive_ID),
      "Carbon Dioxide_Data": filteredData.map((entry) => ({
        TimeStamp: entry.TimeStamp,
        Carbon_Dioxide: toNumber(entry.Carbon_Dioxide),
        "Carbon Dioxide": toNumber(entry.Carbon_Dioxide),
      })),
    };
  }

  if (sensorName === "/Volume") {
    return {
      Hive_ID: Number(hive.Hive_ID),
      Volume_Data: filteredData.map((entry) => ({
        TimeStamp: entry.TimeStamp,
        Volume: toNumber(entry.Volume),
      })),
    };
  }

  return {
    Hive_ID: Number(hive.Hive_ID),
    Weight_Data: filteredData.map((entry) => ({
      TimeStamp: entry.TimeStamp,
      Weight: toNumber(entry.Weight),
    })),
  };
};

const handleMockRequest = async <T>(pathOrUrl: string, options: FetchJsonOptions): Promise<T> => {
  const method = (options.method ?? "GET").toUpperCase();
  const url = pathOrUrl.startsWith("http") ? new URL(pathOrUrl).pathname : pathOrUrl;
  const body = getBodyObject(options.body);
  const data = await loadMockData();

  if (url === "/Login" || url === "/Register") {
    return buildLoginResponse(data.User) as T;
  }

  if (url === "/Update" && method === "PUT") {
    const updatedUser = buildSessionUserPatch(body);
    const nextData: MockApiData = {
      ...data,
      User: updatedUser,
    };
    saveMockData(nextData);
    return { Result: "User updated" } as T;
  }

  if (url === "/HiveData" && method === "POST") {
    const hive = getHiveById(data, body.Hive_ID);
    if (!hive) {
      throw new ApiError("Hive not found.", { status: 404, url, body });
    }

    const filtered = filterHiveDataByRange(hive.Hive_Data, body.StartDate, body.EndDate);
    if (filtered.length === 0) {
      throw new ApiError("No hive data in that range.", { status: 400, url, body });
    }

    return {
      Hive_ID: hive.Hive_ID,
      Hive_Name: hive.Hive_Name,
      Hive_Data: clone(filtered.map(normalizeHiveDataPoint)),
    } as T;
  }

  if (["/Temperature", "/Humidity", "/CarbonDioxide", "/Volume", "/Weight"].includes(url) && method === "POST") {
    const hive = getHiveById(data, body.Hive_ID);
    if (!hive) {
      throw new ApiError("Hive not found.", { status: 404, url, body });
    }

    const filtered = filterHiveDataByRange(hive.Hive_Data, body.StartDate, body.EndDate);
    if (filtered.length === 0) {
      throw new ApiError("No sensor data in that range.", { status: 400, url, body });
    }

    return buildSensorResponse(hive, url, filtered) as T;
  }

  if (url === "/Observations") {
    const hive = getHiveById(data, body.Hive_ID);
    if (!hive) {
      throw new ApiError("Hive not found.", { status: 404, url, body });
    }

    if (method === "POST") {
      return {
        Hive_ID: hive.Hive_ID,
        Observations: clone(hive.Observations),
      } as T;
    }

    if (method === "PUT") {
      const nextObservation = {
        Observation_ID: getNextNumericId(hive.Observations),
        TimeStamp: String(body.Observation?.Timestamp ?? new Date().toISOString().slice(0, 19).replace("T", " ")),
        Description: String(body.Observation?.Description ?? ""),
        Tags: Array.isArray(body.Observation?.Tags)
          ? body.Observation.Tags.map((tag: Record<string, any>, index: number) => ({
            Tag_ID: String(index + 1),
            Tag: String(tag.Tag ?? ""),
          }))
          : [],
      };

      const nextData: MockApiData = {
        ...data,
        Hives: data.Hives.map((candidate) =>
          candidate.Hive_ID === hive.Hive_ID
            ? { ...candidate, Observations: [...candidate.Observations, nextObservation] }
            : candidate
        ),
      };
      saveMockData(nextData);
      return { Result: "Observation added" } as T;
    }

    if (method === "DELETE") {
      const observationId = String(body.Observation?.Observation_ID ?? body.Observation_ID ?? "");
      const nextData: MockApiData = {
        ...data,
        Hives: data.Hives.map((candidate) =>
          candidate.Hive_ID === hive.Hive_ID
            ? {
              ...candidate,
              Observations: candidate.Observations.filter(
                (observation) => String(observation.Observation_ID) !== observationId
              ),
            }
            : candidate
        ),
      };
      saveMockData(nextData);
      return { Result: "Observation deleted" } as T;
    }
  }

  if (url === "/Inspections") {
    const hive = getHiveById(data, body.Hive_ID);
    if (!hive) {
      throw new ApiError("Hive not found.", { status: 404, url, body });
    }

    if (method === "POST") {
      return {
        Hive_ID: hive.Hive_ID,
        Inspections: clone(hive.Inspections),
      } as T;
    }

    if (method === "PUT") {
      const nextInspection = {
        Inspection_ID: getNextNumericId(hive.Inspections),
        TimeStamp: String(body.Inspection?.TimeStamp ?? new Date().toISOString().slice(0, 19).replace("T", " ")),
        Description: String(body.Inspection?.Description ?? ""),
        Tags: Array.isArray(body.Inspection?.Tags)
          ? body.Inspection.Tags.map((tag: Record<string, any>, index: number) => ({
            Tag_ID: String(index + 1),
            Tag: String(tag.Tag ?? ""),
          }))
          : [],
      };

      const nextData: MockApiData = {
        ...data,
        Hives: data.Hives.map((candidate) =>
          candidate.Hive_ID === hive.Hive_ID
            ? { ...candidate, Inspections: [...candidate.Inspections, nextInspection] }
            : candidate
        ),
      };
      saveMockData(nextData);
      return { Result: "Inspection added" } as T;
    }

    if (method === "DELETE") {
      const inspectionId = String(body.Inspection?.Inspection_ID ?? body.Inspection_ID ?? "");
      const nextData: MockApiData = {
        ...data,
        Hives: data.Hives.map((candidate) =>
          candidate.Hive_ID === hive.Hive_ID
            ? {
              ...candidate,
              Inspections: candidate.Inspections.filter(
                (inspection) => String(inspection.Inspection_ID) !== inspectionId
              ),
            }
            : candidate
        ),
      };
      saveMockData(nextData);
      return { Result: "Inspection deleted" } as T;
    }
  }

  throw new ApiError(`No mock handler exists for ${method} ${url}`, {
    status: 404,
    url,
    body,
  });
};

export async function fetchJson<T>(pathOrUrl: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = 15000 } = options;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await handleMockRequest<T>(pathOrUrl, options);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out.", {
        status: 408,
        url: pathOrUrl,
      });
    }

    throw new ApiError(error instanceof Error ? error.message : "Unexpected request error.", {
      status: 500,
      url: pathOrUrl,
      body: error,
    });
  } finally {
    window.clearTimeout(timer);
  }
}