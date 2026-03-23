import React from "react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";

function MainLayout({ children, user, loading, onLogout }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <Sidebar
          user={user}
          loading={loading}
          onLogout={onLogout}
          logo={logo}
        />

        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
