'use client';

import { Logo } from '@/components/logo';
import { Button, KeyboardShortcut, Separator } from '@/components/ui';
import { BatteryFull, CameraIcon, ClockCounterClockwise, FileText, Flask, Stack } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';

import { UserProfile } from '@/components/UserProfile';
import { cn } from '@/utils';

type Props = {
  className?: string;
};

const ActiveIndicator = ({ className }: Props) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={cn(
      'size-1.5 animate-pulse rounded-full bg-sky-500 shadow-[0_0_12px] shadow-sky-500',
      className,
    )}
  />
);

type SidebarItem = {
  path: string;
  name: string;
  shortcut?: string;
  icon: React.ReactNode;
};

type SidebarItemProps = SidebarItem & {
  onClick?: () => void;
};

const SidebarItemComponent = ({ path, name, shortcut, icon, onClick }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Button
      asChild
      size="lg"
      variant="ghost"
      className={cn(
        'h-auto justify-start px-4 py-3 transition-all duration-200',
        isActive
          ? 'pointer-events-none bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border-l-4 border-l-sky-500 bg-sky-50 shadow-md'
          : 'hover:bg-zinc-100',
      )}
      onClick={onClick}
    >
      <Link href={path}>
        <div className={cn(
          'mr-3 transition-colors duration-200',
          isActive ? 'text-sky-700' : 'text-zinc-600',
        )}
        >
          {icon}
        </div>
        <span className={cn(
          'font-semibold transition-colors duration-200',
          isActive ? 'text-sky-800' : 'text-zinc-700',
        )}
        >
          {name}
        </span>
        {!isActive && <KeyboardShortcut className="ml-auto">{shortcut}</KeyboardShortcut>}
        {isActive && <ActiveIndicator className="ml-auto" />}
      </Link>
    </Button>
  );
};

type SidebarProps = {
  setOpen?: (open: boolean) => void;
};

export const Sidebar = ({ setOpen }: SidebarProps) => {
  const router = useRouter();

  useKeyboardShortcut(['shift', 'a'], () => {
    router.push('/apps/analysis');
    setOpen?.(false);
  });

  useKeyboardShortcut(['shift', 'p'], () => {
    router.push('/apps/digital-battery-passport');
    setOpen?.(false);
  });

  useKeyboardShortcut(['shift', 'm'], () => {
    router.push('/apps/manual-analysis');
    setOpen?.(false);
  });

  useKeyboardShortcut(['shift', 'b'], () => {
    router.push('/apps/passports');
    setOpen?.(false);
  });

  useKeyboardShortcut(['shift', 'h'], () => {
    router.push('/apps/history');
    setOpen?.(false);
  });

  useKeyboardShortcut(['shift', 's'], () => {
    router.push('/apps/settings');
    setOpen?.(false);
  });

  const sidebarItems: SidebarItem[] = [
    {
      path: '/apps/analysis',
      name: 'Image Analysis',
      shortcut: '⇧A',
      icon: <CameraIcon />,
    },
    {
      path: '/apps/manual-analysis',
      name: 'Manual Analysis',
      shortcut: '⇧M',
      icon: <Flask />,
    },
    {
      path: '/apps/passports',
      name: 'Battery Passports',
      shortcut: '⇧B',
      icon: <BatteryFull />,
    },
    {
      path: '/apps/history',
      name: 'History',
      shortcut: '⇧H',
      icon: <ClockCounterClockwise />,
    },
    {
      path: '/apps/references',
      name: 'References',
      shortcut: '⇧S',
      icon: <Stack />,
    },
    {
      path: '/apps/disclaimer',
      name: 'Disclaimer',
      shortcut: '⇧D',
      icon: <FileText />,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-y-4">
      <div className="flex w-full justify-start">
        <Logo
          size="lg"
          showText={true}
          href="/apps"
        />
      </div>

      <Separator className="opacity-50" />

      <div className="grid gap-y-2">
        {sidebarItems.map(item => (
          <SidebarItemComponent {...item} key={item.path} onClick={() => setOpen?.(false)} />
        ))}
      </div>

      <div className="flex-1" />

      <Separator className="opacity-50" />
      <UserProfile />
    </div>
  );
};
