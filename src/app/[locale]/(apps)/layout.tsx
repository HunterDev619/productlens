'use client';

import { SidebarSimple } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { GoToTopButton } from '@/components/go-to-top-button';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/components';
import { AuthGuard } from '@/libs/auth-guard';
import { Sidebar } from './_components/sidebar';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard
      fallback={(
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600" />
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    >
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

        <main className="mx-4 min-h-screen md:my-4 lg:mx-8 lg:my-4 lg:pl-[320px]">
          {children}
        </main>
        <footer className="bg-background py-4 text-center text-base text-foreground md:my-4 lg:mx-8 lg:my-4 lg:pl-[320px]">
          ProductLens.ai — AI-powered product sustainability intelligence. From image to insight.
          ________________________________________
          © 2025 ProductLens.ai. All rights reserved. Patent pending.
        </footer>
        // This is the footer

        {/* Go to Top Button */}
        <GoToTopButton threshold={300} />
      </div>
    </AuthGuard>
  );
};
