/**
 * URL SAFETY — one shared rule for every URL that can come from content.
 *
 * Only these schemes may become a real link: site-internal paths (/…),
 * page anchors (#…), http(s), mailto: and tel:. Anything else
 * (javascript:, data:, vbscript:, …) is never rendered as a link.
 */
export function isSafeHref(href: string): boolean {
  const h = href.trim();
  if (h === "" || h.startsWith("/") || h.startsWith("#")) return true;
  return /^(https?:\/\/|mailto:|tel:)/i.test(h);
}
