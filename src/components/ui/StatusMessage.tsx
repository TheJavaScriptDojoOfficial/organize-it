import Card from "./Card";
import Button from "./Button";

interface StatusMessageProps {
  title: string;
  detail: string;
  tone?: "success" | "warning";
  actionLabel?: string;
  onActionClick?: () => void;
}

const toneStyles: Record<"success" | "warning", { card: string; iconWrap: string; icon: string }> = {
  success: {
    card: "border-l-[#4d44e3]",
    iconWrap: "bg-[#e2dfff] text-[#4d44e3]",
    icon: "check_circle",
  },
  warning: {
    card: "border-l-[#9e3f4e]",
    iconWrap: "bg-[#ffe4e8] text-[#9e3f4e]",
    icon: "warning",
  },
};

export default function StatusMessage({
  title,
  detail,
  tone = "success",
  actionLabel,
  onActionClick,
}: StatusMessageProps) {
  const style = toneStyles[tone];

  return (
    <Card className={`flex flex-col gap-4 border-l-4 p-5 md:flex-row md:items-center md:justify-between ${style.card}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${style.iconWrap}`}>
          <span className="material-symbols-outlined">{style.icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-[#2a3439]">{title}</h3>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">{detail}</p>
        </div>
      </div>
      {actionLabel ? (
        <Button variant="ghost" size="sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
