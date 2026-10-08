import React from "react";
import "./CashierDashboard.css";

function CashierDashboard({ setActivePage }) {
  return (
    <div className="cashier-dashboard">

      {/* HEADER */}
      <div className="cashier-welcome">

        <div>
          <div className="cashier-eyebrow">
            TODAY'S WORKSPACE
          </div>

          <h2>
            Good morning, Team <span>✦</span>
          </h2>

          <p>
            Here's what needs attention at your Putatan branch today.
          </p>
        </div>

        <div className="cashier-header-actions">
          <button
            className="cashier-primary-button"
            onClick={() => setActivePage("sales")}
          >
            <span>＋</span>
            New sale
          </button>

          <button
            className="cashier-secondary-button"
            onClick={() => setActivePage("queue")}
          >
            <span>▣</span>
            Open order queue
          </button>
        </div>

      </div>


      {/* QUICK ACTIONS */}
      <div className="cashier-quick-grid">

        <button
          className="cashier-quick-card"
          onClick={() => setActivePage("sales")}
        >
          <div className="cashier-quick-icon blue">
            ＋
          </div>

          <div className="cashier-quick-content">
            <strong>New sale</strong>
            <span>Start a POS order</span>
          </div>

          <div className="cashier-arrow">
            →
          </div>
        </button>


        <button
          className="cashier-quick-card"
          onClick={() => setActivePage("queue")}
        >
          <div className="cashier-quick-icon orange">
            ▣
          </div>

          <div className="cashier-quick-content">
            <strong>Central order queue</strong>
            <span>0 active orders</span>
          </div>

          <div className="cashier-arrow">
            →
          </div>
        </button>


        <button
          className="cashier-quick-card"
          onClick={() => setActivePage("menu")}
        >
          <div className="cashier-quick-icon green">
            ◈
          </div>

          <div className="cashier-quick-content">
            <strong>Product availability</strong>
            <span>Check what can be made</span>
          </div>

          <div className="cashier-arrow">
            →
          </div>
        </button>

      </div>


      {/* KPI CARDS */}
      <div className="cashier-stats-grid">

        <div className="cashier-stat-card">
          <div className="cashier-stat-top">
            <span>Today's sales</span>
            <div className="cashier-stat-icon blue">
              ▣
            </div>
          </div>

          <strong>₱0.00</strong>

          <div className="cashier-stat-footer">
            <span className="cashier-badge success">
              ↗ 0 orders
            </span>

            <span>today</span>
          </div>
        </div>


        <div className="cashier-stat-card">
          <div className="cashier-stat-top">
            <span>Orders in queue</span>
            <div className="cashier-stat-icon purple">
              ▣
            </div>
          </div>

          <strong>0</strong>

          <div className="cashier-stat-footer">
            <span className="cashier-badge neutral">
              Awaiting completion
            </span>
          </div>
        </div>


        <div className="cashier-stat-card">
          <div className="cashier-stat-top">
            <span>Low stock items</span>
            <div className="cashier-stat-icon orange">
              ◇
            </div>
          </div>

          <strong>00</strong>

          <div className="cashier-stat-footer">
            <span className="cashier-badge warning">
              All stocked
            </span>

            <span>inventory</span>
          </div>
        </div>


        <div className="cashier-stat-card">
          <div className="cashier-stat-top">
            <span>System status</span>
            <div className="cashier-stat-icon red">
              ◉
            </div>
          </div>

          <strong>Online</strong>

          <div className="cashier-stat-footer">
            <span className="cashier-badge neutral">
              Browser-local mode
            </span>
          </div>
        </div>

      </div>


      {/* LOWER CONTENT */}
      <div className="cashier-main-grid">

        {/* SALES OVERVIEW */}
        <section className="cashier-panel">

          <div className="cashier-panel-header">

            <div>
              <div className="cashier-eyebrow">
                PERFORMANCE
              </div>

              <h3>Sales overview</h3>
            </div>

            <button
              className="cashier-text-button"
              onClick={() => setActivePage("sales")}
            >
              View details →
            </button>

          </div>


          <div className="cashier-sales-summary">

            <div>
              <span>This month</span>
              <strong>₱0.00</strong>
            </div>

            <span>
              0 completed transactions
            </span>

          </div>


          <div className="cashier-chart">

            <div className="cashier-chart-labels">
              <span>₱1.00</span>
              <span>₱0.50</span>
              <span>₱0</span>
            </div>

            <div className="cashier-chart-area">

              {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"].map(
                (day) => (
                  <div
                    className="cashier-chart-column"
                    key={day}
                  >
                    <div className="cashier-chart-bar"></div>
                    <span>{day}</span>
                  </div>
                )
              )}

            </div>

          </div>


          <div className="cashier-sales-footer">

            <div>
              <span>Top-selling product</span>
              <strong>Insufficient data</strong>
            </div>

            <div>
              <span>Low-selling product</span>
              <strong>Insufficient data</strong>
            </div>

          </div>

        </section>


        {/* PRIORITY CENTER */}
        <section className="cashier-panel">

          <div className="cashier-panel-header">

            <div>
              <div className="cashier-eyebrow">
                PRIORITY CENTER
              </div>

              <h3>Needs your attention</h3>
            </div>

          </div>


          <button
            className="cashier-alert-row"
            onClick={() => setActivePage("inventory")}
          >
            <div className="cashier-alert-icon orange">
              ◇
            </div>

            <div>
              <strong>Low stock alerts</strong>
              <span>
                0 ingredients at or below reorder level
              </span>
            </div>

            <b>›</b>
          </button>


          <button
            className="cashier-alert-row"
            onClick={() => setActivePage("inventory")}
          >
            <div className="cashier-alert-icon red">
              ◷
            </div>

            <div>
              <strong>Expiring inventory</strong>
              <span>
                0 items expiring soon or expired
              </span>
            </div>

            <b>›</b>
          </button>


          <button
            className="cashier-alert-row"
            onClick={() => setActivePage("queue")}
          >
            <div className="cashier-alert-icon blue">
              ▣
            </div>

            <div>
              <strong>Active order queue</strong>
              <span>
                0 orders in progress
              </span>
            </div>

            <b>›</b>
          </button>

        </section>

      </div>

    </div>
  );
}

export default CashierDashboard;
