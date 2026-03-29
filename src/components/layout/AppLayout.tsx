import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Home, Droplets, Calendar, Settings, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Detailed Usage", href: "/turf", icon: Droplets },
  { name: "Saving Tips", href: "/tips", icon: Lightbulb },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Property Setup", href: "/setup", icon: Settings },
];

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-surface w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col glass-nav border-r-0 shadow-ambient z-10 sticky top-0 h-screen">
        <div className="p-6">
          <img src="/lawnalyze-logo.png" alt="Lawnalyze" className="h-14 select-none" draggable={false} />
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-primary-fixed text-primary-fixed-variant shadow-sm" 
                    : "text-on-surface hover:bg-surface-container-low"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-secondary")} />
                <span className="font-body font-medium text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 mt-auto text-xs text-on-surface-variant/50 font-medium">
          Lawnalyze © 2026
        </div>
      </aside>

      {/* Mobile Topbar & Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-nav z-50 flex items-center justify-between px-4 shadow-sm">
        <img src="/lawnalyze-logo.png" alt="Lawnalyze" className="h-9 select-none" draggable={false} />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-on-surface">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-surface/95 backdrop-blur-md pt-20 px-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 py-4 px-4 rounded-xl text-lg font-medium transition-colors",
                    isActive ? "bg-primary-fixed text-primary-fixed-variant" : "hover:bg-surface-container-low"
                  )}
                >
                  <item.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-secondary")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 lg:pt-0 overflow-x-hidden min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
