import Image from "next/image";

export default function Menubar(){
    return(
        <div className="flex flex-col gap-10">
            <main className="flex flex-col-reverse justify-center items-center py-5 gap-3 h-screen">
                <div className="flex flex-col lg:gap-6 md:gap-4 p-4">
                    <span className="text-3xl lg:text-7xl md:text-5xl text-teal-200 text-center font-mono">Welcome to SkyDark</span>
                    <div className="lg:text-2xl md:text-xl text-gray-300 text-center">| Model-Rockets | Drones | Robotics |</div>
                </div>
                <div className="h-60 w-60 lg:h-96 lg:w-96 md:h-80 md:w-80 place-content-center">
                    <Image 
                      src="/favicon.ico"
                      alt="SkyDark"
                      height={1000}
                      width={1000}
                    />
                </div>
            </main>
        </div>
    );
}