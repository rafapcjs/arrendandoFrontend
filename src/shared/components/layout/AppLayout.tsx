import type { ReactNode } from "react";
import { HamburgerMenu } from "../navigation/HamburgerMenu";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-transparent">
      <HamburgerMenu />
      <main className="pt-4 pl-4 pr-4 pb-4">
        {children}
      </main>
    </div>
  );
}