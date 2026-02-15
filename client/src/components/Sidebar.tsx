import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  Users,
  Grid,
  Target,
  Map,
  Settings,
  LogOut,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "My Courses", href: "/MyCourses" },
  { icon: Library, label: "Resources", href: "/resources" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Grid, label: "Catalog", href: "/catalog" },
  { icon: Users, label: "Groups", href: "/groups" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Map, label: "Learning Paths", href: "/paths" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-screen w-[260px] bg-[#003366] text-white fixed left-0 top-0 z-50 shadow-xl">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-[#003366] shadow-lg shadow-yellow-400/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none">Dolores Central School</h1>
          <p className="text-xs text-blue-200 mt-1 font-medium">cLMS Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-blue-500/20 text-yellow-400 font-semibold shadow-inner"
                    : "text-blue-100 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-yellow-400" : "text-blue-300 group-hover:text-white"
                  )}
                />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-white/5 hover:text-white transition-all text-sm group">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
