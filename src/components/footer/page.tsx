"use client";

import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="grid grid-cols gap-3 p-10 bg-violet-600 text-gray-200 rounded-t-3xl">
            <div className="grid lg:grid-cols-3 md:grid-cols-3 p-5 gap-2">
                <div className="flex flex-col gap-3 p-5 items-center">
                    <span className="text-4xl">About</span>
                    <div className="flex flex-col gap-2 items-start text-lg pl-4">
                        <a href="" className="hover:underline">Home</a>
                        <a href="" className="hover:underline">About</a>
                        <a href="" className="hover:underline">Mission/Aim</a>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-5 items-center text-lg">
                    <span className="text-4xl">News</span>
                    <div className="flex flex-col gap-2 items-start pl-3">
                        <a href="" className="hover:underline">Newsletter</a>
                        <a href="" className="hover:underline">Space</a>
                        <a href="" className="hover:underline">Tech</a>
                        <a href="" className="hover:underline">Workshops</a>
                        <a href="" className="hover:underline">Aviation</a>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-5 items-center text-lg">
                    <span className="text-4xl">Contact</span>
                    <div className="flex flex-col gap-2 items-start">
                        <a href="" className="hover:underline">Career</a>
                        <a href="" className="hover:underline">Founders</a>
                        <a href="" className="hover:underline">Team</a>
                        <a href="" className="hover:underline">Donate</a>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="flex flex-col-reverse items-center gap-3 lg:flex-row md:flex-row justify-between p-3">
                <div>
                    <p className="text-md">© 2025 SkyDark. All rights reserved.</p>
                </div>
                <div className="flex flex-row gap-5 text-2xl text-gray-100">
                    <a href=""><FaInstagram/></a>
                    <a href=""><FaLinkedin/></a>
                    <a href=""><FaYoutube/></a>
                </div>
                <div>
                    <span className="hover:cursor-pointer hover:underline">Terms & Condition</span>
                    <span className="mx-3">|</span>
                    <span className="hover:cursor-pointer hover:underline">Privacy Policy</span>
                </div>
            </div>
        </footer>
    );
}