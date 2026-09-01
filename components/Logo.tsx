import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  priority?: boolean;
}

const Logo = ({ className, priority = false }: LogoProps) => {
  return (
    <Link
      href="/"
      aria-label="EON Clothing"
      className={cn("inline-flex shrink-0", className)}
    >
      <Image
        src="/images/EON_logo.png"
        alt="EON Clothing"
        width={120}
        height={20}
        priority={priority}
        className="w-26 lg:w-full mb-1 lg:mb-0 lg:mt-1.5 object-cover"
      />
    </Link>
  );
};

export default Logo;