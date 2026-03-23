import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/exp-tracker-logo.png";
import { getUser } from "../services/api";
import "./Dashboard.css";
import ProfileHeader from "./ProfileHeader";

const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const sidebarItems = [
  "Dashboard",
  "Expenses",
  "Budgets",
  "Reports",
  "Cards",
  "Settings",
];

const overviewCards = [
  { label: "Total Spent", value: "₹24,860", trend: "+12%" },
  { label: "This Month", value: "₹8,240", trend: "+4%" },
  { label: "Budget Left", value: "₹11,760", trend: "Safe" },
  { label: "Savings", value: "₹3,120", trend: "+18%" },
];

const recentExpenses = [
  { name: "Groceries", category: "Food", amount: "₹1,280", date: "Today" },
  { name: "Metro", category: "Transport", amount: "₹160", date: "Today" },
  { name: "Internet", category: "Bills", amount: "₹799", date: "Yesterday" },
  { name: "Lunch", category: "Food", amount: "₹420", date: "Yesterday" },
];

const categoryBars = [
  { label: "Food", value: 72 },
  { label: "Transport", value: 42 },
  { label: "Bills", value: 64 },
  { label: "Shopping", value: 31 },
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getUser();

      if (data.detail) {
        alert("Session expired, login again");
        handleLogout();
        return;
      }

      setUser(data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
      alert("Unable to load the dashboard right now.");
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchUser();
  }, [fetchUser, navigate]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-brand">
            <img className="sidebar-logo" src={logo} alt="Expense Tracker" />
            <div>
              <p className="sidebar-kicker">Expense Tracker</p>
              <h1>Workspace</h1>
            </div>
          </div>

          <div className="sidebar-profile">
            <div className="sidebar-avatar">{getInitials(user?.name)}</div>
            <div>
              <strong>{loading ? "Loading..." : user?.name || "User"}</strong>
              <span>{loading ? "Please wait" : user?.email || "user@email.com"}</span>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Dashboard sections">
            {sidebarItems.map((item, index) => (
              <button
                key={item}
                className={`sidebar-nav-item ${index === 0 ? "active" : ""}`}
                type="button"
              >
                <span className="nav-dot" />
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-future">
            <span className="sidebar-note">Coming soon</span>
            <p>
              We can add budgets, split expenses, reports, cards, and analytic views
              here later.
            </p>
          </div>

          <div className="sidebar-footer">
            <button className="sidebar-logout" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <ProfileHeader/>
          {/* <section className="dashboard-hero">
            <div className="hero-top">
              <div className="hero-copy">
                <p className="hero-kicker">Overview / Expense Summary</p>
                <div className="hero-title-row">
                  <h2>{loading ? "Loading profile" : user?.name || "Welcome back"}</h2>
                  <span className="hero-chip">IN</span>
                </div>
                <p className="hero-role">Expense Tracker User</p>
                <p className="hero-description">
                  This layout keeps the visual format you shared: a strong top banner,
                  compact identity block, a metadata strip, and the lower area focused on
                  expense data.
                </p>
              </div>

              <div className="hero-card">
                <div className="hero-avatar">{getInitials(user?.name)}</div>
                <div>
                  <span className="hero-card-label">Profile snapshot</span>
                  <h3>{loading ? "Loading..." : user?.email || "user@email.com"}</h3>
                  <p>{loading ? "Fetching details" : user?.phone || "Not added"}</p>
                </div>
              </div>
            </div>

            <div className="hero-strip">
              <div className="strip-item">
                <span>Email</span>
                <strong>{loading ? "Loading..." : user?.email || "Not added"}</strong>
              </div>
              <div className="strip-item">
                <span>Phone</span>
                <strong>{loading ? "Loading..." : user?.phone || "Not added"}</strong>
              </div>
              <div className="strip-item">
                <span>Location</span>
                <strong>India</strong>
              </div>
              <div className="strip-item">
                <span>Member ID</span>
                <strong>2471</strong>
              </div>
            </div>
          </section> */}

          <section className="dashboard-stats">
            {overviewCards.map((card) => (
              <article className="stat-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.trend}</p>
              </article>
            ))}
          </section>

          <section className="dashboard-content">
            <article className="content-card">
              <div className="content-head">
                <div>
                  <span className="section-tag">Recent Expenses</span>
                  <h3>Latest activity</h3>
                </div>
                <p>Sample expense feed for the page structure.</p>
              </div>

              <div className="expense-list">
                {recentExpenses.map((item) => (
                  <div className="expense-row" key={`${item.name}-${item.amount}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.category} · {item.date}
                      </span>
                    </div>
                    <strong>{item.amount}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="content-card">
              <div className="content-head">
                <div>
                  <span className="section-tag">Category Split</span>
                  <h3>Where money is going</h3>
                </div>
                <p>Simple visual breakdown</p>
              </div>

              <div className="bar-list">
                {categoryBars.map((bar) => (
                  <div className="bar-row" key={bar.label}>
                    <div className="bar-meta">
                      <span>{bar.label}</span>
                      <strong>{bar.value}%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="dashboard-details">
            <div className="content-head">
              <div>
                <span className="section-tag">Your Data</span>
                <h3>Account information</h3>
              </div>
              <p>User details from the API</p>
            </div>

            <div className="detail-card">
              <div className="detail-row">
                <span>Name</span>
                <strong>{loading ? "Loading..." : user?.name || "Not added"}</strong>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <strong>{loading ? "Loading..." : user?.email || "Not added"}</strong>
              </div>
              <div className="detail-row">
                <span>Phone</span>
                <strong>{loading ? "Loading..." : user?.phone || "Not added"}</strong>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
