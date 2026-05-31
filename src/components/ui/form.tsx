import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
  dark = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <label className={cn("grid gap-2 text-sm font-semibold", dark ? "text-white/70" : "text-slate-700", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-coral/60 focus:ring-4 focus:ring-coral/10 hover:border-slate-300";

export const inputClassDark =
  "h-11 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-coral/60 focus:ring-4 focus:ring-coral/20 hover:border-white/25 backdrop-blur";

export const textareaClass =
  "min-h-20 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-coral/60 focus:ring-4 focus:ring-coral/10 hover:border-slate-300";


