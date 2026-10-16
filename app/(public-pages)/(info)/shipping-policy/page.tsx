
import { Mail, Phone } from "lucide-react";

import { shippingConfig } from "@/config/shipping";
import { shippingContent } from "@/config/shipping-content";
import { footerConfig } from "@/config/site";

export const metadata = {
  title: "Shipping & Delivery | EON Clothing",
  description:
    "বাংলাদেশজুড়ে EON Clothing-এর ডেলিভারি চার্জ, সময় ও শিপিং পলিসি জানুন।",
};

export default function ShippingPage() {
  const { contact } = footerConfig;

  const dhaka = shippingConfig.dhaka_city;
  const outsideDhaka = shippingConfig.outside_dhaka;

  // const shippingNotes = [
  //   {
  //     bn: "ডেলিভারি সময় অর্ডার নিশ্চিত হওয়ার পর থেকে গণনা করা হয়।",
  //     en: shippingContent.notes[0],
  //   },
  //   {
  //     bn: "ছুটির দিন বা কুরিয়ার সার্ভিসে বিলম্বের কারণে ডেলিভারিতে কিছুটা বেশি সময় লাগতে পারে।",
  //     en: shippingContent.notes[1],
  //   },
  //   {
  //     bn: "অর্ডার করার সময় সঠিক ডেলিভারি ঠিকানা ও সচল ফোন নম্বর প্রদান করুন।",
  //     en: shippingContent.notes[2],
  //   },
  // ];

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
              শিপিং ও ডেলিভারি
            </h1>

            <p className="mt-4 text-sm leading-7 text-black/70 sm:text-base">
              EON Clothing সারা বাংলাদেশে পণ্য ডেলিভারি করে।
              আপনার অর্ডারের ডেলিভারি চার্জ, সম্ভাব্য সময় এবং
              প্রয়োজনীয় তথ্য নিচে দেওয়া হলো।
            </p>
          </header>

          {/* Delivery charges */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ১. ডেলিভারি চার্জ ও সময়
            </h2>

            <p className="mt-2 text-sm leading-7 text-black/65">
              আপনার ডেলিভারি লোকেশন অনুযায়ী চার্জ ও সম্ভাব্য
              ডেলিভারি সময় নির্ধারিত হবে।
            </p>

            <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
              <div className="flex items-start justify-between gap-4 py-4">
                <div>
                  <h3 className="text-sm font-medium">ঢাকা সিটি</h3>
                  <p className="mt-1 text-sm text-black/60">
                    সম্ভাব্য সময়: ১–২ কার্যদিবস
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  ৳{dhaka.fee}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 py-4">
                <div>
                  <h3 className="text-sm font-medium">ঢাকার বাইরে</h3>
                  <p className="mt-1 text-sm text-black/60">
                    সম্ভাব্য সময়: ২–৪ কার্যদিবস
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  ৳{outsideDhaka.fee}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-6 text-black/50">
              ডেলিভারি সময় আনুমানিক। ছুটির দিন বা কুরিয়ার
              সার্ভিসে বিলম্ব হলে বেশি সময় লাগতে পারে।
            </p>
          </section>

          {/* Processing and delivery */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ২. অর্ডার প্রসেসিং ও ডেলিভারি
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65">
              আপনার অর্ডার নিশ্চিত হওয়ার পর ডেলিভারির সময় গণনা
              শুরু হবে। অর্ডার প্রসেসিং বা কুরিয়ার সংক্রান্ত
              কারণে ডেলিভারিতে বিলম্ব হতে পারে।
            </p>
          </section>

          {/* Payment */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ৩. পেমেন্ট পদ্ধতি
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65">
              বর্তমানে ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে।
              অর্থাৎ, পণ্য হাতে পাওয়ার সময় অর্ডারের মূল্য
              পরিশোধ করতে পারবেন।
            </p>
          </section>

          {/* Address */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ৪. ডেলিভারি ঠিকানা
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65">
              অর্ডার করার সময় আপনার সম্পূর্ণ ঠিকানা এবং সচল
              ফোন নম্বর সঠিকভাবে প্রদান করুন। ভুল বা অসম্পূর্ণ
              তথ্যের কারণে ডেলিভারিতে সমস্যা বা বিলম্ব হতে পারে।
            </p>
          </section>

          {/* Delivery issues */}
          <section className="border-b border-black/10 py-8">
            <h2 className="text-lg font-semibold">
              ৫. ডেলিভারি সংক্রান্ত সমস্যা
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65">
              পণ্য ক্ষতিগ্রস্ত অবস্থায় পেলে অথবা ভুল পণ্য
              ডেলিভারি হলে, পণ্য পাওয়ার ৩ দিনের মধ্যে আমাদের
              সঙ্গে যোগাযোগ করুন।
            </p>
          </section>

          {/* Contact */}
          <section className="py-8">
            <h2 className="text-lg font-semibold">
              ৬. যোগাযোগ
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/65">
              ডেলিভারি চার্জ, সম্ভাব্য সময় অথবা আপনার অর্ডার
              সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সঙ্গে যোগাযোগ করুন।
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="flex w-fit items-center gap-2 hover:text-[#B92E26]"
              >
                <Phone size={16} />
                {contact.phone}
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex w-fit items-center gap-2 break-all hover:text-[#B92E26]"
              >
                <Mail size={16} />
                {contact.email}
              </a>
            </div>
          </section>
        </section>

        {/* LANGUAGE SEPARATOR */}
        <div className="my-5 border-t-2 border-black/10" />

        {/* ENGLISH VERSION */}
        <section lang="en">
          <header className="border-b border-black/10 pb-7">
            <p className="mb-2 text-xs font-medium text-[#B92E26]">
              ENGLISH VERSION
            </p>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Shipping &amp; Delivery
            </h2>

            <p className="mt-4 text-sm leading-7 text-black/70 sm:text-base">
              EON Clothing delivers across Bangladesh. Find details
              below about delivery charges, estimated delivery times,
              and our shipping policy.
            </p>
          </header>

          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              1. Delivery Charges &amp; Time
            </h3>

            <p className="mt-2 text-sm leading-7 text-black/65">
              Delivery charges and estimated delivery times depend
              on your delivery location.
            </p>

            <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
              <div className="flex items-start justify-between gap-4 py-4">
                <div>
                  <h4 className="text-sm font-medium">Dhaka City</h4>
                  <p className="mt-1 text-sm text-black/60">
                    Estimated time: {dhaka.estimatedDeliveryTime}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  ৳{dhaka.fee}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 py-4">
                <div>
                  <h4 className="text-sm font-medium">Outside Dhaka</h4>
                  <p className="mt-1 text-sm text-black/60">
                    Estimated time: {outsideDhaka.estimatedDeliveryTime}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  ৳{outsideDhaka.fee}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-6 text-black/50">
              Delivery times are estimates. Holidays or courier
              delays may result in longer delivery times.
            </p>
          </section>

          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              2. Order Processing &amp; Delivery
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65">
              Delivery time starts after your order has been
              confirmed. Order processing and courier-related
              issues may occasionally cause delays.
            </p>
          </section>

          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              3. Payment Method
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65">
              Cash on Delivery (COD) is currently available.
              You can pay for your order when you receive your parcel.
            </p>
          </section>

          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              4. Delivery Address
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65">
              Please provide your complete delivery address and
              an active phone number when placing an order.
              Incorrect or incomplete information may cause
              delivery problems or delays.
            </p>
          </section>

          <section className="border-b border-black/10 py-8">
            <h3 className="text-lg font-semibold">
              5. Delivery Issues
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65">
              If you receive a damaged or incorrect item, please
              contact us within 3 days of delivery.
            </p>
          </section>

          <section className="py-8">
            <h3 className="text-lg font-semibold">
              6. Contact Us
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/65">
              If you have questions about delivery charges,
              estimated delivery times, or an existing order,
              please get in touch with us.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="flex w-fit items-center gap-2 hover:text-[#B92E26]"
              >
                <Phone size={16} />
                {contact.phone}
              </a>

              <a
                href={`mailto:${contact.email}`}
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
