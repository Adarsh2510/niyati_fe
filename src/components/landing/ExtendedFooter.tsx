import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

const footerData = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    // { label: 'Enterprise', href: '#' },
    // { label: 'Case Studies', href: '#' },
  ],
  resources: [
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    // { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: '#',
      icon: <Linkedin />,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: <Twitter />,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/niyatiprep/',
      icon: <Instagram />,
    },
  ],
};

const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) => (
  <div>
    <div className="font-semibold mb-2">{title}</div>
    <ul className="space-y-1 text-sm text-gray-600">
      {links.map(({ label, href }) => (
        <li key={label}>
          <a href={href} className="hover:text-blue-600 transition-colors">
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function ExtendedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t pt-12 pb-6 mt-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Image src={'/engineer.svg'} alt="Niyati Logo" width={32} height={32} />
            <span className="text-xl font-bold tracking-tight">Niyati Prep</span>
          </div>
          <p className="text-gray-500 text-sm">
            Empowering careers through AI-powered interview preparation
          </p>
        </div>

        {/* Footer Links */}
        <FooterSection title="" links={[]} />
        <FooterSection title="Product" links={footerData.product} />
        {/* <FooterSection title="Resources" links={footerData.resources} /> */}
        <FooterSection title="Company" links={footerData.company} />
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-8 border-t pt-4">
        <p className="text-gray-400 text-xs">&copy; {currentYear} Niyati. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          {footerData.social.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              aria-label={name}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
