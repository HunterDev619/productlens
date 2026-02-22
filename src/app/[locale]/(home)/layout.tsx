import { ScrollArea } from '@/components/ui/components/scroll-area';

import { Header } from './components/header';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea orientation="vertical" className="h-screen overflow-x-hidden">
      <div className="w-full max-w-[100vw] min-w-0 overflow-x-hidden">
        <Header />
        {children}
        <footer className="border-t border-white/10 bg-[#003328] py-4 text-center sm:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="px-2 text-sm font-medium tracking-tight text-white/95 sm:text-base">
              ProductLens.ai — AI-powered product sustainability intelligence. From image to insight.
            </p>
            <p className="mt-2 text-sm font-medium tracking-tight text-white/80">
              © 2025 ProductLens.ai. All rights reserved. Patent pending.
            </p>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
}
