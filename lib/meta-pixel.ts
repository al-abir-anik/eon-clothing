export type MetaPixelEventParams = Record<
  string,
  string | number | boolean | string[] | undefined
>;

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom",
      eventName: string,
      parameters?: MetaPixelEventParams,
    ) => void;
  }
}

export function trackMetaEvent(
  eventName: string,
  parameters?: MetaPixelEventParams,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq !== "function") {
    return;
  }

  window.fbq("track", eventName, parameters);
}