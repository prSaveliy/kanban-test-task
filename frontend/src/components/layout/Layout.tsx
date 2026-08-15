import { type ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-1 flex flex-col min-h-0">{children}</main>
    </div>
  );
};
