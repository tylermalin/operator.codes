import Image from "next/image";
import { AUTHOR } from "@/lib/site";

// Small round author photo for bylines. Decorative next to the visible
// name, so alt is empty.
export default function AuthorAvatar({ size = 28 }: { size?: number }) {
  return (
    <Image
      src={AUTHOR.avatar}
      alt=""
      width={size}
      height={size}
      className="inline-block shrink-0 rounded-full border border-border-md object-cover"
      style={{ width: size, height: size }}
    />
  );
}
