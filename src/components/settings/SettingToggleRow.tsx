import Card from "../ui/Card";
import Toggle from "../ui/Toggle";

interface SettingToggleRowProps {
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function SettingToggleRow({
  title,
  description,
  checked = false,
  onChange,
}: SettingToggleRowProps) {
  return (
    <Card className="flex items-center justify-between gap-4 p-6">
      <div className="max-w-[80%]">
        <h3 className="text-sm font-bold text-[#2a3439]">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[#566166]">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </Card>
  );
}
