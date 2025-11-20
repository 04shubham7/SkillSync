import { Blocks } from "lucide-react";
import Link from "next/link";

function Footer() {
    return (
        <footer className="relative mt-auto w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-sm text-zinc-700 dark:text-zinc-400">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-2">
                        <Blocks className="size-4 sm:size-5 text-blue-500 dark:text-blue-400" />
                        <span className="text-center md:text-left text-xs sm:text-sm">
                            SkillSync - Elevate Your Interviews, by 04shubham7
                        </span>
                    </div>

                    {/* Right: Links */}
                    <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                        {['GitHub','LinkedIn','Email'].map(label => (
                          <Link key={label} href="#" className="relative link-glow px-2 py-1 rounded-md transition">
                            <span className="relative z-10">{label}</span>
                          </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
