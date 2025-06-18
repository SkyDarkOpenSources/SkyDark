"use client";
import {
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { FaBars } from "react-icons/fa";

export default function Navbar() {

    const { isSignedIn } = useUser();

    if (!isSignedIn){
        return(
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
                    <div className="lg:visible md:visible invisible flex justify-center items-center">
                        <SignInButton />
                    </div>
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