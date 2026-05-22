import { Route } from "react-router-dom";
import "./index.css";
import Portal from "./pages/Portal";
import StudentPortal from "./pages/StudentPortal";
import AdminPortal from "./pages/AdminPortal";
import NavBar from "./components/NavBar";

const App = () => {
  return <Route path="/" element={<NavBar />} />;
  return <Route path="/student-portal" element={<StudentPortal />} />;
  return <Route path="/admin-portal" element={<AdminPortal />} />;
};

export default App;
