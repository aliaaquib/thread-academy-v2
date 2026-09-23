"use client";

/** Opens the site search overlay (reference behavior: the nav search buttons
 *  and the hero Search button all open the same overlay). */
export function openSiteSearch(query = "") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("thread-academy:open-search", { detail: { query } })
  );
}
