import { Routes, Route } from "react-router-dom";
import "./index.css";
import Portal from "./pages/Portal";
import StudentPortal from "./pages/StudentPortal";
import AdminPortal from "./pages/AdminPortal";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/student-portal" element={<StudentPortal />} />
      <Route path="/admin-portal" element={<AdminPortal />} />
    </Routes>
  );
};

export default App;
