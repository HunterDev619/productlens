'use client';
import { SidebarSimple } from '@phosphor-icons/react';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/components';
import { UserRole } from '@/services/types';
import { useUserProfile } from '@/services/user/hooks';
import { Sidebar } from './_components/sidebar';
import 'rsuite/dist/rsuite-no-reset.min.css';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useUserProfile();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (user.role !== UserRole.ADMIN) {
      router.replace('/apps');
    }
  }, [isLoading, user, router]);

  return (
    <div>
      <div className="sticky top-0 z-50 flex items-center justify-between p-4 pb-0 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="bg-background">
              <SidebarSimple />
            </Button>
          </SheetTrigger>

          <SheetContent showClose={false} side="left" className="focus-visible:outline-none">
            <SheetClose asChild className="absolute top-4 left-4">
              <Button size="icon" variant="ghost">
                <SidebarSimple />
              </Button>
            </SheetClose>

            <Sidebar setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>

      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[320px] lg:flex-col"
      >
        <div className="h-full rounded p-4">
          <Sidebar />
        </div>
      </motion.div>

      <main className="mx-4 md:my-4 lg:mx-8 lg:my-4 lg:pl-[320px]">
        {isLoading ? null : user && user.role === UserRole.ADMIN ? children : null}
      </main>
    </div>
  );
};
