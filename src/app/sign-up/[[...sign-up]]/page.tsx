import { ClerkProvider, SignUp } from '@clerk/nextjs';

export default async function SignUpPage() {
  return (
    <ClerkProvider>
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
      />
    </ClerkProvider>
  );
}