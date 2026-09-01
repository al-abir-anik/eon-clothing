import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

interface Props {
  className?: string;
  iconClassName?: string;
}

export const SocialLink = [
  {
    title: "Facebook",
    href: "https://www.facebook.com/YourPageName",
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/YourProfileName",
    icon: <Instagram className="h-5 w-5" />,
  },
];

const SocialMedia = ({ className = "", iconClassName = "" }: Props) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SocialLink.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.title}
          className={`rounded-full border p-2 transition-colors hover:border-white hover:text-white ${iconClassName}`}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default SocialMedia;
