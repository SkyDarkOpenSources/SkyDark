import TextScramble from "@/components/TextScramble/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center text-7xl text-cyan-700 font-light">
        <TextScramble
          text="Welcome to SkyDark"
        />
      </div>
    </main>
  );
}  