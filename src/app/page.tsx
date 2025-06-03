import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex flex-col p-4'>
      <main className='flex flex-col h-screen items-center justify-center'>
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
          <div className='grid grid-flow-col grid-rows-2 p-10 justify-center gap-5 pt-10'>
            <div className='flex justify-center'>
              <Image
                src="/SkyDark.png"
                alt="SkyDark Logo"
                width={300}
                height={300}
                className="rounded-full"
              />
            </div>
            <div className='flex flex-col gap-4 text-center'>
              <div className='text-5xl text-cyan-300 lg:text-7xl md:6xl font-mono'>
                Welcome to SkyDark
              </div>
              <div className='text-2xl text-gray-400'>
                <p>| Space-Tech | Drones | Model-rockets |</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}  