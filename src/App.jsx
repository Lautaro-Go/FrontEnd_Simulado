// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CalculoRaices from "./components/CalculoRaices";
import IntegracionPage from "./pages/Integracion";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raices" element={<CalculoRaices />} />
          <Route path="/integracion" element={<IntegracionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
