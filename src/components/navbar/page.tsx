"use client";

import { FaBars, FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { useState,useEffect } from "react";

export default function Navbar() {

    const [darkMode, setDarkMode] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
      // Check local storage for theme preference
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }
        setIsPageLoaded(true);

    }); 


      // Toggle dark/light mode
    const toggleDarkMode = () => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      document.documentElement.classList.toggle("dark", newDarkMode);
      localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    };

    return (
        <nav className=" p-5 flex flex-row-3 justify-between bg-slate-600">
            <div className="text-3xl font-bold text-slate-100 font-sans">
                SkyDark
            </div>
            <div className="flex flex-rows-2 text-xl font-sans gap-2 text-gray-100">
                <div className="grid grid-cols-3 lg:visible md:visible invisible">
                    <div className="lg:visible md:visible invisible">
                        <a href="">Home</a>
                    </div>
                    <div className="lg:visible md:visible invisible">
                        <a href="">About</a>
                    </div>
                    <div className="lg:visible md:visible invisible">
                        <a href="">Contact</a>
                    </div>
                </div>
                <div className="lg:hidden md:hidden sm:hidden"> 
                    <a href="">
                        <FaBars className="text-3xl" />
                    </a>
                </div>   
            </div>
            <div className="text-3xl font-bold text-slate-100 font-sans">
                <button
                    onClick={toggleDarkMode}
                    className="text-slate-100 hover:cursor-pointer"
                >
                    {darkMode ? <FaSun className="text-3xl" /> : <FaMoon className="text-3xl" />}
                </button>
            </div>
        </nav>
    );
}