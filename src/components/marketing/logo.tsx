import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn("group relative flex shrink-0 items-center", className)}
    >
      <span className="relative block h-auto w-[104px] overflow-visible">
        <Image
          src="/logo-without-a-navbar.png"
          alt={`${SITE.name} logo`}
          width={1740}
          height={832}
          priority
          className="block h-auto w-full object-contain dark:hidden"
        />

        <Image
          src="/logo-without-a-navbar-dark.png"
          alt=""
          aria-hidden="true"
          width={1740}
          height={832}
          priority
          className="hidden h-auto w-full object-contain dark:block"
        />

        <span
          aria-hidden="true"
          className="logo-a-animated absolute inset-0 block"
        />
      </span>

      <style jsx global>{`
        @keyframes logoAFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .logo-a-animated {
          background: linear-gradient(
            110deg,
            #00c6ff 0%,
            #2563eb 22%,
            #7c3aed 45%,
            #ec4899 68%,
            #06b6d4 84%,
            #00c6ff 100%
          );
          background-size: 350% 350%;
          -webkit-mask-image: url("/logo-a-navbar-mask.png");
          mask-image: url("/logo-a-navbar-mask.png");
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          animation: logoAFlow 3.5s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-a-animated {
            animation: none;
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Link>
  );
}
