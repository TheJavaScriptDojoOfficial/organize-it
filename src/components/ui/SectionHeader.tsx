interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  meta?: string;
}

export default function SectionHeader({ title, subtitle, meta }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-[#566166]">{subtitle}</p> : null}
      </div>
      {meta ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">{meta}</span>
      ) : null}
    </div>
  );
}
