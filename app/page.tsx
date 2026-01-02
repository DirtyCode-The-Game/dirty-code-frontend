'use client'
import { Button } from "@heroui/react";
import { useGame } from "@/context/GameContext";
import Image from "next/image";

export default function Home() {
  const { login, isLoading } = useGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-black selection:bg-primary/30">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] mix-blend-screen opacity-50 pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] mix-blend-screen opacity-50 pointer-events-none animate-pulse-slow delay-1000"></div>

      {/* Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Login Card */}
      <div className="z-10 w-full max-w-md relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-8">

          {/* Logo Section */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl border border-white/5 bg-black">
            <Image
              src="/logo.jpeg"
              alt="DirtyCode Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 font-mono text-sm md:text-base">
              &lt; A vida real do dev não é <span className="text-primary font-bold">clean</span> /&gt;
            </p>
          </div>

          <div className="w-full pt-4">
            <Button
              size="lg"
              className="w-full bg-white text-gray-800 font-sans font-medium text-lg h-14 rounded-xl shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] border border-gray-200 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn"
              isLoading={isLoading}
              onPress={login}
              startContent={
                !isLoading && (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full block">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                )
              }
            >
              {isLoading ? 'Conectando...' : 'Entrar com Google'}
            </Button>
          </div>

          <div className="font-mono text-[10px] text-gray-600 flex flex-col gap-1 select-none">
            <span>SYSTEM_STATUS: ONLINE</span>
            <span>SECURE_CONNECTION: ENCRYPTED</span>
          </div>
        </div>
      </div>
    </main>
  );
}
