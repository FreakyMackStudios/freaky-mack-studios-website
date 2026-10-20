/**
 * A field people never see or reach (off screen, out of the tab order, hidden from screen readers) but
 * form-filling bots do fill in. If it comes back filled, the enquiry is dropped (src/shared/enquiry.ts).
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-0 -left-[10000px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
