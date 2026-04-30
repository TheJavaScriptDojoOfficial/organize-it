import Card from "../ui/Card";

interface CategoryCardProps {
  icon: string;
  label: string;
  count: string;
  sample?: string;
  tone?: "default" | "primary" | "error" | "tertiary";
  large?: boolean;
}

const toneClasses = {
  default: "text-[#566166] bg-[#f0f4f7]",
  primary: "text-[#4d44e3] bg-[#e2dfff]",
  error: "text-[#9e3f4e] bg-[#ffe4e8]",
  tertiary: "text-[#575e78] bg-[#e9edf7]",
};

export default function CategoryCard({
  icon,
  label,
  count,
  sample,
  tone = "default",
  large = false,
}: CategoryCardProps) {
  return (
    <Card className={["p-5", large ? "md:col-span-2 md:row-span-2" : ""].join(" ")}>
      <div className="mb-4 flex items-start justify-between">
        <div className={["flex h-10 w-10 items-center justify-center rounded-lg", toneClasses[tone]].join(" ")}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="text-2xl font-bold text-[#2a3439]">{count}</span>
      </div>
      <h3 className="font-bold text-[#2a3439]">{label}</h3>
      {sample ? <p className="mt-2 text-xs font-mono text-[#566166]">{sample}</p> : null}
    </Card>
  );
}
