import Image from "next/image";
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function Menubar(){
    return(
        <div className="flex flex-col p-10">
          <main></main>
        </div>
    );
}