import { cn } from "@/lib/utils";

const toneMap = {
  coral: "bg-coral-soft text-coral-dark border border-coral/20",
  teal: "bg-teal-50 text-teal-700 border border-teal-200/60",
  slate: "bg-slate-100 text-slate-600 border border-slate-200/60",
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  red: "bg-red-50 text-red-700 border border-red-200/60",
  amber: "bg-amber-50 text-amber-700 border border-amber-200/60",
};

const dotMap = {
  coral: "bg-coral",
  teal: "bg-teal-500",
  slate: "bg-slate-400",
  green: "bg-emerald-500",
  red: "bg-red-500",
  amber: "bg-amber-500",
};

export function Badge({
  tone = "slate",
  children,
  className,
  dot = false,
}: {
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotMap[tone])} />}
      {children}
    </span>
  );
}

