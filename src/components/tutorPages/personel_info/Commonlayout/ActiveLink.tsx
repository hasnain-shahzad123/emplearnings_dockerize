// components/ActiveLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface ActiveLinkProps {
  href: string;
  src: string;
  src2:string;
  alt: string;
  
}

const ActiveLink = ({ href, src,src2, alt }: ActiveLinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link href={href}
    >
      <div
        className={`p-2 w-full rounded-md ${
          isActive ? "bg-empoweredFlag" : "hover:bg-gray-300"
        }`}
      >
        <Image
          src={isActive ? src2 : src}
          alt={alt}
          height={30}
          width={30}
          className="h-12 w-12"
        />
      </div>
    </Link>
  );
};

export default ActiveLink;
