export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-line border-t-marquee"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
