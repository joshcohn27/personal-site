import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DashboardPage } from "./pages/DashboardPage";
import { DataPage } from "./pages/DataPage";
import { SensorType } from "./types/SensorTypeEnums";
import { SettingsPage } from "./pages/SettingsPage";
import { InspectionPage } from "./pages/InspectionPage";
import { ObservationPage } from "./pages/ObservationPage";

function Beehive() {
  return (
    <>
      <Header />

      <div style={{ padding: "1rem 2rem 0 2rem" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.65rem 1rem",
            borderRadius: "999px",
            textDecoration: "none",
            color: "inherit",
            border: "1px solid rgba(0,0,0,0.15)",
            fontWeight: 500,
            background: "#fff",
          }}
        >
          Back to Main Site
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="landing" element={<Navigate to="dashboard" replace />} />
        <Route path="register" element={<Navigate to="dashboard" replace />} />
        <Route path="login" element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="SettingsPage" element={<SettingsPage />} />
        <Route
          path="Temperature/:id"
          element={<DataPage sensorType={SensorType.TEMPERATURE} />}
        />
        <Route
          path="Humidity/:id"
          element={<DataPage sensorType={SensorType.HUMIDITY} />}
        />
        <Route
          path="CarbonDioxide/:id"
          element={<DataPage sensorType={SensorType.CARBON_DIOXIDE} />}
        />
        <Route
          path="Weight/:id"
          element={<DataPage sensorType={SensorType.WEIGHT} />}
        />
        <Route
          path="Volume/:id"
          element={<DataPage sensorType={SensorType.VOLUME} />}
        />
        <Route path="inspections/:id" element={<InspectionPage />} />
        <Route path="observations/:id" element={<ObservationPage />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default Beehive;