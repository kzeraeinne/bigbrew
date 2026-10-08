import { useEffect, useState } from "react";

import "./App.css";

// ==============================
// OWNER MODULES
// ==============================

import Analytics from "./Owner/Analytics";
import MenuProducts from "./Owner/MenuProducts";
import Addons from "./Owner/Addons";
import Ingredients from "./Owner/Ingredients";
import Recipes from "./Owner/Recipes";
import Inventory from "./Owner/Inventory";
import WasteAdjustment from "./Integration/Waste/WasteAdjustment";
import Purchasing from "./Owner/Purchasing";
import Receiving from "./Owner/Receiving";
import InventoryReconciliation from "./Owner/InventoryReconciliation";
import PaymentReconciliation from "./Owner/PaymentReconciliation";
import Expenses from "./Owner/Expenses";
import Reports from "./Owner/Reports";
import UserManagement from "./Owner/UserManagement";
import AuditTrail from "./Owner/AuditTrail";
import SyncStatus from "./Owner/SyncStatus";

// ==============================
// CASHIER-BARISTA MODULES
// ==============================

import NewSale from "./Cashier/NewSale";
import CentralOrderQueue from "./Cashier/CentralOrderQueue";
import ViewMenuProducts from "./Cashier/ViewMenuProducts";
import Waste from "./Integration/Waste/Waste";

// ==============================
// CUSTOMER MODULES
// ==============================

import CustomerMenu from "./Customer/CustomerMenu";
import CustomerQR from "./Customer/CustomerQR";
import CustomerCheckout from "./Customer/CustomerCheckout";
import CustomerPayment from "./Customer/CustomerPayment";
import CustomerReceipt from "./Customer/CustomerReceipt";
import CustomerOrderStatus from "./Customer/CustomerOrderStatus";

// ============================================================
// BIGBREW SMART OPERATIONS
// Branch: Putatan, Muntinlupa City
// Roles: Owner / Cashier-Barista
// ============================================================

const OWNER_MENU = [
  {
    section: "OVERVIEW",
    items: [
      {
        id: "dashboard",
        icon: "▦",
        label: "Dashboard",
      },
      {
        id: "sales",
        icon: "▣",
        label: "Sales",
      },
      {
        id: "analytics",
        icon: "▥",
        label: "Analytics",
      },
    ],
  },

  {
    section: "CATALOG & STOCK",
    items: [
      {
        id: "menu",
        icon: "♧",
        label: "Menu / Products",
      },
      {
        id: "addons",
        icon: "+",
        label: "Add-ons",
      },
      {
        id: "recipes",
        icon: "▱",
        label: "Recipes",
      },
      {
        id: "inventory",
        icon: "▣",
        label: "Inventory",
      },
      {
        id: "waste",
        icon: "♻",
        label: "Waste / Adjustments",
      },
    ],
  },

  {
    section: "PROCUREMENT",
    items: [
      {
        id: "purchasing",
        icon: "▣",
        label: "Purchasing",
      },
      {
        id: "receiving",
        icon: "⇩",
        label: "Receiving",
      },
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
      {
        id: "expenses",
        icon: "₱",
        label: "Expenses",
      },
      {
        id: "reports",
        icon: "▥",
        label: "Reports",
      },
      {
        id: "users",
        icon: "♙",
        label: "User Management",
      },
      {
        id: "audit",
        icon: "∿",
        label: "Audit Trail",
      },
      {
        id: "sync",
        icon: "⟳",
        label: "Offline / Sync Status",
      },
    ],
  },
];

const CASHIER_MENU = [
  {
    section: "WORKSPACE",
    items: [
      {
        id: "dashboard",
        icon: "▦",
        label: "Dashboard",
      },
      {
        id: "new-sale",
        icon: "+",
        label: "New Sale / POS",
      },
      {
        id: "queue",
        icon: "☷",
        label: "Central Order Queue",
      },
      {
        id: "sales",
        icon: "▤",
        label: "Sales",
      },
    ],
  },

  {
    section: "REFERENCE",
    items: [
      {
        id: "products",
        icon: "♨",
        label: "View Menu / Products",
      },
      {
        id: "waste",
        icon: "♻",
        label: "Record Waste",
      },
      {
        id: "sync",
        icon: "⟳",
        label: "Offline / Sync Status",
      },
    ],
  },
];

// ============================================================
// APP
// ============================================================

function App() {
  // ----------------------------------------------------------
  // RESTORE SAVED USER
  // ----------------------------------------------------------

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("bigbrew_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("bigbrew_user");
      return null;
    }
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("bigbrew_user"));
  });

  const [role, setRole] = useState(() => {
    const savedUser = localStorage.getItem("bigbrew_user");

    if (!savedUser) {
      return null;
    }

    try {
      const user = JSON.parse(savedUser);

      const roleValue = String(
        user?.role_name || user?.role_code || ""
      ).toUpperCase();

      if (
        roleValue.includes("CASHIER") ||
        roleValue.includes("BARISTA") ||
        roleValue === "ROLE002"
      ) {
        return "cashier";
      }

      return "owner";
    } catch {
      return null;
    }
  });

  // ----------------------------------------------------------
  // CUSTOMER STATE
  // ----------------------------------------------------------

  const [customerScreen, setCustomerScreen] = useState("menu");
  const [customerCart, setCustomerCart] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // ----------------------------------------------------------
  // URL ROUTING
  // ----------------------------------------------------------

  const params = new URLSearchParams(window.location.search);

  const isCustomerView =
    params.get("customer") === "true";

  const isQRView =
    params.get("qr") === "true";

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------

  function handleLogin(user, remember = false) {
    const roleValue = String(
      user?.role_name || user?.role_code || ""
    ).toUpperCase();

    let selectedRole = "owner";

    if (
      roleValue.includes("CASHIER") ||
      roleValue.includes("BARISTA") ||
      roleValue === "ROLE002"
    ) {
      selectedRole = "cashier";
    }

    setCurrentUser(user);
    setRole(selectedRole);
    setLoggedIn(true);

    if (remember) {
      localStorage.setItem(
        "bigbrew_user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("bigbrew_user");
    }
  }

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------

  function handleLogout() {
    setLoggedIn(false);
    setRole(null);
    setCurrentUser(null);

    localStorage.removeItem("bigbrew_user");
  }

  // ==========================================================
  // CUSTOMER QR VIEW
  // ==========================================================

  if (isQRView) {
    return <CustomerQR />;
  }

  // ==========================================================
  // CUSTOMER MOBILE ORDERING
  // ==========================================================

  if (isCustomerView) {
    // --------------------------------------------------------
    // CHECKOUT
    // --------------------------------------------------------

    if (customerScreen === "checkout") {
      return (
        <CustomerCheckout
          cart={customerCart}
          onBack={() => {
            setCustomerScreen("menu");
          }}
          onProceedToPayment={(data) => {
            setCheckoutData(data);
            setCustomerScreen("payment");
          }}
        />
      );
    }

    // --------------------------------------------------------
    // PAYMENT
    // --------------------------------------------------------

    if (customerScreen === "payment") {
      return (
        <CustomerPayment
          checkoutData={checkoutData}
          onBack={() => {
            setCustomerScreen("checkout");
          }}
          onPaymentComplete={(data) => {
            const orderData = {
              ...data,
              orderNumber: "00127",
              orderStatus: "PREPARING",
            };

            setPaymentData(orderData);
            setCustomerScreen("receipt");
          }}
        />
      );
    }

    // --------------------------------------------------------
    // RECEIPT
    // --------------------------------------------------------

    if (customerScreen === "receipt") {
      return (
        <CustomerReceipt
          paymentData={paymentData}
          onViewOrderStatus={() => {
            setCustomerScreen("status");
          }}
        />
      );
    }

    // --------------------------------------------------------
    // ORDER STATUS
    // --------------------------------------------------------

    if (customerScreen === "status") {
      return (
        <CustomerOrderStatus
          orderData={paymentData}
          onBackToMenu={() => {
            setCustomerCart([]);
            setCheckoutData(null);
            setPaymentData(null);
            setCustomerScreen("menu");
          }}
        />
      );
    }

    // --------------------------------------------------------
    // CUSTOMER MENU
    // --------------------------------------------------------

    return (
      <CustomerMenu
        onProceedToCheckout={(cart) => {
          setCustomerCart(cart);
          setCustomerScreen("checkout");
        }}
      />
    );
  }

  // ==========================================================
  // LOGIN SCREEN
  // ==========================================================

  if (!loggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  // ==========================================================
  // OWNER / CASHIER SYSTEM
  // ==========================================================

  return (
    <Dashboard
      role={role}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}

// ============================================================
// LOGIN
// ============================================================

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ----------------------------------------------------------
  // SUBMIT LOGIN
  // ----------------------------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !username.trim() ||
      !password.trim()
    ) {
      setError(
        "Please enter your username and password."
      );

      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://kzeraeinne.infinityfreeapp.com/bigbrew_api/Api/Auth/Login.php",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.message ||
            "Login failed."
        );

        return;
      }

      const user =
        result?.data?.user;

      if (!user) {
        setError(
          "Login response did not contain user information."
        );

        return;
      }

      onLogin(
        user,
        remember
      );
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Make sure Apache and MySQL are running."
      );
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------------------------
  // LOGIN UI
  // ----------------------------------------------------------

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

        <h1>
          BIGBREW SMART OPERATIONS
        </h1>

        <p className="login-subtitle">
          Branch-Level Sales, QR Ordering &
          Inventory Management System
        </p>

        <p className="login-location">
          Putatan, Muntinlupa City
        </p>

        <div className="login-divider" />

        <h2>
          Sign in to your account
        </h2>

        <form
          onSubmit={handleSubmit}
        >
          <label htmlFor="username">
            Username{" "}
            <span>*</span>
          </label>

          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }
            autoComplete="username"
          />

          <label htmlFor="password">
            Password{" "}
            <span>*</span>
          </label>

          <div className="password-field">
            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label="Show or hide password"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          <div className="login-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) =>
                  setRemember(
                    event.target.checked
                  )
                }
              />

              <span>
                Remember me
              </span>
            </label>

            <button
              type="button"
              className="forgot-button"
              onClick={() =>
                alert(
                  "Password recovery will be available after backend authentication is connected."
                )
              }
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "SIGNING IN..."
              : "LOGIN"}
          </button>
        </form>

        <p className="login-footer">
          Secure branch operations management
        </p>

      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD SHELL
// ============================================================

function Dashboard({
  role,
  currentUser,
  onLogout,
}) {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const isOwner =
    role === "owner";

  const menu = isOwner
    ? OWNER_MENU
    : CASHIER_MENU;

  const pageLabels = {
    dashboard:
      "Dashboard",

    sales: isOwner
      ? "Sales"
      : "Sales / POS",

    analytics:
      "Analytics",

    menu:
      "Menu / Products",

    addons:
      "Add-ons",

    ingredients:
      "Ingredients",

    recipes:
      "Recipes",

    inventory:
      "Inventory",

    waste: isOwner
      ? "Waste / Adjustments"
      : "Record Waste",

    purchasing:
      "Purchasing",

    receiving:
      "Receiving",

    "inventory-reconciliation":
      "Inventory Reconciliation",

    "payment-reconciliation":
      "Payment Reconciliation",

    expenses:
      "Expenses",

    reports:
      "Reports",

    users:
      "User Management",

    audit:
      "Audit Trail",

    sync:
      "Offline / Sync Status",

    "new-sale":
      "New Sale / POS",

    queue:
      "Central Order Queue",

    products:
      "View Menu / Products",
  };

  const activeLabel =
    pageLabels[activePage] ||
    "Dashboard";

  function navigate(page) {
    setActivePage(page);
  }

  const displayName =
    currentUser?.full_name ||
    (isOwner
      ? "Branch Owner"
      : "Cashier-Barista");

  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase();

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? ""
          : "sidebar-collapsed"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src="/bigbrew-logo.png"
            alt="BigBrew"
            className="sidebar-logo"
          />

          <div className="brand-text">
            <strong>
              BIGBREW
            </strong>

            <span>
              SMART OPERATIONS
            </span>
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
            <div
              className="menu-group"
              key={group.section}
            >
              <div className="menu-section-title">
                {group.section}
              </div>

              {group.items.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sidebar-item ${
                      activePage ===
                      item.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      navigate(
                        item.id
                      )
                    }
                  >
                    <span className="sidebar-icon">
                      {item.icon}
                    </span>

                    <span>
                      {item.label}
                    </span>

                    {activePage ===
                      item.id && (
                      <span className="active-indicator" />
                    )}
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="branch-card">
            <div className="branch-card-icon">
              ✦
            </div>

            <div>
              <strong>
                Branch operations
              </strong>

              <span>
                Putatan, Muntinlupa City
              </span>
            </div>
          </div>

          <div className="account-area">
            <div className="avatar">
              {avatarLetter}
            </div>

            <div className="account-info">
              <strong>
                {displayName}
              </strong>

              <span>
                {isOwner
                  ? "Owner account"
                  : "Operations account"}
              </span>
            </div>

            <button
              type="button"
              className="logout-icon"
              onClick={onLogout}
              title="Logout"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="main-content">
        <header className="topbar">
  {activePage === "dashboard" && (
  <header className="topbar">
    <div>
      <div className="breadcrumb">
        Branch Workspace /{" "}
        {isOwner
          ? "Owner"
          : "Cashier-Barista"}
      </div>

      <h1>
        Good evening,{" "}
        {displayName}
      </h1>

      <p>
        Here's what needs attention
        at your Putatan branch today.
      </p>
    </div>

    <div className="topbar-actions">
      <button
        type="button"
        className="secondary-button"
        onClick={() => navigate("reports")}
      >
        ▥ &nbsp; View reports
      </button>
    </div>
  </header>
)}
</header>

        {/* ===================================================
            PAGE ROUTING
        ==================================================== */}

        {activePage ===
        "dashboard" ? (
          isOwner ? (
            <OwnerDashboard
              setActivePage={
                setActivePage
              }
            />
          ) : (
            <CashierDashboard
              setActivePage={
                setActivePage
              }
            />
          )
        ) : activePage ===
          "sales" ? (
          isOwner ? (
            <OwnerSales />
          ) : (
            <ModulePage
              title="Sales / POS"
              role={role}
              activePage={
                activePage
              }
            />
          )
        ) : activePage ===
          "analytics" ? (
          <Analytics />
        ) : activePage ===
          "menu" ? (
          <MenuProducts />
        ) : activePage ===
          "addons" ? (
          <Addons />
        ) : activePage ===
          "ingredients" ? (
          <Ingredients />
        ) : activePage ===
          "recipes" ? (
          <Recipes />
        ) : activePage ===
          "inventory" ? (
          <Inventory />
        ) : activePage ===
          "waste" ? (
          isOwner ? (
            <WasteAdjustment />
          ) : (
            <Waste />
          )
        ) : activePage ===
          "purchasing" ? (
          <Purchasing />
        ) : activePage ===
          "receiving" ? (
          <Receiving />
        ) : activePage ===
          "inventory-reconciliation" ? (
          <InventoryReconciliation />
        ) : activePage ===
          "payment-reconciliation" ? (
          <PaymentReconciliation />
        ) : activePage ===
          "expenses" ? (
          <Expenses />
        ) : activePage ===
          "reports" ? (
          <Reports />
        ) : activePage ===
          "users" ? (
          <UserManagement />
        ) : activePage ===
          "audit" ? (
          <AuditTrail />
        ) : activePage ===
          "sync" ? (
          <SyncStatus />
        ) : activePage ===
          "new-sale" ? (
          <NewSale />
        ) : activePage ===
          "queue" ? (
          <CentralOrderQueue />
        ) : activePage ===
          "products" ? (
          <ViewMenuProducts />
        ) : activePage ===
          "customer-menu" ? (
          <CustomerMenu />
        ) : (
          <ModulePage
            title={activeLabel}
            role={role}
            activePage={
              activePage
            }
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// OWNER DASHBOARD
// ============================================================

function OwnerDashboard({
  setActivePage,
}) {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://kzeraeinne.infinityfreeapp.com/bigbrew_api/Api/Dashboard/List.php"
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load dashboard."
        );
      }

      setDashboard(result.data);

    } catch (error) {
      console.error(
        "Owner Dashboard error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to dashboard API."
      );

    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================================
  // FORMAT MONEY
  // ==========================================================

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  // ==========================================================
  // DEFAULT DATA
  // ==========================================================

  const todaySales =
    dashboard?.today?.sales || 0;

  const todayOrders =
    dashboard?.today?.orders || 0;

  const monthlySales =
    dashboard?.month?.sales || 0;

  const monthlyTransactions =
    dashboard?.month?.transactions || 0;

  const lowStock =
    dashboard?.inventory?.low_stock || 0;

  const expiring =
    dashboard?.inventory?.expiring || 0;

  const weeklySales =
    dashboard?.weekly_sales || {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

  const topSelling =
    dashboard?.products?.top_selling;

  const lowSelling =
    dashboard?.products?.low_selling;

  // ==========================================================
  // CHART
  // ==========================================================

  const chartDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const chartValues =
    chartDays.map(
      (day) =>
        Number(
          weeklySales[day] || 0
        )
    );

  const maxChartValue =
    Math.max(
      ...chartValues,
      1
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="dashboard-content">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            OWNER MANAGEMENT
          </div>

          <h2>
            Dashboard
          </h2>

          <p>
            Monitor sales, inventory,
            purchasing, and branch
            operations.
          </p>

        </div>

      </div>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fff4f4",
            color: "#b42318",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}


      {/* ====================================================
          MAIN STAT CARDS
      ==================================================== */}

      <section className="stats-grid">

        <StatCard
          title="Today's sales"
          value={
            loading
              ? "Loading..."
              : `₱${formatMoney(
                  todaySales
                )}`
          }
          note={
            loading
              ? "Loading..."
              : `${todayOrders} orders today`
          }
          icon="▣"
        />


        <StatCard
          title="Monthly sales"
          value={
            loading
              ? "Loading..."
              : `₱${formatMoney(
                  monthlySales
                )}`
          }
          note={
            loading
              ? "Loading..."
              : "This month"
          }
          icon="↗"
        />


        <StatCard
          title="Low stock items"
          value={
            loading
              ? "..."
              : String(
                  lowStock
                ).padStart(2, "0")
          }
          note={
            lowStock === 0
              ? "All stocked inventory"
              : "Items need attention"
          }
          icon="◇"
        />


        <StatCard
          title="Expiring / expired"
          value={
            loading
              ? "..."
              : String(
                  expiring
                ).padStart(2, "0")
          }
          note="Inventory items"
          icon="◷"
        />

      </section>


      {/* ====================================================
          SALES + PRIORITY
      ==================================================== */}

      <div className="dashboard-grid">

        {/* ==================================================
            SALES OVERVIEW
        ================================================== */}

        <section className="panel sales-panel">

          <div className="panel-header">

            <div>

              <div className="eyebrow">
                PERFORMANCE
              </div>

              <h3>
                Sales overview
              </h3>

            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                setActivePage(
                  "analytics"
                )
              }
            >
              View details →
            </button>

          </div>


          {/* SALES SUMMARY */}

          <div className="sales-summary">

            <div>

              <span>
                This month
              </span>

              <strong>
                {loading
                  ? "Loading..."
                  : `₱${formatMoney(
                      monthlySales
                    )}`}
              </strong>

            </div>

            <span className="transaction-count">

              {loading
                ? "Loading..."
                : `${monthlyTransactions} completed transactions`}

            </span>

          </div>


          {/* CHART */}

          <div className="chart-area">

            <div className="chart-y-axis">

              <span>
                ₱
                {formatMoney(
                  maxChartValue
                )}
              </span>

              <span>
                ₱
                {formatMoney(
                  maxChartValue / 2
                )}
              </span>

              <span>
                ₱0
              </span>

            </div>


            <div className="chart">

              {chartDays.map(
                (day) => {

                  const value =
                    Number(
                      weeklySales[
                        day
                      ] || 0
                    );

                  const height =
                    maxChartValue >
                    0
                      ? Math.max(
                          (value /
                            maxChartValue) *
                            100,
                          value >
                            0
                            ? 5
                            : 0
                        )
                      : 0;

                  return (
                    <div
                      className="chart-column"
                      key={day}
                    >

                      <div
                        className="chart-line"
                        style={{
                          height: `${height}%`,
                        }}
                        title={`₱${formatMoney(
                          value
                        )}`}
                      />

                      <span>
                        {day}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>


          {/* PRODUCT PERFORMANCE */}

          <div className="sales-footer">

            <div>

              <span>
                Top-selling product
              </span>

              <strong>
                {topSelling
                  ? `${topSelling.name} (${topSelling.quantity})`
                  : "Insufficient data"}
              </strong>

            </div>


            <div>

              <span>
                Low-selling product
              </span>

              <strong>
                {lowSelling
                  ? `${lowSelling.name} (${lowSelling.quantity})`
                  : "Insufficient data"}
              </strong>

            </div>

          </div>

        </section>


        {/* ==================================================
            EXISTING PRIORITY CENTER
        ================================================== */}

        <PriorityCenter
          setActivePage={
            setActivePage
          }
        />

      </div>


      {/* ====================================================
          EXISTING BOTTOM DASHBOARD
      ==================================================== */}

      <div className="dashboard-grid bottom-grid">

        <BranchHealth
          setActivePage={
            setActivePage
          }
        />

        <RecentActivity />

      </div>

    </div>
  );
}

// ============================================================
// CASHIER DASHBOARD
// ============================================================

function CashierDashboard({
  setActivePage,
}) {
  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            DAILY OPERATIONS
          </div>

          <h2>
            Dashboard
          </h2>

          <p>
            Keep today's orders,
            sales, and inventory
            moving smoothly.
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
            <div className="eyebrow">
              QUICK ACTIONS
            </div>

            <h3>
              Daily workflow
            </h3>
          </div>
        </div>

        <div className="quick-actions">
          <button
            type="button"
            onClick={() =>
              setActivePage(
                "new-sale"
              )
            }
          >
            <span>
              ▣
            </span>

            <strong>
              New POS Order
            </strong>

            <small>
              Create a customer order
            </small>
          </button>

          <button
            type="button"
            onClick={() =>
              setActivePage(
                "queue"
              )
            }
          >
            <span>
              ☷
            </span>

            <strong>
              Order Queue
            </strong>

            <small>
              Manage active orders
            </small>
          </button>

          <button
            type="button"
            onClick={() =>
              setActivePage(
                "products"
              )
            }
          >
            <span>
              ♧
            </span>

            <strong>
              View Menu
            </strong>

            <small>
              Check products and prices
            </small>
          </button>

          <button
            type="button"
            onClick={() =>
              setActivePage(
                "waste"
              )
            }
          >
            <span>
              ♻
            </span>

            <strong>
              Record Waste
            </strong>

            <small>
              Record spoiled or damaged
              ingredients
            </small>
          </button>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">
                CENTRAL ORDER QUEUE
              </div>

              <h3>
                Active orders
              </h3>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                setActivePage(
                  "queue"
                )
              }
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
              <div className="eyebrow">
                OPERATIONS
              </div>

              <h3>
                Operational alerts
              </h3>
            </div>
          </div>

          <AlertRow
            icon="◇"
            title="Low stock"
            description="No ingredients currently require attention."
            onClick={() =>
              setActivePage(
                "products"
              )
            }
          />

          <AlertRow
            icon="◷"
            title="Expiring inventory"
            description="Check waste records for expired or spoiled ingredients."
            onClick={() =>
              setActivePage(
                "waste"
              )
            }
          />
        </section>
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  note,
  icon,
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <strong>
        {value}
      </strong>

      <div className="stat-bottom">
        <span>
          {note}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// PRIORITY CENTER
// ============================================================

function PriorityCenter({
  setActivePage,
}) {
  return (
    <section className="panel priority-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">
            PRIORITY CENTER
          </div>

          <h3>
            Needs your attention
          </h3>
        </div>
      </div>

      <AlertRow
        icon="◇"
        title="Low stock alerts"
        description="0 ingredients at or below reorder level"
        onClick={() =>
          setActivePage(
            "inventory"
          )
        }
      />

      <AlertRow
        icon="◷"
        title="Expiring inventory"
        description="0 items expiring soon or expired"
        onClick={() =>
          setActivePage(
            "waste"
          )
        }
      />

      <AlertRow
        icon="⇩"
        title="Purchasing & receiving"
        description="0 purchase orders needing review"
        onClick={() =>
          setActivePage(
            "purchasing"
          )
        }
      />

      <AlertRow
        icon="✓"
        title="Inventory variances"
        description="0 physical counts needing review"
        onClick={() =>
          setActivePage(
            "inventory-reconciliation"
          )
        }
      />
    </section>
  );
}

// ============================================================
// BRANCH HEALTH
// ============================================================

function BranchHealth({
  setActivePage,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">
            OPERATIONAL SNAPSHOT
          </div>

          <h3>
            Branch health
          </h3>
        </div>
      </div>

      <div className="health-grid">
        <HealthItem
          title="Restocking needs"
          value="0 recommended"
          icon="▣"
          onClick={() =>
            setActivePage(
              "inventory"
            )
          }
        />

        <HealthItem
          title="Payment variances"
          value="0 to review"
          icon="▤"
          onClick={() =>
            setActivePage(
              "payment-reconciliation"
            )
          }
        />

        <HealthItem
          title="Waste / spoilage"
          value="0 records"
          icon="♧"
          onClick={() =>
            setActivePage(
              "waste"
            )
          }
        />

        <HealthItem
          title="Offline sync"
          value="Backend not connected"
          icon="⟳"
          onClick={() =>
            setActivePage(
              "sync"
            )
          }
        />
      </div>
    </section>
  );
}

// ============================================================
// HEALTH ITEM
// ============================================================

function HealthItem({
  title,
  value,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      className="health-item"
      onClick={onClick}
    >
      <div className="health-icon">
        {icon}
      </div>

      <div>
        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>
      </div>

      <span className="arrow">
        →
      </span>
    </button>
  );
}

// ============================================================
// RECENT ACTIVITY
// ============================================================

function RecentActivity() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">
            RECENT ACTIVITY
          </div>

          <h3>
            Latest updates
          </h3>
        </div>

        <button
          type="button"
          className="text-button"
        >
          View all →
        </button>
      </div>

      <div className="activity">
        <div className="activity-dot" />

        <div>
          <strong>
            Login
          </strong>

          <span>
            Latest login activity
          </span>
        </div>
      </div>

      <div className="empty-activity">
        No additional activity yet.
      </div>
    </section>
  );
}

// ============================================================
// ALERT ROW
// ============================================================

function AlertRow({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className="alert-row"
      onClick={onClick}
    >
      <div className="alert-icon">
        {icon}
      </div>

      <div className="alert-content">
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <span className="alert-arrow">
        ›
      </span>
    </button>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {icon}
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {text}
      </span>
    </div>
  );
}

// ============================================================
// MODULE PLACEHOLDER
// ============================================================

function ModulePage({
  title,
  role,
  activePage,
}) {
  return (
    <div className="module-page">
      <div className="module-card">
        <div className="module-icon">
          ▦
        </div>

        <h2>
          {title}
        </h2>

        <p>
          This{" "}
          {title.toLowerCase()}{" "}
          module is ready for
          connected business
          transactions, database
          integration, and
          role-based operations.
        </p>

        <div className="module-status">
          <span />

          {role === "owner"
            ? "Owner access"
            : "Cashier-Barista access"}
        </div>

        <div className="module-code">
          Module: {activePage}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OWNER SALES
// ============================================================

function OwnerSales() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({
    total_transactions: 0,
    total_sales: 0,
    cash_sales: 0,
    gcash_sales: 0,
    maya_sales: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // LOAD SALES
  // ----------------------------------------------------------

  async function loadSales(searchValue = "") {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (searchValue.trim() !== "") {
        params.set("search", searchValue.trim());
      }

      const url =
        "https://kzeraeinne.infinityfreeapp.com/bigbrew_api/Api/Sales/List.php" +
        (params.toString()
          ? `?${params.toString()}`
          : "");

      const response = await fetch(url);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load sales."
        );
      }

      setSales(
        Array.isArray(result?.data?.sales)
          ? result.data.sales
          : []
      );

      setSummary({
        total_transactions:
          Number(
            result?.data?.summary?.total_transactions || 0
          ),

        total_sales:
          Number(
            result?.data?.summary?.total_sales || 0
          ),

        cash_sales:
          Number(
            result?.data?.summary?.cash_sales || 0
          ),

        gcash_sales:
          Number(
            result?.data?.summary?.gcash_sales || 0
          ),

        maya_sales:
          Number(
            result?.data?.summary?.maya_sales || 0
          ),
      });

    } catch (error) {

      console.error(
        "Owner Sales error:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to the sales API."
      );

      setSales([]);

    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------------------------
  // INITIAL LOAD
  // ----------------------------------------------------------

  useState(() => {
    loadSales();
  });

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  function handleSearch(event) {
    const value = event.target.value;

    setSearch(value);

    loadSales(value);
  }

  // ----------------------------------------------------------
  // FORMAT MONEY
  // ----------------------------------------------------------

  function formatMoney(value) {
    return Number(value || 0).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  // ----------------------------------------------------------
  // FORMAT DATE
  // ----------------------------------------------------------

  function formatDateTime(value) {

    if (!value) {
      return "—";
    }

    const date = new Date(
      value.replace(" ", "T")
    );

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  // ----------------------------------------------------------
  // TODAY'S SALES
  // ----------------------------------------------------------

  const todayString =
    new Date().toLocaleDateString(
      "en-CA"
    );

  const todaysSales = sales.filter(
    (sale) => {

      if (!sale.sale_date) {
        return false;
      }

      const saleDate =
        sale.sale_date.substring(0, 10);

      return saleDate === todayString;
    }
  );

  const todaysSalesTotal =
    todaysSales.reduce(
      (total, sale) =>
        total +
        Number(sale.total_amount || 0),
      0
    );

  // ----------------------------------------------------------
  // PAYMENT LABEL
  // ----------------------------------------------------------

  function paymentLabel(method) {

    if (method === "GCash") {
      return "GCash";
    }

    if (method === "Maya") {
      return "Maya";
    }

    if (method === "Cash") {
      return "Cash";
    }

    return method || "—";
  }

  // ----------------------------------------------------------
  // SOURCE LABEL
  // ----------------------------------------------------------

  function sourceLabel(sale) {

    if (sale.cashier_name) {
      return "Cashier / POS";
    }

    return "Customer Order";
  }

  // ----------------------------------------------------------
  // ITEM COUNT
  // ----------------------------------------------------------

  function getItemCount(sale) {

    if (
      sale.item_count !== undefined &&
      sale.item_count !== null
    ) {
      return Number(sale.item_count);
    }

    return 0;
  }

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (
    <div className="dashboard-content">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            TRANSACTION HISTORY
          </div>

          <h2>
            Sales records
          </h2>

          <p>
            Completed transactions are
            retained for accountability
            and reporting.
          </p>

        </div>

      </div>


      {/* ======================================================
          SALES STATISTICS
      ====================================================== */}

      <section className="stats-grid">

        <StatCard
          title="Completed sales"
          value={
            summary.total_transactions
          }
          note="Completed transactions"
          icon="▣"
        />

        <StatCard
          title="Total sales"
          value={
            `₱${formatMoney(
              summary.total_sales
            )}`
          }
          note="All completed sales"
          icon="₱"
        />

        <StatCard
          title="Today's sales"
          value={
            `₱${formatMoney(
              todaysSalesTotal
            )}`
          }
          note={
            `${todaysSales.length} completed today`
          }
          icon="↗"
        />

      </section>


      {/* ======================================================
          SALES RECORDS
      ====================================================== */}

      <section className="panel sales-records-panel">

        <div className="panel-header">

          <div>

            <div className="eyebrow">
              TRANSACTIONS
            </div>

            <h3>
              All transactions
            </h3>

          </div>

          <input
            className="sales-search"
            type="search"
            placeholder="Search order or customer"
            value={search}
            onChange={handleSearch}
          />

        </div>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div
            style={{
              padding: "14px 18px",
              margin: "0 0 12px",
              borderRadius: "10px",
              background: "#fff4f4",
              color: "#b42318",
              fontSize: "14px",
            }}
          >
            {error}
          </div>

        )}


        {/* ====================================================
            TABLE
        ==================================================== */}

        <div className="sales-table">

          <div className="sales-table-header">

            <span>
              ORDER
            </span>

            <span>
              DATE & TIME
            </span>

            <span>
              CUSTOMER
            </span>

            <span>
              SOURCE
            </span>

            <span>
              ITEMS
            </span>

            <span>
              PAYMENT
            </span>

            <span>
              TOTAL
            </span>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="sales-empty">

              <div className="empty-icon">
                ◌
              </div>

              <strong>
                Loading sales...
              </strong>

              <span>
                Retrieving completed
                transactions from the database.
              </span>

            </div>

          ) : sales.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div className="sales-empty">

              <div className="empty-icon">
                ▣
              </div>

              <strong>
                No sales yet
              </strong>

              <span>
                Completed transactions
                will appear here.
              </span>

            </div>

          ) : (

            /* =================================================
               SALES ROWS
            ================================================= */

            sales.map((sale) => (

              <div
                className="sales-table-row"
                key={sale.sale_id}
              >

                {/* ORDER */}

                <div>

                  <strong>
                    {sale.order_number ||
                      sale.order_code ||
                      "—"}
                  </strong>

                  <small>
                    {sale.sale_code ||
                      "—"}
                  </small>

                </div>


                {/* DATE */}

                <div>
                  {formatDateTime(
                    sale.sale_date
                  )}
                </div>


                {/* CUSTOMER */}

                <div>

                  {sale.customer_name ||
                    "Walk-in Customer"}

                </div>


                {/* SOURCE */}

                <div>
                  {sourceLabel(sale)}
                </div>


                {/* ITEMS */}

                <div>
                  {getItemCount(sale)}
                </div>


                {/* PAYMENT */}

                <div>

                  <strong>
                    {paymentLabel(
                      sale.payment_method
                    )}
                  </strong>

                  {sale.payment_code && (

                    <small>
                      {sale.payment_code}
                    </small>

                  )}

                </div>


                {/* TOTAL */}

                <div>

                  <strong>
                    ₱
                    {formatMoney(
                      sale.total_amount
                    )}
                  </strong>

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {/* ======================================================
          PAYMENT SUMMARY
      ====================================================== */}

      <section
        className="panel"
        style={{
          marginTop: "18px",
        }}
      >

        <div className="panel-header">

          <div>

            <div className="eyebrow">
              PAYMENT BREAKDOWN
            </div>

            <h3>
              Sales by payment method
            </h3>

          </div>

        </div>

        <div
          className="stats-grid"
          style={{
            marginTop: "0",
          }}
        >

          <StatCard
            title="Cash"
            value={
              `₱${formatMoney(
                summary.cash_sales
              )}`
            }
            note="Cash payments"
            icon="₱"
          />

          <StatCard
            title="GCash"
            value={
              `₱${formatMoney(
                summary.gcash_sales
              )}`
            }
            note="GCash payments"
            icon="₱"
          />

          <StatCard
            title="Maya"
            value={
              `₱${formatMoney(
                summary.maya_sales
              )}`
            }
            note="Maya payments"
            icon="₱"
          />

        </div>

      </section>

    </div>
  );
}


export default App;