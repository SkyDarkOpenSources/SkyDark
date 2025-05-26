import { provide } from "../../data";
import TextScramble from "@/components/TextScramble/page";
import { div } from "framer-motion/client";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";


export default function Home(){
  return(
    <div className="flex flex-col p-4 font-mono">
      <main className="h-screen place-content-center">
        <div className="flex flex-col file:justify-center place-items-center">
          <div className="justify-center place-items-center text-4xl border">
            <img src="SkyDarkLogo.png" alt="" 
            className="h-72 w-72 rounded-full object-cover mx-auto"
            />
          </div>
          <div className="flex flex-col border p-10 justify-center place-items-center gap-3">
            <div className="flex flex-row justify-center place-items-center gap-4 text-5xl text-teal-300">
              <TextScramble
                text="Welcome to SkyDark"
                className=""
              />
            </div>
            <div>
              <p>A space-tech company that aims to build model-rockets, drones and aircrafts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}