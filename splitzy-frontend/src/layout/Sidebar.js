import React from "react";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, redirectTo: "/dashboard" },
  { label: "Expenses", icon: Wallet, redirectTo: "/expenses" },
  { label: "Budgets", icon: PieChart, redirectTo: "/budgets" },
  { label: "Reports", icon: BarChart3, redirectTo: "/reports" },
  { label: "Cards", icon: CreditCard, redirectTo: "/cards" },
  { label: "Settings", icon: Settings, redirectTo: "/settings" },
];

function Sidebar({ user, loading, onLogout, logo }) {
  const Navigate = useNavigate();
  const isActive = (path) => window.location.pathname === path;
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src={logo} alt="Splitzy" />
        <div>
          <p className="sidebar-kicker">Splitzy</p>
          <h1>Workspace</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`sidebar-nav-item ${isActive(item.redirectTo) ? "active" : ""}`}
              onClick={() => Navigate(item.redirectTo)}
            >
              <Icon size={18} className="nav-icon" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-profile" style={{ marginTop: "auto" }}>
        <div className="sidebar-avatar">{getInitials(user?.name)}</div>
        <div>
          <strong>{loading ? "Loading..." : user?.name || "User"}</strong>
          <span>
            {loading ? "Please wait" : user?.email || "user@email.com"}
          </span>
        </div>
      </div>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
