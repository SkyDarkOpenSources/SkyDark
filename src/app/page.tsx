import React from 'react';
import TextScramble from '@/components/TextScramble/page';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4"> 
      <main className="flex flex-col h-auto items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center h-96 w-96 mb-10">
          <img src="SkyDark.png" alt="" />
        </div>
        <div className="text-3xl font-mono text-gray-200 lg:text-6xl md:text-4xlb">  
          <TextScramble 
           text="Welcome to SkyDark"
          />
        </div>
      </main>
    </div>
  );
}  