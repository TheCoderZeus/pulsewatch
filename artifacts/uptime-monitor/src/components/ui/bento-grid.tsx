import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
  className?: string;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-5 rounded-2xl overflow-hidden transition-all duration-300",
            "border border-white/10 bg-white/5 backdrop-blur-sm",
            "hover:shadow-[0_2px_20px_rgba(14,165,233,0.08)]",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            item.hasPersistentHover && "shadow-[0_2px_20px_rgba(14,165,233,0.06)] -translate-y-0.5",
            item.className
          )}
        >
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 group-hover:bg-white/15 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/10 text-gray-300 transition-colors duration-300 group-hover:bg-white/15">
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-white tracking-tight text-[15px]">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-400 leading-snug">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.cta || "Explore →"}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-sky-500/10 to-transparent transition-opacity duration-300",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          />
        </div>
      ))}
    </div>
  );
}
