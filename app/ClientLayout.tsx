'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarPaths = ['/movie', '/recommendations'];
  const shouldHideNavbar = hideNavbarPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? "min-h-screen pt-16" : "min-h-screen"}>
        {children}
      </main>
    </>
  );
} 