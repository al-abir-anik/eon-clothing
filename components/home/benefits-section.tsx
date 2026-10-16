import { Truck, RefreshCw, ShieldCheck, Banknote } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Quality you can feel",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Delivery across Bangladesh",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    description: "Hassle-free size exchange",
  },
];

export function BenefitsSection() {
  return (
    <section
      aria-label="Shopping benefits"
      className="border-b border-black/5 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex items-center gap-3 sm:justify-center sm:gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF8E9] text-[#B92E26] sm:h-11 sm:w-11">
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-semibold tracking-tight text-[#171717] sm:text-sm">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-neutral-500 sm:text-xs sm:leading-5">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
