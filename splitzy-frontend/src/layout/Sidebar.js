import React from "react";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";

const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Expenses", icon: Wallet },
  { label: "Budgets", icon: PieChart },
  { label: "Reports", icon: BarChart3 },
  { label: "Cards", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

function Sidebar({ user, loading, onLogout, logo }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src={logo} alt="Splitzy" />
        <div>
          <p className="sidebar-kicker">Splitzy</p>
          <h1>Workspace</h1>
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">{getInitials(user?.name)}</div>
        <div>
          <strong>{loading ? "Loading..." : user?.name || "User"}</strong>
          <span>
            {loading ? "Please wait" : user?.email || "user@email.com"}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`sidebar-nav-item ${index === 0 ? "active" : ""}`}
            >
              <Icon size={18} className="nav-icon" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
