import { ScrollArea } from '@/components/ui/components/scroll-area';

import { Header } from './components/header';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea orientation="vertical" className="h-screen overflow-x-hidden">
      <div className="w-full max-w-[100vw] min-w-0 overflow-x-hidden">
        <Header />
        {children}
      </div>
    </ScrollArea>
  );
}
