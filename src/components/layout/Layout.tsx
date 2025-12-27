'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Home, PlayCircle, History, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  headerAction?: ReactNode;
  className?: string;
}

export function Layout({
  children,
  showNav = true,
  showHeader = true,
  headerTitle,
  headerAction,
  className,
}: LayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/simulate', icon: PlayCircle, label: 'Simulate' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl">
                🔮
              </Link>
              {headerTitle && (
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  {headerTitle}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              {headerAction}
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main
        className={cn(
          'max-w-lg mx-auto px-4 py-6',
          showNav && 'pb-24',
          className
        )}
      >
        {children}
      </main>

      {/* Bottom navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-inset-bottom">
          <div className="max-w-lg mx-auto px-4">
            <div className="flex items-center justify-around h-16">
              {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', isActive && 'scale-110')} />
                    <span className="text-xs font-medium">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-500"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
