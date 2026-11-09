"use client";

import { usePathname } from "next/navigation";
import SubscribeButton from "./subscribe-button";

// The archive header carries its own Subscribe button, so the nav copy
// steps aside there. One subscribe action per view.
const PAGES_WITH_OWN_SUBSCRIBE = ["/essays", "/subscribe"];

export default function NavSubscribe() {
  const path = usePathname();
  if (PAGES_WITH_OWN_SUBSCRIBE.includes(path)) return null;
  return <SubscribeButton size="sm" />;
}
