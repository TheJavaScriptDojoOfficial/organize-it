import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export default function Card({ children, className = "", elevated = true, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl bg-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        elevated ? "shadow-[0_12px_32px_rgba(42,52,57,0.06)]" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
