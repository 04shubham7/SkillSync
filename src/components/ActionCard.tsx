import { QuickActionType } from "@/constants";
import SpotlightCard from "./ui/SpotlightCard";

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number) {
  let c = hex.trim();
  if (c[0] === "#") c = c.substring(1);
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})` as `rgba(${number}, ${number}, ${number}, ${number})`;
}

function ActionCard({
  action,
  onClick,
}: {
  action: QuickActionType;
  onClick: () => void;
}) {
  // Extract first color from gradient string
  const firstColor = action.gradient.split(",")[0].trim();
  // If it's a hex, convert to rgba, else fallback to a default
  const spotlightColor = firstColor.startsWith("#")
    ? hexToRgba(firstColor, 0.65)
    : ("rgba(59,130,246,0.80)" as `rgba(${number}, ${number}, ${number}, ${number})`);

  return (
    <SpotlightCard
      className="group h-full w-full cursor-pointer flex flex-col justify-start items-start p-6 sm:p-7 md:p-9 glass-surface glass-interactive rounded-xl overflow-hidden"
      spotlightColor={spotlightColor}
    >
      <div
        className="w-full h-full"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        {/* Icon */}
        <div className="flex items-start justify-start mb-6">
          <div
            className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/15 to-white/8 border border-white/15 shadow-lg transition-all duration-400 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-white/40"
            style={{ background: `linear-gradient(135deg, ${action.gradient})` }}
          >
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-400" />
            <action.icon className="w-7 h-7 sm:w-9 sm:h-9 text-white drop-shadow-xl group-hover:scale-110 transition-all duration-400" />
          </div>
        </div>
        {/* Title */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 text-start tracking-tight drop-shadow-lg group-hover:text-blue-100 transition-colors duration-300">
          {action.title}
        </h3>
        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-300 text-start font-normal">
          {action.description}
        </p>
      </div>
    </SpotlightCard>
  );
}

export default ActionCard;
