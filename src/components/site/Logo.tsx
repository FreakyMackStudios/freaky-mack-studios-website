import { LOCKUP, LOCKUP_WIDE, MARK, type LogoArt } from "./logo-paths";

type Props = {
  className?: string;
  /** Accessible name; leave out for a decorative logo. */
  title?: string;
  /** Pin the artwork to the left of its box (like object-position: left). */
  alignLeft?: boolean;
  /**
   * Draw the mark in the logo colour (--logo-mark: the brand blue on light pages, white on dark), as in the
   * brand file. Off, the whole logo takes the current text colour (for faint watermarks and inverse slabs).
   */
  brand?: boolean;
};

/**
 * The client's official logo as inline vector art (FMS_Logo.pdf). The lettering is drawn in the current
 * text colour, so it is black on the light page, white on the dark page and flips inside inverse slabs.
 */
function LogoSvg({ art, className = "", title, alignLeft, brand = false }: Props & { art: LogoArt }) {
  return (
    <svg
      viewBox={`0 0 ${art.w} ${art.h}`}
      preserveAspectRatio={alignLeft ? "xMinYMid meet" : "xMidYMid meet"}
      fill="currentColor"
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <g fill={brand ? "var(--logo-mark, currentColor)" : undefined}>
        {art.mark.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {art.text.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** The mark on its own: a slash, an arch and a smiling circle. */
export const Mark = (props: Props) => <LogoSvg art={MARK} {...props} />;
/** The stacked logo: mark, FREAKY MACK STUDIOS and the tagline. */
export const Lockup = (props: Props) => <LogoSvg art={LOCKUP} {...props} />;
/** The side-by-side logo: mark, then FREAKY MACK STUDIOS over the tagline (the header). */
export const LockupWide = (props: Props) => <LogoSvg art={LOCKUP_WIDE} {...props} />;
