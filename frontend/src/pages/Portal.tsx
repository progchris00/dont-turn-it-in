import React from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { GraduationCap, UserCheck, LayoutDashboard } from "lucide-react";

const Portal = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-1 gap-6 px-4 text-center">
        <div className="flex items-center gap-2 bg-orange-100 px-6 py-2 rounded-md text-orange-600 font-semibold text-sm">
          <LayoutDashboard size={16} />
          CHOOSE YOUR PORTAL
        </div>

        <h2 className="text-2xl font-medium">Select your Role</h2>

        <p className="text-md font-light max-w-md">
          Access the dashboard tailored to your needs. Pick a role to <br />
          explore the platform.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <Link
            to="/student-portal"
            className="flex flex-col justify-between bg-white border border-orange-200 rounded-lg p-6 w-56 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-start">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-md mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Student</h3>
              <p className="text-start text-sm text-gray-600 mb-4">
                Submit assignments, track deadlines, receive feedback, and view
                your academic progress dashboard.
              </p>
            </div>
            <span className="text-sm text-orange-600 font-medium mt-auto flex items-center gap-1">
              Enter Dashboard →
            </span>
          </Link>

          <Link
            to="/admin-portal"
            className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg p-6 w-56 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-start">
              <div className="bg-gray-200 text-gray-700 p-3 rounded-md mb-4">
                <UserCheck size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Administrator</h3>
              <p className="text-start text-sm text-gray-600 mb-4">
                Monitor student submissions, analyze AI usage patterns, and get
                predictive insights for your classroom.
              </p>
            </div>
            <span className="text-gray-700 font-medium mt-auto text-sm flex items-center gap-1">
              Enter Dashboard →
            </span>
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 flex flex-row gap-1 cursor-pointer">
          Want to see a quick demo?{" "}
          <div className="text-orange-600 font-medium">Explore as a Guest</div>
        </p>
      </div>
    </div>
  );
};

export default Portal;
