import {
  Code2,
  type LucideIcon,
  Megaphone,
  Palette,
  Rocket,
  Search,
  Video,
} from "lucide-react";

/**
 * Fixed accent colors + icons for feature/service bubbles (not theme-aware —
 * these stay the same in light and dark).
 */
const ICON_BUBBLES: { color: string; icon: LucideIcon }[] = [
  { color: "bg-blue-600", icon: Code2 },
  { color: "bg-emerald-500", icon: Search },
  { color: "bg-purple-500", icon: Palette },
  { color: "bg-orange-500", icon: Rocket },
  { color: "bg-pink-500", icon: Megaphone },
  { color: "bg-cyan-500", icon: Video },
];

export function getIconBubble(index: number) {
  return ICON_BUBBLES[index % ICON_BUBBLES.length];
}
