import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { footerConfig } from "@/config/site";

export function Footer() {
  const { contact, social, footer } = footerConfig;

  const whatsappNumber = social.whatsappNumber.replace(/\D/g, "");
  const phoneDigits = contact.phone.replace(/\D/g, "");

  const whatsappHref =
    whatsappNumber && !/^0+$/.test(whatsappNumber)
      ? `https://wa.me/${whatsappNumber}`
      : "";

  const phoneHref =
    phoneDigits && !/^0+$/.test(phoneDigits)
      ? `tel:${contact.phone.replace(/[^\d+]/g, "")}`
      : "";

  const email =
    contact.email && !contact.email.includes("example.com")
      ? contact.email
      : "";

  const socialLinks = [
    { label: "Facebook", href: social.facebook, Icon: Facebook },
    { label: "Instagram", href: social.instagram, Icon: Instagram },
    { label: "WhatsApp", href: whatsappHref, Icon: MessageCircle },
    { label: "TikTok", href: social.tiktok, Icon: null },
    { label: "YouTube", href: social.youtube, Icon: null },
  ].filter((item) => item.href.length > 0);

  return (
    <footer className="border-t border-white/10 bg-[#171717] text-[#F8F5EF]">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-16 lg:py-16">
          {/* Brand */}
          <section aria-label="EON Clothing">
            <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D66A5E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D66A5E]" />
              Made for your everyday era
            </p>

            <Link
              href="/"
              aria-label={`${footerConfig.brandName} home`}
              className="group inline-block"
            >
              <span className="block text-[clamp(4.5rem,10vw,6rem)] font-black leading-[0.78] tracking-tighter transition-colors duration-300 group-hover:text-[#D66A5E]">
                EON<span className="text-[#D66A5E]">.</span>
              </span>
            </Link>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/55 sm:text-base">
              {footerConfig.description}
            </p>
          </section>

          {/* Information */}
          <nav aria-label="Customer care">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Information
            </h2>

            <ul className="mt-6 flex flex-col items-start gap-4">
              {footer.information.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/65 transition-colors duration-200 hover:text-[#F8F5EF]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact and social links */}
          <section aria-label="Contact and social media">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Contact
            </h2>

            <address className="mt-6 flex flex-col items-start gap-4 not-italic">
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white tracking-wide"
                >
                  <Phone
                    size={15}
                    strokeWidth={1.6}
                    className="shrink-0 text-white/40"
                  />
                  {contact.phone}
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white tracking-wide"
                >
                  <Mail
                    size={15}
                    strokeWidth={1.6}
                    className="shrink-0 text-white/40"
                  />
                  <span className="break-all">{email}</span>
                </a>
              )}
            </address>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Connect with us
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Connect with EON on ${label} (opens in a new tab)`}
                      title={label}
                      className="group flex h-10 items-center gap-2 border border-white/10 px-3 text-xs text-white/65 transition-colors duration-200 hover:border-[#D66A5E]/60 hover:bg-white/3 hover:text-white"
                    >
                      {Icon ? (
                        <Icon size={15} strokeWidth={1.7} />
                      ) : (
                        <span className="text-[10px] font-bold">
                          {label === "TikTok" ? "TK" : "YT"}
                        </span>
                      )}

                      {label}

                      <ArrowUpRight
                        size={11}
                        className="text-white/30 transition-colors group-hover:text-[#D66A5E]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} {footerConfig.brandName}. All rights
            reserved.
          </p>

          <nav aria-label="Legal information">
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
              {footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[11px] text-white/45 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-[11px] tracking-wide text-white/40">
            {footerConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
