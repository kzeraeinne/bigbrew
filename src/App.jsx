import { useState } from "react";
import "./App.css";
import Analytics from "./Owner/Analytics";
import MenuProducts from "./Owner/MenuProducts";
import Addons from "./Owner/Addons";
import Ingredients from "./Owner/Ingredients";
import Recipes from "./Owner/Recipes";
import Inventory from "./Owner/Inventory";


/* =========================================================
   BIGBREW SMART OPERATIONS
   Branch: Putatan, Muntinlupa City
   Roles: Owner / Cashier-Barista
   ========================================================= */

const OWNER_MENU = [
  {
    section: "OVERVIEW",
    items: [
      { id: "dashboard", icon: "▦", label: "Dashboard" },
      { id: "sales", icon: "▣", label: "Sales" },
      { id: "analytics", icon: "▥", label: "Analytics" },
    ],
  },
  {
    section: "CATALOG & STOCK",
    items: [
      { id: "menu", icon: "♧", label: "Menu / Products" },
      { id: "addons", icon: "+", label: "Add-ons" },
      { id: "ingredients", icon: "◇", label: "Ingredients" },
      { id: "recipes", icon: "▱", label: "Recipes" },
      { id: "inventory", icon: "▣", label: "Inventory" },
      { id: "waste", icon: "♧", label: "Waste / Adjustments" },
    ],
  },
  {
    section: "PROCUREMENT",
    items: [
      { id: "purchasing", icon: "▣", label: "Purchasing" },
      { id: "receiving", icon: "⇩", label: "Receiving" },
      {
        id: "inventory-reconciliation",
        icon: "✓",
        label: "Inventory Reconciliation",
      },
      {
        id: "payment-reconciliation",
        icon: "▤",
        label: "Payment Reconciliation",
      },
    ],
  },
  {
    section: "ADMINISTRATION",
    items: [
      { id: "expenses", icon: "₱", label: "Expenses" },
      { id: "reports", icon: "▥", label: "Reports" },
      { id: "users", icon: "♙", label: "User Management" },
      { id: "audit", icon: "∿", label: "Audit Trail" },
      { id: "sync", icon: "⟳", label: "Offline / Sync Status" },
    ],
  },
];

const CASHIER_MENU = [
  {
    section: "WORKSPACCE",
    items: [
      { id: "dashboard", icon: "▦", label: "Dashboard" },
      { id: "add sales", icon: "▣", label: "New Sales/POS" },
      { id: "queue", icon: "☷", label: "Central Order Queue" },
      { id: "sales", icon: "☷", label: "Sales" },
    ],
  },
  {
    section: "REFERENCE",
    items: [
      { id: "product", icon: "⇩", label: "View Menu/Product" },
      { id: "product", icon: "⟳", label: "Product Availability" },
      { id: "product", icon: "⟳", label: "Record Waste" },
      { id: "sync", icon: "⟳", label: "Offline / Sync Status" },
    ],
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("owner");

  if (!loggedIn) {
    return (
      <Login
        onLogin={(selectedRole) => {
          setRole(selectedRole);
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <Dashboard
      role={role}
      onLogout={() => setLoggedIn(false)}
    />
  );
}

/* =========================================================
   LOGIN
   ========================================================= */

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username/email and password.");
      return;
    }

    setError("");

    // Current frontend authentication flow.
    // Backend authentication can replace this later.
    const selectedRole =
      username.toLowerCase().includes("cashier") ||
      username.toLowerCase().includes("barista")
        ? "cashier"
        : "owner";

    if (remember) {
      localStorage.setItem("bigbrew-remember", "true");
    }

    onLogin(selectedRole);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <img
            src="/bigbrew-logo.png"
            alt="BigBrew"
            className="login-logo"
          />
        </div>

        <h1>BIGBREW SMART OPERATIONS</h1>

        <p className="login-subtitle">
          Branch-Level Sales, QR Ordering & Inventory Management System
        </p>

        <p className="login-location">
          Putatan, Muntinlupa City
        </p>

        <div className="login-divider" />

        <h2>Sign in to your account</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username or Email <span>*</span>
          </label>

          <input
            id="username"
            type="text"
            placeholder="Enter your username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label htmlFor="password">
            Password <span>*</span>
          </label>

          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Show or hide password"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="login-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-button"
              onClick={() =>
                alert("Password recovery will be available after backend authentication is connected.")
              }
            >
              Forgot password?
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>

        <p className="login-footer">
          Secure branch operations management
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard({ role, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isOwner = role === "owner";
  const menu = isOwner ? OWNER_MENU : CASHIER_MENU;

  const pageLabels = {
    dashboard: "Dashboard",
    sales: isOwner ? "Sales" : "Sales / POS",
    analytics: "Analytics",
    menu: "Menu / Products",
    addons: "Add-ons",
    ingredients: "Ingredients",
    recipes: "Recipes",
    inventory: "Inventory",
    waste: "Waste / Adjustments",
    purchasing: "Purchasing",
    receiving: "Receiving",
    "inventory-reconciliation": "Inventory Reconciliation",
    "payment-reconciliation": "Payment Reconciliation",
    expenses: "Expenses",
    reports: "Reports",
    users: "User Management",
    audit: "Audit Trail",
    sync: "Offline / Sync Status",
    queue: "Order Queue",
  };

  const activeLabel = pageLabels[activePage] || "Dashboard";

  return (
    <div className={`app-shell ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src="/bigbrew-logo.png"
            alt="BigBrew"
            className="sidebar-logo"
          />

          <div className="brand-text">
            <strong>BIGBREW</strong>
            <span>SMART OPERATIONS</span>
          </div>
        </div>

        <div className="workspace">
          <div className="workspace-label">
            <span className="status-dot" />
            BRANCH WORKSPACE
          </div>

          <div className="workspace-name">
            Putatan, Muntinlupa City
          </div>
        </div>

        <div className="sidebar-scroll">
          {menu.map((group) => (
            <div className="menu-group" key={group.section}>
              <div className="menu-section-title">
                {group.section}
              </div>

              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item ${
                    activePage === item.id ? "active" : ""
                  }`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>

                  {activePage === item.id && (
                    <span className="active-indicator" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="branch-card">
            <div className="branch-card-icon">✦</div>
            <div>
              <strong>Branch operations</strong>
              <span>Putatan, Muntinlupa City</span>
            </div>
          </div>

          <div className="account-area">
            <div className="avatar">
              {isOwner ? "B" : "C"}
            </div>

            <div className="account-info">
              <strong>
                {isOwner ? "Branch Owner" : "Cashier-Barista"}
              </strong>
              <span>
                {isOwner ? "Owner account" : "Operations account"}
              </span>
            </div>

            <button
              className="logout-icon"
              onClick={onLogout}
              title="Logout"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Branch Workspace / {isOwner ? "Owner" : "Cashier-Barista"}
            </div>

            <h1>
              Good evening, {isOwner ? "Owner" : "Cashier-Barista"}
            </h1>

            <p>
              Here's what needs attention at your Putatan branch today.
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="secondary-button"
              onClick={() => setActivePage("reports")}
            >
              ▥ &nbsp; View reports
            </button>
          </div>
        </header>

      
  {activePage === "dashboard" ? (
  isOwner ? (
    <OwnerDashboard setActivePage={setActivePage} />
  ) : (
    <CashierDashboard setActivePage={setActivePage} />
  )
) : activePage === "sales" ? (
  <OwnerSales />
) : activePage === "analytics" ? (
  <Analytics />
) : activePage === "menu" ? (
  <MenuProducts />
  ) : activePage === "addons" ? (
  <Addons />
  ) : activePage === "ingredients" ? (
  <Ingredients />
  ) : activePage === "recipes" ? (
  <Recipes />
  ) : activePage === "inventory" ? (
  <Inventory />
  ) : activePage === "waste/adjustment" ? (
  <WasteAdjustment />
  ) : activePage === "purchasing" ? (
  <Purchasing/>
  ) : activePage === "receiving" ? (
  <Receiving />
  ) : activePage === "inventory reconciliation" ? (
  <InventoryReconciliation />
   ) : activePage === "payment reconciliation" ? (
  <PaymentReconciliation />
   ) : activePage === "expenses" ? (
  <Expenses />
    ) : activePage === "reports" ? (
  <Reports />
    ) : activePage === "user management" ? (
  <UserManagement />
    ) : activePage === "audit trail" ? (
  <AuditTrail />
) : (

  <ModulePage
    title={activeLabel}
    role={role}
    activePage={activePage}
  />
)}
      </main>
    </div>
  );
}

/* =========================================================
   OWNER DASHBOARD
   ========================================================= */

function OwnerDashboard({ setActivePage }) {
  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">OWNER MANAGEMENT</div>
          <h2>Dashboard</h2>
          <p>
            Monitor sales, inventory, purchasing, and branch operations.
          </p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Today's sales"
          value="₱0.00"
          note="0 orders today"
          icon="▣"
        />

        <StatCard
          title="Monthly sales"
          value="₱0.00"
          note="This month"
          icon="↗"
        />

        <StatCard
          title="Low stock items"
          value="00"
          note="All stocked inventory"
          icon="◇"
        />

        <StatCard
          title="Expiring / expired"
          value="00"
          note="Inventory items"
          icon="◷"
        />
      </section>

      <div className="dashboard-grid">
        <section className="panel sales-panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">PERFORMANCE</div>
              <h3>Sales overview</h3>
            </div>

            <button
              className="text-button"
              onClick={() => setActivePage("analytics")}
            >
              View details →
            </button>
          </div>

          <div className="sales-summary">
            <div>
              <span>This month</span>
              <strong>₱0.00</strong>
            </div>

            <span className="transaction-count">
              0 completed transactions
            </span>
          </div>

          <div className="chart-area">
            <div className="chart-y-axis">
              <span>₱1.00</span>
              <span>₱0.50</span>
              <span>₱0</span>
            </div>

            <div className="chart">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div className="chart-column" key={day}>
                    <div className="chart-line" />
                    <span>{day}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="sales-footer">
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

        <PriorityCenter setActivePage={setActivePage} />
      </div>

      <div className="dashboard-grid bottom-grid">
        <BranchHealth setActivePage={setActivePage} />

        <RecentActivity />
      </div>
    </div>
  );
}

/* =========================================================
   CASHIER DASHBOARD
   ========================================================= */

function CashierDashboard({ setActivePage }) {
  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">DAILY OPERATIONS</div>
          <h2>Dashboard</h2>
          <p>
            Keep today's orders, sales, and inventory moving smoothly.
          </p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Today's sales"
          value="₱0.00"
          note="0 orders today"
          icon="▣"
        />

        <StatCard
          title="Orders today"
          value="00"
          note="Current day"
          icon="☷"
        />

        <StatCard
          title="Active orders"
          value="00"
          note="Needs attention"
          icon="◷"
        />

        <StatCard
          title="Low stock alerts"
          value="00"
          note="Inventory"
          icon="◇"
        />
      </section>

      <section className="quick-actions-panel panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">QUICK ACTIONS</div>
            <h3>Daily workflow</h3>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={() => setActivePage("pos")}>
            <span>▣</span>
            <strong>New POS Order</strong>
            <small>Create a customer order</small>
          </button>

          <button onClick={() => setActivePage("queue")}>
            <span>☷</span>
            <strong>Order Queue</strong>
            <small>Manage active orders</small>
          </button>

          <button onClick={() => setActivePage("menu")}>
            <span>♧</span>
            <strong>View Menu</strong>
            <small>Check products and prices</small>
          </button>

          <button onClick={() => setActivePage("inventory")}>
            <span>▣</span>
            <strong>View Inventory</strong>
            <small>Check ingredient stock</small>
          </button>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">CENTRAL ORDER QUEUE</div>
              <h3>Active orders</h3>
            </div>

            <button
              className="text-button"
              onClick={() => setActivePage("queue")}
            >
              Open queue →
            </button>
          </div>

          <EmptyState
            icon="☷"
            title="No active orders"
            text="POS and customer QR orders will appear here."
          />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">INVENTORY</div>
              <h3>Operational alerts</h3>
            </div>

            <button
              className="text-button"
              onClick={() => setActivePage("inventory")}
            >
              View inventory →
            </button>
          </div>

          <AlertRow
            icon="◇"
            title="Low stock"
            description="No ingredients currently require attention."
          />

          <AlertRow
            icon="◷"
            title="Expiring inventory"
            description="No items are currently expiring."
          />
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function StatCard({ title, value, note, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>

      <strong>{value}</strong>

      <div className="stat-bottom">
        <span>{note}</span>
      </div>
    </div>
  );
}

function PriorityCenter({ setActivePage }) {
  return (
    <section className="panel priority-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">PRIORITY CENTER</div>
          <h3>Needs your attention</h3>
        </div>
      </div>

      <AlertRow
        icon="◇"
        title="Low stock alerts"
        description="0 ingredients at or below reorder level"
        onClick={() => setActivePage("inventory")}
      />

      <AlertRow
        icon="◷"
        title="Expiring inventory"
        description="0 items expiring soon or expired"
        onClick={() => setActivePage("waste")}
      />

      <AlertRow
        icon="⇩"
        title="Purchasing & receiving"
        description="0 purchase orders needing review"
        onClick={() => setActivePage("purchasing")}
      />

      <AlertRow
        icon="✓"
        title="Inventory variances"
        description="0 physical counts needing review"
        onClick={() => setActivePage("inventory-reconciliation")}
      />
    </section>
  );
}

function BranchHealth({ setActivePage }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">OPERATIONAL SNAPSHOT</div>
          <h3>Branch health</h3>
        </div>
      </div>

      <div className="health-grid">
        <HealthItem
          title="Restocking needs"
          value="0 recommended"
          icon="▣"
          onClick={() => setActivePage("purchasing")}
        />

        <HealthItem
          title="Payment variances"
          value="0 to review"
          icon="▤"
          onClick={() => setActivePage("payment-reconciliation")}
        />

        <HealthItem
          title="Waste / spoilage"
          value="0 records"
          icon="♧"
          onClick={() => setActivePage("waste")}
        />

        <HealthItem
          title="Offline sync"
          value="Backend not connected"
          icon="⟳"
          onClick={() => setActivePage("sync")}
        />
      </div>
    </section>
  );
}

function HealthItem({ title, value, icon, onClick }) {
  return (
    <button className="health-item" onClick={onClick}>
      <div className="health-icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <span className="arrow">→</span>
    </button>
  );
}

function RecentActivity() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">RECENT ACTIVITY</div>
          <h3>Latest updates</h3>
        </div>

        <button className="text-button">View all →</button>
      </div>

      <div className="activity">
        <div className="activity-dot" />

        <div>
          <strong>Login</strong>
          <span>Branch Owner · Today</span>
        </div>
      </div>

      <div className="empty-activity">
        No additional activity yet.
      </div>
    </section>
  );
}

function AlertRow({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      className="alert-row"
      onClick={onClick}
      type="button"
    >
      <div className="alert-icon">{icon}</div>

      <div className="alert-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <span className="alert-arrow">›</span>
    </button>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

/* =========================================================
   MODULE PAGE
   ========================================================= */

function ModulePage({ title, role, activePage }) {
  return (
    <div className="module-page">
      <div className="module-card">
        <div className="module-icon">▦</div>

        <h2>{title}</h2>

        <p>
          This {title.toLowerCase()} module is ready for
          connected business transactions, database integration,
          and role-based operations.
        </p>

        <div className="module-status">
          <span />
          {role === "owner" ? "Owner access" : "Cashier-Barista access"}
        </div>

        <div className="module-code">
          Module: {activePage}
        </div>
      </div>
    </div>
  );
}

function OwnerSales() {
  return (
    <div className="dashboard-content">

      <div className="page-heading">
        <div>
          <div className="eyebrow">TRANSACTION HISTORY</div>

          <h2>Sales records</h2>

          <p>
            Completed transactions are retained for accountability and reporting.
          </p>
        </div>
      </div>

      <section className="stats-grid">

        <StatCard
          title="Completed sales"
          value="0"
          note="Completed transactions"
          icon="▣"
        />

        <StatCard
          title="Total sales"
          value="₱0.00"
          note="All completed sales"
          icon="₱"
        />

        <StatCard
          title="Today's sales"
          value="₱0.00"
          note="Completed today"
          icon="↗"
        />

      </section>

      <section className="panel sales-records-panel">

        <div className="panel-header">

          <div>
            <div className="eyebrow">TRANSACTIONS</div>
            <h3>All transactions</h3>
          </div>

          <input
            className="sales-search"
            type="search"
            placeholder="Search order or customer"
          />

        </div>

        <div className="sales-table">

          <div className="sales-table-header">
            <span>ORDER</span>
            <span>DATE & TIME</span>
            <span>CUSTOMER</span>
            <span>SOURCE</span>
            <span>ITEMS</span>
            <span>PAYMENT</span>
            <span>TOTAL</span>
          </div>

          <div className="sales-empty">

            <div className="empty-icon">▣</div>

            <strong>No sales yet</strong>

            <span>
              Completed transactions will appear here.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default App;
