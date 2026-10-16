
import { Mail, Phone } from "lucide-react";

import { footerConfig } from "@/config/site";

export const metadata = {
  title: "Returns & Exchange | EON Clothing",
  description:
    "Read EON Clothing's size exchange policy and instructions for reporting damaged or incorrect items.",
};

export default function ReturnsPage() {
  const { contact } = footerConfig;

  const phoneHref = `tel:${contact.phone.replace(/\D/g, "")}`;
  const emailHref = `mailto:${contact.email}`;

  return (
    <main className="bg-white text-[#171717]">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        {/* BANGLA VERSION */}
        <section lang="bn">
          <header className="border-b border-black/10 pb-7">
            <p className="mb-2 text-xs font-medium text-[#B92E26]">
              EON CLOTHING
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              রিটার্ন ও এক্সচেঞ্জ পলিসি
            </h1>

            <p className="mt-4 text-sm leading-7 text-black/65 sm:text-base">
              EON Clothing থেকে কেনাকাটার পর সাইজ পরিবর্তন বা
              ভুল কিংবা ক্ষতিগ্রস্ত পণ্য সংক্রান্ত সমস্যার জন্য
              নিচের নিয়মগুলো অনুসরণ করুন।
            </p>
          </header>

          {/* Size exchange */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ১. সাইজ এক্সচেঞ্জ
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              পণ্যের সাইজ পরিবর্তন করতে চাইলে পণ্য হাতে পাওয়ার
              ২৪ ঘণ্টার মধ্যে আমাদের সঙ্গে যোগাযোগ করতে হবে।
            </p>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              এক্সচেঞ্জের জন্য পণ্যটি অবশ্যই অব্যবহৃত এবং
              মূল অবস্থায় থাকতে হবে।
            </p>
          </section>

          {/* Damaged or incorrect item */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ২. ভুল বা ক্ষতিগ্রস্ত পণ্য
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              আপনি যদি ভুল পণ্য পান অথবা পণ্যটি ক্ষতিগ্রস্ত
              অবস্থায় পৌঁছায়, তাহলে ডেলিভারি পাওয়ার ৩ দিনের
              মধ্যে আমাদের সঙ্গে যোগাযোগ করুন।
            </p>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              আপনার অর্ডারের তথ্য জানিয়ে সমস্যাটি আমাদের
              কাস্টমার সাপোর্ট টিমকে জানান। পরবর্তী পদক্ষেপ
              সম্পর্কে আমরা আপনাকে নির্দেশনা দেব।
            </p>
          </section>

          {/* How to contact */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ৩. কীভাবে যোগাযোগ করবেন
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              যোগাযোগ করার সময় আপনার অর্ডার নম্বর এবং অর্ডার
              করার সময় ব্যবহৃত ফোন নম্বরটি উল্লেখ করুন।
              এতে আপনার সমস্যাটি শনাক্ত করতে সুবিধা হবে।
            </p>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              যোগাযোগের সময়সীমা মেনে চলুন, যাতে আমরা আপনার
              সমস্যাটি যথাযথভাবে পর্যালোচনা করতে পারি।
            </p>
          </section>

          {/* Contact details */}
          <section className="py-8">
            <h2 className="text-lg font-semibold">
              ৪. যোগাযোগের তথ্য
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              রিটার্ন বা এক্সচেঞ্জ সংক্রান্ত যেকোনো প্রশ্নের
              জন্য আমাদের সঙ্গে যোগাযোগ করুন।
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href={phoneHref}
                className="flex w-fit items-center gap-2 hover:text-[#B92E26]"
              >
                <Phone size={16} />
                {contact.phone}
              </a>

              <a
                href={emailHref}
                className="flex w-fit items-center gap-2 break-all hover:text-[#B92E26]"
              >
                <Mail size={16} />
                {contact.email}
              </a>
            </div>
          </section>
        </section>

        {/* ENGLISH VERSION */}
        <div className="my-5 border-t-2 border-black/10" />

        <section lang="en">
          <header className="border-b border-black/10 pb-7">
            <p className="mb-2 text-xs font-medium text-[#B92E26]">
              ENGLISH VERSION
            </p>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Returns &amp; Exchange Policy
            </h2>

            <p className="mt-4 text-sm leading-7 text-black/65 sm:text-base">
              If you need a size exchange or receive an incorrect
              or damaged item, please follow the guidelines below.
            </p>
          </header>

          {/* Size exchange */}
          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              1. Size Exchange
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              To request a size exchange, you must contact EON
              Clothing within 24 hours of receiving your order.
            </p>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              The item must be unused and in its original condition
              to be eligible for an exchange.
            </p>
          </section>

          {/* Damaged or incorrect item */}
          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              2. Damaged or Incorrect Items
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              If you receive a damaged or incorrect item, please
              contact us within 3 days of delivery.
            </p>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              Provide your order details and explain the issue
              to our customer support team. We will guide you
              through the next steps.
            </p>
          </section>

          {/* How to contact */}
          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              3. How to Request Assistance
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              When contacting us, include your order number and
              the phone number used when placing your order.
              This helps us identify your purchase.
            </p>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              Please contact us within the applicable time limit
              so that we can review your request.
            </p>
          </section>

          {/* Contact details */}
          <section className="py-8">
            <h3 className="text-lg font-semibold">
              4. Contact Us
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
              If you have any questions about returns or exchanges,
              please contact our customer support team.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href={phoneHref}
                className="flex w-fit items-center gap-2 hover:text-[#B92E26]"
              >
                <Phone size={16} />
                {contact.phone}
              </a>

              <a
                href={emailHref}
                className="flex w-fit items-center gap-2 break-all hover:text-[#B92E26]"
              >
                <Mail size={16} />
                {contact.email}
              </a>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
