import type { SVGProps } from "react";
import { EMOJI_TO_KEY, SOCIAL_ICONS } from "./social-icons";

interface SocialIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /** Platform key (e.g. "twitch") or a legacy emoji value (e.g. "🎮"). */
  name: string;
  size?: number;
}

/**
 * Renders the branded vector icon for a link.
 *
 * - If `name` is a known platform key, render the custom vector.
 * - If `name` is a legacy emoji that maps to a platform, render that vector.
 * - Otherwise fall back to rendering the value as text (unknown/custom).
 */
export function SocialIcon({ name, size = 24, ...props }: SocialIconProps) {
  const key = SOCIAL_ICONS[name] ? name : EMOJI_TO_KEY[name];
  const definition = key ? SOCIAL_ICONS[key] : undefined;

  if (definition) {
    return (
      <span style={{ display: "inline-flex" }} aria-hidden="true">
        {definition.render({
          width: size,
          height: size,
          ...props,
        })}
      </span>
    );
  }

  // Unknown / custom value: render as text (legacy emoji or user-provided)
  return (
    <span
      aria-hidden="true"
      style={{ fontSize: size * 0.8, lineHeight: 1, display: "inline-block" }}
    >
      {name}
    </span>
  );
}

/** Resolve a stored icon value to a canonical platform key (or undefined). */
export function resolveIconKey(name?: string): string | undefined {
  if (!name) return undefined;
  return SOCIAL_ICONS[name] ? name : EMOJI_TO_KEY[name];
}
