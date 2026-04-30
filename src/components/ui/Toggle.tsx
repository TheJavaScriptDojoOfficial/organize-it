interface ToggleProps {
  checked?: boolean;
}

export default function Toggle({ checked = false }: ToggleProps) {
  return (
    <span
      className={[
        "relative inline-flex h-6 w-11 rounded-full transition-colors duration-200",
        checked ? "bg-[#4d44e3]" : "bg-[#e1e9ee]",
      ].join(" ")}
      aria-hidden="true"
    >
      <span
        className={[
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </span>
  );
}
