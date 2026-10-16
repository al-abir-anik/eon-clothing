import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { footerConfig } from "@/config/site";
import { shippingContent } from "@/config/shipping-content";

export const metadata = {
  title: "FAQs | EON Clothing",
  description:
    "Find answers to common questions about ordering, sizing, payment, delivery, and exchanges at EON Clothing.",
};

const banglaFaqs = [
  {
    question: "১. কীভাবে অর্ডার করব?",
    answer:
      "আমাদের ওয়েবসাইট থেকে পছন্দের পণ্য, সাইজ ও কালার নির্বাচন করে কার্টে যোগ করুন। এরপর চেকআউটে আপনার নাম, ফোন নম্বর ও সম্পূর্ণ ডেলিভারি ঠিকানা দিয়ে অর্ডার সম্পন্ন করুন।",
  },
  {
    question: "২. কী কী পেমেন্ট পদ্ধতি রয়েছে?",
    answer:
      "বর্তমানে ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে। অর্থাৎ, পণ্য হাতে পাওয়ার সময় অর্ডারের মূল্য পরিশোধ করতে পারবেন।",
  },
  {
    question: "৩. ডেলিভারি চার্জ কত?",
    answer: `ঢাকা সিটিতে ডেলিভারি চার্জ ${shippingContent.zones[0].fee} এবং ঢাকার বাইরে ${shippingContent.zones[1].fee}।`,
  },
  {
    question: "৪. ডেলিভারি পেতে কত দিন লাগে?",
    answer: `ঢাকা সিটিতে সাধারণত ${shippingContent.zones[0].deliveryTime} এবং ঢাকার বাইরে ${shippingContent.zones[1].deliveryTime} সময় লাগে। অর্ডার নিশ্চিত হওয়ার পর থেকে সময় গণনা করা হয়। ছুটির দিন বা কুরিয়ার সংক্রান্ত কারণে বিলম্ব হতে পারে।`,
  },
  {
    question: "৫. কোন সাইজ বা কালার পাওয়া যাবে কীভাবে জানব?",
    answer:
      "প্রতিটি পণ্যের পেজে দেওয়া সাইজ ও কালারের অপশন দেখুন। অর্ডার করার আগে সাইজ চার্ট থাকলে সেটি দেখে নিজের মাপের সঙ্গে মিলিয়ে নিন। কোনো প্রশ্ন থাকলে আমাদের সঙ্গে যোগাযোগ করুন।",
  },
  {
    question: "৬. সাইজ পরিবর্তন করা যাবে কি?",
    answer:
      "সাইজ এক্সচেঞ্জের জন্য পণ্য হাতে পাওয়ার ২৪ ঘণ্টার মধ্যে আমাদের সঙ্গে যোগাযোগ করুন। পণ্যটি অব্যবহৃত এবং মূল অবস্থায় থাকতে হবে। এক্সচেঞ্জের প্রাপ্যতা নিশ্চিত করতে আমাদের সঙ্গে আগে কথা বলুন।",
  },
  {
    question: "৭. ভুল বা ক্ষতিগ্রস্ত পণ্য পেলে কী করব?",
    answer:
      "ভুল বা ক্ষতিগ্রস্ত পণ্য পেলে ডেলিভারি পাওয়ার ৩ দিনের মধ্যে আমাদের সঙ্গে যোগাযোগ করুন। আপনার অর্ডার নম্বর ও সমস্যার বিবরণ জানান, যাতে আমরা বিষয়টি পর্যালোচনা করতে পারি।",
  },
  {
    question: "৮. অর্ডার দেওয়ার পর ঠিকানা পরিবর্তন করা যাবে?",
    answer:
      "ঠিকানা পরিবর্তন করতে হলে যত দ্রুত সম্ভব আমাদের সঙ্গে যোগাযোগ করুন। অর্ডার কুরিয়ারে পাঠানো হয়ে গেলে ঠিকানা পরিবর্তন করা সম্ভব নাও হতে পারে।",
  },
  {
    question: "৯. অর্ডার সম্পর্কে সাহায্য কোথায় পাব?",
    answer:
      "আপনার অর্ডার নম্বর ও অর্ডার করার সময় ব্যবহৃত ফোন নম্বর দিয়ে আমাদের সঙ্গে যোগাযোগ করুন। এতে আপনার অর্ডার শনাক্ত করতে সুবিধা হবে।",
  },
];

const englishFaqs = [
  {
    question: "1. How can I place an order?",
    answer:
      "Choose your preferred product, size, and color on our website, then add it to your cart. Enter your name, phone number, and complete delivery address at checkout to place your order.",
  },
  {
    question: "2. Which payment methods are available?",
    answer:
      "Cash on Delivery (COD) is currently available. You can pay for your order when you receive your parcel.",
  },
  {
    question: "3. How much is the delivery charge?",
    answer: `Delivery costs ${shippingContent.zones[0].fee} within Dhaka City and ${shippingContent.zones[1].fee} outside Dhaka.`,
  },
  {
    question: "4. How long does delivery take?",
    answer: `Delivery usually takes ${shippingContent.zones[0].deliveryTime} within Dhaka City and ${shippingContent.zones[1].deliveryTime} outside Dhaka. The delivery period starts after order confirmation. Holidays and courier delays may affect the estimated time.`,
  },
  {
    question: "5. How can I check available sizes and colors?",
    answer:
      "Check the available size and color options on the relevant product page. If a size chart is provided, compare it with your measurements before ordering. Contact us if you need help.",
  },
  {
    question: "6. Can I exchange an item for another size?",
    answer:
      "Contact us within 24 hours of receiving your order to request a size exchange. The item must be unused and in its original condition. Please contact us to confirm exchange availability.",
  },
  {
    question: "7. What if I receive a damaged or incorrect item?",
    answer:
      "Contact us within 3 days of delivery if your item is damaged or incorrect. Provide your order number and a description of the issue so we can review your request.",
  },
  {
    question: "8. Can I change my delivery address after ordering?",
    answer:
      "Contact us as soon as possible if you need to change your address. Changes may not be possible once your order has been dispatched.",
  },
  {
    question: "9. How can I get help with my order?",
    answer:
      "Contact us with your order number and the phone number used at checkout. This helps us identify your order and assist you.",
  },
];


function FaqSection({
  title,
  faqs,
  lang,
}: {
  title: string;
  faqs: { question: string; answer: string }[];
  lang: "bn" | "en";
}) {
  return (
    <section lang={lang} className="border-b border-black/10 py-8 sm:py-10">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>

      <div className="mt-5 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group overflow-hidden rounded-lg border border-black/10 bg-white transition-colors open:border-black/20 open:bg-[#FAFAFA]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-semibold leading-6 marker:hidden hover:bg-black/[0.025] sm:px-5 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>

              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/15 text-lg font-normal text-black/60 transition-all group-open:rotate-45 group-open:border-[#B92E26]/30 group-open:text-[#B92E26]"
              >
                +
              </span>
            </summary>

            <div className="mx-4 border-t border-black/10 sm:mx-5" />

            <div className="px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
              <p className="max-w-3xl text-sm leading-7 text-black/70 sm:text-base sm:leading-8">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}


export default function FAQPage() {
  const { contact } = footerConfig;

  return (
    <main className="bg-white text-[#171717]">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="border-b border-black/10 pb-7">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65 sm:text-base">
            Find answers to common questions about ordering, payment, sizing,
            delivery, and exchanges at EON Clothing.
          </p>
        </header>

        <FaqSection title="সাধারণ জিজ্ঞাসা" faqs={banglaFaqs} lang="bn" />

        <div className="my-3 border-t-2 border-black/10" />

        <FaqSection
          title="Frequently Asked Questions"
          faqs={englishFaqs}
          lang="en"
        />

        {/* Contact support */}
        <section className="pt-9">
          <h2 className="text-lg font-semibold">আপনার প্রশ্নের উত্তর পাননি?</h2>

          <p className="mt-2 text-sm leading-7 text-black/65">
            Didn&apos;t find the answer you were looking for? Contact our team
            and we&apos;ll help you with your enquiry.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4 text-sm">
            <a
              href={`tel:${contact.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 hover:text-[#B92E26]"
            >
              <Phone size={16} />
              {contact.phone}
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 break-all hover:text-[#B92E26]"
            >
              <Mail size={16} />
              {contact.email}
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-medium hover:text-[#B92E26]"
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
