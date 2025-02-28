import { SignedIn, SignIn, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="font-white">
      <h1>Home</h1>
      <SignOutButton>
        <SignInButton />
      </SignOutButton>

      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
}
