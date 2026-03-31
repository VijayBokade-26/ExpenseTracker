import { useEffect, useState } from "react";

import "../../../styles/components/_dashboard.css";

import ProfileHeader from "../components/ProfileHeader";

import MainLayout from "../../../layout/MainLayout";
import { Info } from "lucide-react";
import Tooltip from "../../../common/components/Tooltip";
import { fetchDashboardDetails, fetchExpenses } from "../../../services/methods";

const currency = "₹";

const initialDashboardData = {
  totalSpentData: {
    totalSpent: 0,
  },
  categoryWiseSpent: [],
  recentspent: [],
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `${currency}${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "Recent";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", { 
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeCategoryWiseSpent = (categoryWiseSpent, totalSpent = 0) => {
  if (!categoryWiseSpent) return [];

  const rawEntries = Array.isArray(categoryWiseSpent)
    ? categoryWiseSpent
    : typeof categoryWiseSpent === "object"
      ? Object.entries(categoryWiseSpent).map(([label, amount]) => ({
          label,
          amount,
        }))
      : [];

  return rawEntries
    .map((item) => {
      const amount = Number(
        item?.totalSpent ?? item?.amount ?? item?.value ?? item?.total ?? 0,
      );
      const percentage = Number(
        item?.percentage ??
          item?.percent ??
          (totalSpent > 0 ? (amount / totalSpent) * 100 : 0),
      );

      return {
        label:
          item?.label ??
          item?.category ??
          item?._id ??
          item?.name ??
          "Uncategorized",
        amount,
        percentage: Math.max(0, Math.min(100, percentage)),
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

const normalizeRecentSpent = (recentSpent) => {
  const list = Array.isArray(recentSpent)
    ? recentSpent
    : Array.isArray(recentSpent?.data)
      ? recentSpent.data
      : Array.isArray(recentSpent?.items)
        ? recentSpent.items
        : [];

  return list.map((item) => ({
    id: item?.id ?? item?._id ?? null,
    title: item?.title ?? item?.name ?? item?.description ?? "Untitled expense",
    category: item?.category ?? item?.type ?? "Uncategorized",
    amount: Number(item?.amount ?? item?.totalSpent ?? item?.value ?? 0),
    date: formatDate(item?.date ?? item?.createdAt),
  }));
};

const buildDashboardFromExpenses = (expenses) => {
  const list = Array.isArray(expenses) ? expenses : [];

  const categoryMap = list.reduce((acc, item) => {
    const category = item?.category ?? "Uncategorized";
    const amount = Number(item?.amount ?? 0);

    acc[category] = (acc[category] ?? 0) + amount;
    return acc;
  }, {});

  const recent = [...list]
    .sort((a, b) => {
      const aDate = new Date(a?.date ?? a?.createdAt ?? 0).getTime();
      const bDate = new Date(b?.date ?? b?.createdAt ?? 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 5)
    .map((item) => ({
      id: item?.id ?? item?._id ?? null,
      title: item?.title ?? item?.name ?? item?.description ?? "Untitled expense",
      category: item?.category ?? "Uncategorized",
      amount: Number(item?.amount ?? 0),
      date: formatDate(item?.date ?? item?.createdAt),
    }));

  const totalSpent = list.reduce((sum, item) => sum + Number(item?.amount ?? 0), 0);

  return {
    totalSpentData: { totalSpent },
    categoryWiseSpent: Object.entries(categoryMap).map(([label, amount]) => ({
      label,
      amount,
    })),
    recentspent: recent,
  };
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchDashboardDetails();

        if (!isMounted) return;

        setDashboardData(response?.data ?? response ?? initialDashboardData);
      } catch (err) {
        console.error("Error fetching dashboard details:", err);

        if (!isMounted) return;

        try {
          const expensesResponse = await fetchExpenses();

          if (!isMounted) return;

          setDashboardData(buildDashboardFromExpenses(expensesResponse));
          setError("");
        } catch (fallbackError) {
          console.error("Dashboard fallback also failed:", fallbackError);

          if (!isMounted) return;

          setError(
            err?.response?.data?.message ||
              err?.response?.data?.detail ||
              err?.message ||
              "Failed to load dashboard details. Please try again.",
          );
          setDashboardData(initialDashboardData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSpent = Number(
    dashboardData?.totalSpentData?.totalSpent ?? 0,
  );
  const categoryBars = normalizeCategoryWiseSpent(
    dashboardData?.categoryWiseSpent ??
      dashboardData?.categorywisespent ??
      dashboardData?.category_wise_spent ??
      dashboardData?.categoryWise,
    totalSpent,
  );
  const recentExpenses = normalizeRecentSpent(
    dashboardData?.recentspent ??
      dashboardData?.recentSpent ??
      dashboardData?.recent_spent ??
      dashboardData?.recentExpenses ??
      dashboardData?.recent_expenses,
  );
  const topCategory = categoryBars[0];
  const overviewCards = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      helper: loading ? "Loading dashboard data..." : "Based on your current report",
    },
    {
      label: "Categories",
      value: loading ? "..." : String(categoryBars.length),
      helper: "Tracked spending groups",
    },
    {
      label: "Recent Expenses",
      value: loading ? "..." : String(recentExpenses.length),
      helper: "Latest expense entries",
    },
    {
      label: "Top Category",
      value: topCategory ? formatCurrency(topCategory.amount) : "₹0",
      helper: topCategory
        ? topCategory.label
        : "No category data available",
    },
  ];

  return (
    <MainLayout>
      <ProfileHeader />

      {error && (
        <section className="content-card" style={{ marginBottom: "16px" }}>
          <strong style={{ color: "#ef4444" }}>{error}</strong>
        </section>
      )}

      <section className="dashboard-stats">
        {overviewCards.map((card) => (
          <article className="stat-card" key={card.label}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {card.label}
              {card.label === "Total Spent" && (
                <Tooltip
                  position="right"
                  text="If you spent more than 50,000 in a month, it will be highlighted in red."
                >
                  <Info size={16} />
                </Tooltip>
              )}
            </span>
            <strong className={totalSpent > 50000 && card.label === "Total Spent" ? "text-red" : ""}>
              {card.value}
            </strong>
            <p>{card.helper}</p>
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
            <p>{loading ? "Loading recent expenses..." : ""}</p>
          </div>

          <div className="expense-list">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((item, index) => (
                <div
                  className="expense-row"
                  key={item.id ?? `${item.title}-${item.date}-${index}`}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {item.category} · {item.date}
                    </span>
                  </div>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
              ))
            ) : (
              <div className="expense-row">
                <div>
                  <strong>No recent expenses</strong>
                  <span>Once you add expenses, they will appear here.</span>
                </div>
              </div>
            )}
          </div>
        </article>

        <article className="content-card">
          <div className="content-head">
            <div>
              <span className="section-tag">Category Split</span>
              <h3>Look, Where money is going</h3>
            </div>
            <p>{loading ? "Loading category data..." : "Spending grouped by category."}</p>
          </div>

          <div className="bar-list">
            {categoryBars.length > 0 ? (
              categoryBars.map((bar) => (
                <div className="bar-row" key={bar.label}>
                  <div className="bar-meta">
                    <span>{bar.label}</span>
                    <strong>{bar.amount > 0 ? formatCurrency(bar.amount) : `${bar.percentage.toFixed(0)}%`}</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${bar.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="expense-row">
                <div>
                  <strong>No category data</strong>
                  <span>Category totals will show here once the API returns data.</span>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>

      {/* <section className="dashboard-details">
        <div className="content-head">
          <div>
            <span className="section-tag">Your Data</span>
            <h3>Account information</h3>
          </div>
          <p>User details from the API</p>
        </div>
      </section> */}
    </MainLayout>
  );
}

export default Dashboard;
