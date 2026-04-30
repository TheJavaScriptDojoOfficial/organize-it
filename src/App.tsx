import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import OrganizerPage from "./pages/OrganizerPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrganizerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}
