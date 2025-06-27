import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth()

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()

  // Use `user` to render user details or create UI elements
  return (
    <div className='p-20'>
      <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>Welcome to the SkyDark</h1>
      <p className='text-lg'>Hello, {user?.fullName || 'User'}!</p>
      <p className='text-sm text-gray-500'>Your email: {user?.emailAddresses[0]?.emailAddress}</p>
      <p className='text-sm text-gray-500'>User ID: {user?.id}</p>
      </div>
    </div>
  );
}