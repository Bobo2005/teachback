const PREFIX = "teachback_";

/** Removes every localStorage key used by this app, so a fresh session starts clean. */
export function clearTeachbackStorage() {
  if (typeof window === "undefined") return;
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
}