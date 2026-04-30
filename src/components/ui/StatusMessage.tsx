import Card from "./Card";
import Button from "./Button";

interface StatusMessageProps {
  title: string;
  detail: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function StatusMessage({ title, detail, actionLabel, onActionClick }: StatusMessageProps) {
  return (
    <Card className="flex flex-col gap-4 border-l-4 border-[#4d44e3] p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e2dfff] text-[#4d44e3]">
          <span className="material-symbols-outlined">check_circle</span>
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
