
import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
           <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 fill-primary"
            >
              <title>Inverness Eagles</title>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-5-10a5 5 0 0 1 10 0v.035c-1.373-1.63-3.56-2.535-5-2.535s-3.627.905-5 2.535V12zm1.618-3.322c.813-1.012 2.1-1.678 3.382-1.678s2.57.666 3.382 1.678c-1.12-.52-2.352-.828-3.382-.828s-2.262.308-3.382.828zM9.475 14.525c.575-2.1 2.44-3.525 4.525-3.525.688 0 1.35.138 1.95.4-1.162.775-2.887 1.25-4.45 1.25-1.025 0-2.012-.225-2.837-.638.2.837.537 1.625 1.812 2.513z" />
            </svg>
          <span>Inverness Eagles</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
