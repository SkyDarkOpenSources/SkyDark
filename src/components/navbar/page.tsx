"use client";
import {
  SignInButton,
  SignUpButton,
  SignedOut,
  SignedIn,
  UserButton,
} from '@clerk/nextjs'
import { FaBars } from "react-icons/fa";

export default function Navbar() {


    return (
        <nav className="p-5 flex flex-row-3 justify-between bg-transparent backdrop:blur-lg ">
            <div className="text-3xl font-semi-bold text-slate-100 font-sans">
                SkyDark
            </div>
            <div className="flex flex-rows-2 text-xl font-sans gap-2 text-gray-100">
                <div className="flex flex-row-6 lg:visible md:visible gap-4">
                    <div className="lg:visible md:visible invisible flex justify-center items-center">
                        <a href="">Home</a>
                    </div>
                    <div className="lg:visible md:visible invisible flex justify-center items-center">
                        <a href="">About</a>
                    </div>
                    <div className="lg:visible md:visible invisible flex justify-center items-center">
                        <a href="">Donate</a>
                    </div>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton></SignInButton>
                        <SignUpButton></SignUpButton>
                    </SignedOut>
                </div>
                <div className="lg:hidden md:hidden visible"> 
                    <a href="">
                        <FaBars className="text-3xl"
                        />
                    </a>
                </div>   
            </div>
        </nav>
    );
}