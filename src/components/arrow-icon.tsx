type Direction = "up-right" | "down" | "up" | "left" | "right";

const paths: Record<Direction, string> = {
  "up-right": "M5 19 19 5M5 5h14v14",
  down: "M12 4v16m-7-7 7 7 7-7",
  up: "M12 20V4m-7 7 7-7 7 7",
  left: "M20 12H4m7-7-7 7 7 7",
  right: "M4 12h16m-7-7 7 7-7 7",
};

export function ArrowIcon({ direction = "up-right" }: { direction?: Direction }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-arrow-icon="" style={{ display: "inline-block", width: "1em", height: "1em", verticalAlign: "-0.15em", flexShrink: 0 }}><path d={paths[direction]} /></svg>;
}
