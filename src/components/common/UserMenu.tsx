'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src={require('@/assets/user.svg')} alt="user" width={32} height={32} />
        <h1 className="text-lg">{session?.user?.name || 'User'}</h1>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
            Signed in as
            <br />
            <span className="font-medium">{session?.user?.email}</span>
          </div>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
