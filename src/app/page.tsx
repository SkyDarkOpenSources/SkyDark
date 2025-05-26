import { provide } from "../../data";
import TextScramble from "@/components/TextScramble/page";
import { div } from "framer-motion/client";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";


export default function Home(){
  return(
    <div className="flex flex-col p-4 font-mono">
      <main className="h-screen place-content-center">
        <div className="flex flex-col justify-center place-items-center">
          <div className="flex flex-col justify-center place-items-center text-4xl">
            <img src="vercel.svg" alt="" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-center place-items-center gap-4 text-5xl text-teal-300">
              <TextScramble
                text="Welcome to SkyDark"
                className=""
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}