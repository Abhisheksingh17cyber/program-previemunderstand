"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white relative overflow-hidden">

      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 text-center space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold tracking-tighter">
            INTERNITY
            <span className="text-neutral-500">-CODES</span>
          </h1>
          <p className="text-neutral-400 text-lg tracking-widest uppercase max-w-lg mx-auto">
            Professional Code Understanding & Preview Environment
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-neutral-200 px-8 text-md font-bold tracking-tight gap-2"
            onClick={() => signIn("google")}
          >
            Start Coding <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-xs text-neutral-600">
            Secure Access via Google Workspace
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 text-neutral-800 text-xs font-mono">
        SECURE • FAST • INTELLIGENT
      </div>
    </main>
  );
}
