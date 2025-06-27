"use client"
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
      <div className='flex justify-center p-20'>
        <SignIn />
      </div>
    );
}