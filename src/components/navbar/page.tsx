import { FaBars } from "react-icons/fa";
import Sidebar from "../sidebar/page";

const sidebar = <Sidebar />;

export default function Navbar(){
    return (
        <nav className="fixed bg-transparent h-auto w-full p-4 text-white">
            <div className="flex flex-row-3 justify-between">
                <div className="text-3xl">
                    <a href="">SkyDark</a>
                </div>
                <div className="flex flex-row-3 gap-5 invisible lg:visible md:visible text-lg">
                    <div>
                        <a href="">Home</a>
                    </div>
                    <div>
                        <a href="">About</a>
                    </div>
                    <div>
                        <a href="">Contact</a>
                    </div>
                </div>
                <div className="text-3xl visible lg:hidden md:hidden">
                    <a href="sidebar"><FaBars /></a>
                </div>
            </div>
        </nav>
    );
}