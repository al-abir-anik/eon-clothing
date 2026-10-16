
import {
  Mail,
  MessageCircle,
  Phone,
  Instagram,
  Facebook,
} from "lucide-react";

import { footerConfig } from "@/config/site";

export const metadata = {
  title: "Contact Us | EON Clothing",
  description:
    "Contact EON Clothing for order assistance, product information, sizing, and delivery enquiries.",
};

export default function ContactPage() {
  const { contact, social } = footerConfig;

  const whatsappNumber = social.whatsappNumber.replace(/\D/g, "");
  const phoneNumber = contact.phone.replace(/\D/g, "");

  return (
    <main className="bg-white text-[#171717]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Page heading */}
        <header className="border-b border-black/10 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact Us
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65 sm:text-base">
            Have a question about an order, product, size, or delivery?
            We&apos;re here to help. Choose one of the contact methods
            below to get in touch with EON Clothing.
          </p>
        </header>

        {/* Customer support */}
        <section className="py-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Customer Support
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-black/65">
            You can contact us for product details, size
            recommendations, order enquiries, delivery updates, or
            other questions about shopping with us.
          </p>

          <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
            {/* WhatsApp */}
            <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <MessageCircle
                  size={20}
                  strokeWidth={1.6}
                  className="mt-1 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-semibold">WhatsApp</h3>
                  <p className="mt-1 text-sm text-black/60">
                    Message us about products, orders, or sizing.
                  </p>
                  <p className="mt-2 text-sm">{contact.phone}</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-sm font-medium underline underline-offset-4 hover:text-[#B92E26]"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <Phone
                  size={20}
                  strokeWidth={1.6}
                  className="mt-1 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-semibold">Phone</h3>
                  <p className="mt-1 text-sm text-black/60">
                    Contact us directly for assistance.
                  </p>
                  <p className="mt-2 text-sm">{contact.phone}</p>
                </div>
              </div>

              <a
                href={`tel:${phoneNumber}`}
                className="w-fit text-sm font-medium underline underline-offset-4 hover:text-[#B92E26]"
              >
                Call us
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <Mail
                  size={20}
                  strokeWidth={1.6}
                  className="mt-1 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-semibold">Email</h3>
                  <p className="mt-1 text-sm text-black/60">
                    For general enquiries and customer support.
                  </p>
                  <p className="mt-2 break-all text-sm">
                    {contact.email}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${contact.email}`}
                className="w-fit text-sm font-medium underline underline-offset-4 hover:text-[#B92E26]"
              >
                Send an email
              </a>
            </div>
          </div>
        </section>

        {/* Social media */}
        <section className="border-t border-black/10 py-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Follow EON Clothing
          </h2>

          <p className="mt-2 text-sm leading-7 text-black/65">
            Follow us for new collections, product updates, and
            announcements.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4">
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#B92E26]"
            >
              <Facebook size={17} />
              Facebook
            </a>

            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#B92E26]"
            >
              <Instagram size={17} />
              Instagram
            </a>
          </div>
        </section>

        {/* Additional information */}
        <section className="border-t border-black/10 pt-8">
          <h2 className="text-base font-semibold">
            Need help with an order?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-black/65">
            When contacting us about an existing order, please include
            your order number and the phone number used during checkout
            so we can assist you more efficiently.
          </p>
        </section>
      </div>
    </main>
  );
}
