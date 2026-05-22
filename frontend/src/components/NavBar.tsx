import React from "react";
import logo from "../assets/images/logo.png";
import GetStarted from "./Buttons/GetStarted";

const Navbar = () => {
  return (
    <nav className="w-full bg-custom-orange text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <img src={logo} alt="Logo" className="w-auto h-12" />

        <ul className="hidden md:flex gap-6 text-sm font-normal">
          <li className=" hover-text-orange text-black cursor-pointer">
            Features
          </li>
          <li className=" hover-text-orange text-black cursor-pointer">
            How it Works
          </li>
          <li className=" hover-text-orange text-black cursor-pointer">
            Pricing
          </li>
          <li className=" hover-text-orange text-black cursor-pointer">
            Testimonials
          </li>
        </ul>
        <div className="flex-row gap-4 flex items-center">
          <p className="hover-text-orange cursor-pointer text-black text-sm ">
            Sign In
          </p>
          <GetStarted />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
