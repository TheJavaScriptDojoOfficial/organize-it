import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export default function Input({ className = "", icon, ...props }: InputProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#f0f4f7] px-4 py-3">
      {icon ? (
        <span className="material-symbols-outlined text-[18px] text-[#566166]">{icon}</span>
      ) : null}
      <input
        className={[
          "w-full bg-transparent text-sm text-[#2a3439] outline-none placeholder:text-[#566166]",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
}
