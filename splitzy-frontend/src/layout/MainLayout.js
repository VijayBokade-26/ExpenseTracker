import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/methods";

function MainLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getUser();

      if (data.detail) {
        handleLogout();
        return;
      }

      setUser(data);
    } catch (error) {
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
        <Sidebar
          user={user}
          loading={loading}
          onLogout={handleLogout}
          logo={logo}
        />

        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
