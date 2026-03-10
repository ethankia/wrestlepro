import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Dumbbell,
  Camera,
  Play,
  Trophy,
  Phone,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import wrestleProIcon from "@/assets/wrestlepro-icon.png";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/tutorials", label: "Tutorials", icon: BookOpen },
  { path: "/workout-creator", label: "Workouts", icon: Dumbbell },
  { path: "/food-scanner", label: "Food Scanner", icon: Camera },
  { path: "/dual-videos", label: "Videos", icon: Play },
  { path: "/daily-tip", label: "Daily Tip", icon: Lightbulb },
  { path: "/associations", label: "Associations", icon: Trophy },
  { path: "/contact", label: "Contact", icon: Phone },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDailyTip = location.pathname === "/daily-tip";

  if (isDailyTip) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-border fixed h-full z-40">
        <Link to="/" className="flex items-center gap-3 p-6 border-b border-border">
          <img src={wrestleProIcon} alt="WrestlePro AI" className="w-10 h-10" />
          <span className="font-heading text-xl uppercase gold-text">WrestlePro AI</span>
        </Link>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-body transition-colors duration-150 ${
                  active
                    ? "gold-text border-r-2 border-gold bg-muted"
                    : "text-muted-foreground hover:text-mat-red"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-body">
            "I can do all things through Christ who strengthens me." — Philippians 4:13
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-border flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={wrestleProIcon} alt="WrestlePro AI" className="w-8 h-8" />
          <span className="font-heading text-lg uppercase gold-text">WrestlePro AI</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 pt-16">
          <nav className="flex flex-col p-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 text-lg font-heading uppercase transition-colors ${
                    active ? "gold-text" : "text-foreground hover:text-mat-red"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 mt-14 lg:mt-0">{children}</main>
    </div>
  );
};

export default Layout;
