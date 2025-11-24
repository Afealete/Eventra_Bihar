export function log(...args: any[]) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

export function error(...args: any[]) {
  // On server always log errors; in client only in non-production
  if (typeof window === "undefined") {
    // eslint-disable-next-line no-console
    console.error(...args);
  } else if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}
