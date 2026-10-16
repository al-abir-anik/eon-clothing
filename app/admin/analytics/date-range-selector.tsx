"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Preset = "today" | "7days" | "30days" | "month" | "custom";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getPresetDates(preset: Preset) {
  const today = getToday();

  if (preset === "today") {
    const date = formatDate(today);

    return {
      from: date,
      to: date,
    };
  }

  if (preset === "7days") {
    const from = new Date(today);
    from.setDate(from.getDate() - 6);

    return {
      from: formatDate(from),
      to: formatDate(today),
    };
  }

  if (preset === "30days") {
    const from = new Date(today);
    from.setDate(from.getDate() - 29);

    return {
      from: formatDate(from),
      to: formatDate(today),
    };
  }

  if (preset === "month") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      from: formatDate(from),
      to: formatDate(today),
    };
  }

  return {
    from: "",
    to: "",
  };
}

function getInitialPreset(initialFrom: string, initialTo: string): Preset {
  const presets: Preset[] = ["today", "7days", "30days", "month"];

  for (const preset of presets) {
    const dates = getPresetDates(preset);

    if (dates.from === initialFrom && dates.to === initialTo) {
      return preset;
    }
  }

  return "custom";
}

export function DateRangeSelector({
  initialFrom,
  initialTo,
}: {
  initialFrom?: string;
  initialTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialFromValue = initialFrom ?? "";
  const initialToValue = initialTo ?? "";

  const [preset, setPreset] = useState<Preset>(() =>
    getInitialPreset(initialFromValue, initialToValue),
  );

  const [from, setFrom] = useState(initialFromValue);
  const [to, setTo] = useState(initialToValue);

  function applyRange(nextFrom: string, nextTo: string, nextPreset?: Preset) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextFrom) {
      params.set("from", nextFrom);
    } else {
      params.delete("from");
    }

    if (nextTo) {
      params.set("to", nextTo);
    } else {
      params.delete("to");
    }

    if (nextPreset) {
      setPreset(nextPreset);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePresetChange(nextPreset: Preset) {
    if (nextPreset === "custom") {
      setPreset("custom");
      return;
    }

    const dates = getPresetDates(nextPreset);

    setFrom(dates.from);
    setTo(dates.to);

    applyRange(dates.from, dates.to, nextPreset);
  }

  function handleCustomApply() {
    if (!from || !to || from > to) {
      return;
    }

    applyRange(from, to, "custom");
  }

  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {[
          ["today", "Today"],
          ["7days", "Last 7 Days"],
          ["30days", "Last 30 Days"],
          ["month", "This Month"],
          ["custom", "Custom"],
        ].map(([value, label]) => {
          const active = preset === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handlePresetChange(value as Preset)}
              className={[
                "border px-3 py-2 text-sm font-medium transition",
                active
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {preset === "custom" && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-500">From</span>

            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => setFrom(event.target.value)}
              className="border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-950"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-500">To</span>

            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => setTo(event.target.value)}
              className="border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-950"
            />
          </label>

          <button
            type="button"
            onClick={handleCustomApply}
            disabled={!from || !to || from > to}
            className="border border-neutral-950 bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
