import "../../../styles/components/_dashboard.css";

import ProfileHeader from "../components/ProfileHeader";

import MainLayout from "../../../layout/MainLayout";

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
  return (
    <MainLayout>
      <ProfileHeader />

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
                  <div
                    className="bar-fill"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
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
