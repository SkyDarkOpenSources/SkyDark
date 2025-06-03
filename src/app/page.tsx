import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4"> 
      <main className="flex flex-col h-auto items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center h-96 w-96 mb-10">
          <Image 
           src="/SkyDark.png"
           alt="SkyDark Logo"
           width={348}
           height={348}
          />
        </div>
        <div className="flex flex-col gap-3 text-3xl font-mono text-gray-200 lg:text-6xl md:text-4xlb">  
           <div className='text-center'>
              Welcome to SkyDark
           </div>
           <div className='text-2xl text-gray-500 text-center'>| Space-tech company | Drones | Model-Rockets |</div>
        </div>
      </main>
    </div>
  );
}  