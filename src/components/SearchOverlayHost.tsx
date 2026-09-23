"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";

/** Mounts the reference search overlay once for the whole site and opens it
 *  whenever any `thread-academy:open-search` event fires. */
export function SearchOverlayHost() {
  const [open, setOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const query = (e as CustomEvent<{ query?: string }>).detail?.query ?? "";
      setInitialQuery(query);
      setOpen(true);
    };
    window.addEventListener("thread-academy:open-search", onOpen);
    return () => window.removeEventListener("thread-academy:open-search", onOpen);
  }, []);

  return <SearchOverlay open={open} initialQuery={initialQuery} onClose={close} />;
}
