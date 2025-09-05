import { Header } from "@/components/Header";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8">
        <div className="container mx-auto max-w-6xl">
            {children}
        </div>
      </main>
    </div>
  );
}
