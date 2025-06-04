import Image from "next/image";

export default function Menubar(){
    return(
        <div className="flex flex-col gap-10">
            <main className="flex flex-col-reverse justify-center items-center py-5 gap-5 h-screen">
                <div className="flex flex-col gap-6 p-4">
                    <span className="text-4xl lg:text-7xl md:text-5xl text-teal-200 text-center font-mono">Welcome to SkyDark</span>
                    <div className="flex flex-row justify-center gap-5 font-medium text-neutral-900 lg:text-md md:text-md text-sm">
                      <button className="py-1 px-4 rounded-3xl bg-cyan-200 text-gray-900 opacity-80">Model-rockets</button>
                      <button className="py-1 px-4 rounded-3xl bg-cyan-200 text-gray-900 opacity-80">Drones</button>
                      <button className="py-1 px-4 rounded-3xl bg-cyan-200 text-gray-900 opacity-80">Robotics</button>
                    </div>
                </div>
                <div className="h-60 w-60 lg:h-96 lg:w-96 md:h-80 md:w-80 place-content-center">
                    <img src="/favicon.ico" alt="SkyDark" />
                </div>
            </main>
        </div>
    );
}