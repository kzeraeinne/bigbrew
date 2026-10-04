function Sidebar({ activePage, setActivePage, onLogout }) {
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Sales / POS", icon: "▤" },
    { name: "Order Queue", icon: "☷" },
    { name: "Menu & Products", icon: "◈" },
    { name: "Recipes", icon: "♢" },
    { name: "Inventory", icon: "▣" },
    { name: "Purchasing", icon: "🛒" },
    { name: "Receiving", icon: "↓" },
    { name: "Waste & Expiration", icon: "⚠" },
    { name: "Reports & Analytics", icon: "▥" },
    { name: "Users & Roles", icon: "♙" },
  ];

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">

        <img
          src="/bigbrew-logo.png"
          alt="BigBrew"
        />

        <div>
          <strong>BIGBREW</strong>
          <span>SMART OPERATIONS</span>
        </div>

      </div>

      {/* BRANCH */}
      <div className="branch-badge">
        <span>●</span>
        Putatan Branch
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-navigation">

        <p className="navigation-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => (
          <button
            key={item.name}
            className={
              activePage === item.name
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage(item.name)}
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </button>
        ))}

      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <button
          className="nav-item"
          onClick={() => setActivePage("Settings")}
        >
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </button>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <span>↪</span>
          <span>Sign Out</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
