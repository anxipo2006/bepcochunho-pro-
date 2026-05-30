import { cn } from "@/lib/utils";

const toneMap = {
  coral: "bg-coral-soft text-coral-dark",
  teal: "bg-teal-50 text-teal-700",
  slate: "bg-slate-100 text-slate-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  amber: "bg-amber-50 text-amber-700",
};

export function Badge({
  tone = "slate",
  children,
  className,
}: {
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
