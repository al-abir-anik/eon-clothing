import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Logo from "../Logo";
import SocialMedia from "../SocialMedia";
import Container from "./Container";
import { contactConfig } from "@/constants/contact";

const shopLinks = [
  { title: "Shop All", href: "/shop" },
  { title: "New Arrivals", href: "/shop?sort=newest" },
  { title: "Best Sellers", href: "/shop?sort=popular" },
];

const customerLinks = [
  { title: "Track Order", href: "/track-order" },
  { title: "Contact Us", href: "/contact" },
  { title: "FAQ", href: "/faq" },
  { title: "Shipping & Delivery", href: "/shipping" },
];

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms & Conditions", href: "/terms" },
  { title: "Return Policy", href: "/return-policy" },
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white">
      <Container>
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo className="text-xl" />

            <p className="mt-2 max-w-sm text-sm leading-6 text-black/60">
              {contactConfig.company.description}
            </p>

            <div className="mt-6">
              <SocialMedia
                className="text-black/60"
                iconClassName="border-black/15 hover:border-black hover:text-black"
              />
            </div>
          </div>

          {/* Shop */}
          <FooterColumn title="Shop" links={shopLinks} />

          {/* Customer */}
          <FooterColumn title="Customer Care" links={customerLinks} />

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Stay in the loop
            </h3>

            <p className="mt-4 text-sm leading-6 text-black/60">
              Subscribe for new arrivals, exclusive offers and updates.
            </p>

            <form className="mt-5 flex border-b border-black/30">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-black/40"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center justify-center px-2 text-black transition-transform hover:translate-x-1"
              >
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-1 gap-4 border-t border-black/10 py-7 text-sm sm:grid-cols-3">
          <ContactItem
            label="Call"
            value={contactConfig.company.phone}
            href={`tel:${contactConfig.company.phone}`}
          />

          <ContactItem
            label="Email"
            value={contactConfig.emails.support}
            href={`mailto:${contactConfig.emails.support}`}
          />

          <ContactItem
            label="Location"
            value={contactConfig.company.city}
          />
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-5 border-t border-black/10 py-6 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} EON Clothing. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-black"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

interface FooterColumnProps {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-black/60 transition-colors hover:text-black"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ContactItemProps {
  label: string;
  value: string;
  href?: string;
}

const ContactItem = ({ label, value, href }: ContactItemProps) => {
  const content = (
    <>
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-black/40">
        {label}
      </span>

      <span className="mt-1 block text-sm text-black/70">
        {value}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="transition-colors hover:text-black"
      >
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
};

export default Footer;