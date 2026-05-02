import { AlertCircle, CheckCircle2, Info, TriangleAlert, Lightbulb, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "warning" | "danger" | "success" | "tip" | "note";

interface AlertBoxProps {
  type?: AlertType;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<AlertType, string> = {
  info:    "bg-blue-500/10 border-blue-500/20",
  warning: "bg-yellow-500/10 border-yellow-500/20",
  danger:  "bg-red-500/10 border-red-500/20",
  success: "bg-emerald-500/10 border-emerald-500/20",
  tip:     "bg-[#ED8B00]/10 border-[#ED8B00]/30",
  note:    "bg-purple-500/10 border-purple-500/20",
};

const iconColor: Record<AlertType, string> = {
  info: "text-blue-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
  success: "text-emerald-400",
  tip: "text-[#ED8B00]",
  note: "text-purple-400",
};

const icons: Record<AlertType, React.ComponentType<{ className?: string }>> = {
  info: Info,
  warning: TriangleAlert,
  danger: AlertCircle,
  success: CheckCircle2,
  tip: Lightbulb,
  note: StickyNote,
};

export function AlertBox({ type = "info", title, children, className }: AlertBoxProps) {
  const Icon = icons[type];
  return (
    <div className={cn("rounded-xl border p-5 my-6 flex gap-4 items-start", styles[type], className)}>
      <Icon className={cn("w-6 h-6 shrink-0 mt-0.5", iconColor[type])} />
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-foreground mb-1">{title}</h5>
        <div className="text-sm leading-relaxed text-foreground/85 [&_code]:bg-black/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#FFC56B]">
          {children}
        </div>
      </div>
    </div>
  );
}
