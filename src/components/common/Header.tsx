import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface HeaderNavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  logoSrc: string;
  logoAlt?: string;
  brandName?: string;
  navLinks?: HeaderNavLink[];
  cta?: { label: string; href: string };
  showLoginButton?: boolean;
}

export default function Header({
  logoSrc,
  logoAlt = 'Logo',
  brandName = '',
  navLinks = [],
  cta,
  showLoginButton = true,
}: HeaderProps) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-2">
          <Image src={logoSrc} alt={logoAlt} width={32} height={32} />
          {brandName && <span className="text-xl font-bold tracking-tight">{brandName}</span>}
        </div>
        {navLinks.length > 0 && (
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="flex gap-2 items-center pr-8">
          {showLoginButton && (
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-blue-600"
              >
                Go to Dashboard
              </Button>
            </Link>
          )}
          {cta && (
            <Link href={cta.href}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700 border-0"
              >
                {cta.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
