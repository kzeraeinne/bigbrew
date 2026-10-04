import React, { useMemo, useState } from "react";
import "./Inventory.css";

const INITIAL_INVENTORY = [
  {
    id: "INV-001",
    name: "Blueberry Flavor",
    category: "Fruit Tea Flavors / Syrups",
    available: 850,
    total: 850,
    unit: "ml",
    reorder: 160,
    safety: 240,
    unitCost: 0.12,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 2,
  },
  {
    id: "INV-002",
    name: "Brosty Base",
    category: "Brosty Components",
    available: 3500,
    total: 3500,
    unit: "ml",
    reorder: 500,
    safety: 750,
    unitCost: 0.06,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 8,
  },
  {
    id: "INV-003",
    name: "Brusko Coffee Component",
    category: "Coffee Flavors / Syrups",
    available: 850,
    total: 850,
    unit: "ml",
    reorder: 160,
    safety: 240,
    unitCost: 0.13,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-004",
    name: "Caramel Coffee Component",
    category: "Coffee Flavors / Syrups",
    available: 850,
    total: 850,
    unit: "ml",
    reorder: 160,
    safety: 240,
    unitCost: 0.13,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-005",
    name: "Caramel Macchiato Praf Component",
    category: "Praf Components",
    available: 850,
    total: 850,
    unit: "g",
    reorder: 160,
    safety: 240,
    unitCost: 0.15,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-006",
    name: "Strawberry Praf Component",
    category: "Praf Components",
    available: 850,
    total: 850,
    unit: "g",
    reorder: 160,
    safety: 240,
    unitCost: 0.15,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-007",
    name: "Straws",
    category: "Straws",
    available: 700,
    total: 700,
    unit: "pcs",
    reorder: 100,
    safety: 150,
    unitCost: 0.20,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 48,
  },
  {
    id: "INV-008",
    name: "Sugar / Sweetener",
    category: "Sweeteners",
    available: 3500,
    total: 3500,
    unit: "g",
    reorder: 500,
    safety: 750,
    unitCost: 0.02,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 49,
  },
  {
    id: "INV-009",
    name: "Taro Flavor",
    category: "Milk Tea Flavors / Syrups",
    available: 900,
    total: 900,
    unit: "ml",
    reorder: 180,
    safety: 270,
    unitCost: 0.12,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-010",
    name: "Taro Praf Component",
    category: "Praf Components",
    available: 850,
    total: 850,
    unit: "g",
    reorder: 160,
    safety: 240,
    unitCost: 0.15,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-011",
    name: "Tea Component",
    category: "Milk Tea Bases",
    available: 2800,
    total: 2800,
    unit: "g",
    reorder: 400,
    safety: 600,
    unitCost: 0.03,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 20,
  },
  {
    id: "INV-012",
    name: "Vanilla Coffee Component",
    category: "Coffee Flavors / Syrups",
    available: 850,
    total: 850,
    unit: "ml",
    reorder: 160,
    safety: 240,
    unitCost: 0.13,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-013",
    name: "Vanilla Coffee Praf Component",
    category: "Praf Components",
    available: 850,
    total: 850,
    unit: "g",
    reorder: 160,
    safety: 240,
    unitCost: 0.15,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
  {
    id: "INV-014",
    name: "Whipped Cream",
    category: "Toppings / Add-ons",
    available: 750,
    total: 750,
    unit: "g",
    reorder: 150,
    safety: 225,
    unitCost: 0.08,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 0,
  },
  {
    id: "INV-015",
    name: "Wintermelon Flavor",
    category: "Milk Tea Flavors / Syrups",
    available: 900,
    total: 900,
    unit: "ml",
    reorder: 180,
    safety: 270,
    unitCost: 0.12,
    expiration: "2026-12-04",
    status: "IN STOCK",
    linkedProducts: 1,
  },
];

const INITIAL_MOVEMENTS = [
  {
    id: 1,
    date: "2026-10-05 09:20",
    item: "Tea Component",
    type: "RECEIVING",
    quantity: "+2,800 g",
    reference: "GR-10024",
    user: "Owner",
  },
  {
    id: 2,
    date: "2026-10-05 10:15",
    item: "Sugar / Sweetener",
    type: "SALE USAGE",
    quantity: "-150 g",
    reference: "ORD-00127",
    user: "Cashier",
  },
  {
    id: 3,
    date: "2026-10-05 11:05",
    item: "Blueberry Flavor",
    type: "SALE USAGE",
    quantity: "-20 ml",
    reference: "ORD-00128",
    user: "Cashier",
  },
  {
    id: 4,
    date: "2026-10-05 12:40",
    item: "Whipped Cream",
    type: "ADJUSTMENT",
    quantity: "-25 g",
    reference: "ADJ-0007",
    user: "Owner",
  },
];

function formatMoney(value) {
  return `₱${value.toFixed(2)}`;
}

function statusClass(status) {
  if (status === "IN STOCK") return "inv-status-good";
  if (status === "LOW STOCK") return "inv-status-warning";
  if (status === "EXPIRING SOON") return "inv-status-warning";
  if (status === "EXPIRED") return "inv-status-danger";
  if (status === "OUT OF STOCK") return "inv-status-danger";

  return "";
}

export default function Inventory() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [activeTab, setActiveTab] = useState("stock");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [sortBy, setSortBy] = useState("Name");

  const categories = useMemo(
    () => [...new Set(inventory.map((item) => item.category))],
    [inventory]
  );

  const filteredInventory = useMemo(() => {
    let result = inventory.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        category === "All categories" || item.category === category;

      const statusMatch =
        status === "All statuses" || item.status === status;

      return searchMatch && categoryMatch && statusMatch;
    });

    if (sortBy === "Name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "Stock") {
      result.sort((a, b) => a.available - b.available);
    }

    if (sortBy === "Unit Cost") {
      result.sort((a, b) => b.unitCost - a.unitCost);
    }

    return result;
  }, [inventory, search, category, status, sortBy]);

  const totalIngredients = inventory.length;

  const inStock = inventory.filter(
    (item) => item.status === "IN STOCK"
  ).length;

  const lowStock = inventory.filter(
    (item) =>
      item.available <= item.reorder &&
      item.available > 0
  ).length;

  const outOfStock = inventory.filter(
    (item) => item.available <= 0
  ).length;

  const expiringSoon = inventory.filter(
    (item) => item.status === "EXPIRING SOON"
  ).length;

  const expired = inventory.filter(
    (item) => item.status === "EXPIRED"
  ).length;

  const stockValue = inventory.reduce(
    (total, item) => total + item.available * item.unitCost,
    0
  );

  function handleAdjustment(id) {
    const item = inventory.find((entry) => entry.id === id);

    if (!item) return;

    const adjustment = window.prompt(
      `Enter quantity adjustment for ${item.name}.\nUse a positive number to add stock or a negative number to remove stock.`
    );

    if (adjustment === null || adjustment.trim() === "") return;

    const value = Number(adjustment);

    if (!Number.isFinite(value) || value === 0) {
      window.alert("Please enter a valid non-zero quantity.");
      return;
    }

    setInventory((current) =>
      current.map((entry) => {
        if (entry.id !== id) return entry;

        const newStock = Math.max(0, entry.available + value);

        let newStatus = "IN STOCK";

        if (newStock <= 0) {
          newStatus = "OUT OF STOCK";
        } else if (newStock <= entry.reorder) {
          newStatus = "LOW STOCK";
        }

        return {
          ...entry,
          available: newStock,
          status: newStatus,
        };
      })
    );
  }

  return (
    <div className="inventory-page">
      <div className="inventory-page-heading">
        <div>
          <div className="inventory-eyebrow">STOCK CONTROL</div>

          <h1>Inventory</h1>

          <p>
            Monitor ingredient availability, stock levels,
            expiration and inventory movements.
          </p>
        </div>

        <button
          className="inventory-primary-button"
          onClick={() =>
            window.alert(
              "Receiving and stock adjustment workflows will be connected to the backend."
            )
          }
        >
          + Record stock
        </button>
      </div>

      <div className="inventory-stats-grid">
        <div className="inventory-stat-card">
          <span>Total inventory items</span>
          <strong>{totalIngredients}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>In stock</span>
          <strong>{inStock}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>Low / out of stock</span>
          <strong>{lowStock + outOfStock}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>Expiring soon</span>
          <strong>{expiringSoon}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>Expired</span>
          <strong>{expired}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>Estimated stock value</span>
          <strong>{formatMoney(stockValue)}</strong>
        </div>
      </div>

      <div className="inventory-panel">
        <div className="inventory-panel-top">
          <div className="inventory-tabs">
            <button
              className={activeTab === "stock" ? "active" : ""}
              onClick={() => setActiveTab("stock")}
            >
              Stock levels
            </button>

            <button
              className={activeTab === "expiration" ? "active" : ""}
              onClick={() => setActiveTab("expiration")}
            >
              Expiration lots
            </button>

            <button
              className={activeTab === "movement" ? "active" : ""}
              onClick={() => setActiveTab("movement")}
            >
              Movement history
            </button>
          </div>

          <div className="inventory-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search name or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {activeTab === "stock" && (
          <>
            <div className="inventory-filters">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>All categories</option>

                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>All statuses</option>
                <option>IN STOCK</option>
                <option>LOW STOCK</option>
                <option>EXPIRING SOON</option>
                <option>EXPIRED</option>
                <option>OUT OF STOCK</option>
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option>Name</option>
                <option>Stock</option>
                <option>Unit Cost</option>
              </select>
            </div>

            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>INGREDIENT / ID</th>
                    <th>CATEGORY</th>
                    <th>AVAILABLE / TOTAL</th>
                    <th>REORDER / SAFETY</th>
                    <th>UNIT COST</th>
                    <th>EXPIRATION</th>
                    <th>STATUS</th>
                    <th>LINKED PRODUCTS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="inventory-item-name">
                          {item.name}
                        </div>

                        <div className="inventory-item-id">
                          {item.id}
                        </div>
                      </td>

                      <td>{item.category}</td>

                      <td>
                        <strong>
                          {item.available.toLocaleString()} /{" "}
                          {item.total.toLocaleString()} {item.unit}
                        </strong>
                      </td>

                      <td>
                        {item.reorder.toLocaleString()} /{" "}
                        {item.safety.toLocaleString()} {item.unit}
                      </td>

                      <td>{formatMoney(item.unitCost)}</td>

                      <td>{item.expiration}</td>

                      <td>
                        <span
                          className={`inventory-status ${statusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        {item.linkedProducts}{" "}
                        {item.linkedProducts === 1
                          ? "product"
                          : "products"}
                      </td>

                      <td>
                        <button
                          className="inventory-adjust-button"
                          onClick={() =>
                            handleAdjustment(item.id)
                          }
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!filteredInventory.length && (
                    <tr>
                      <td
                        colSpan="9"
                        className="inventory-no-results"
                      >
                        No inventory items match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "expiration" && (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>INGREDIENT</th>
                  <th>LOT / BATCH</th>
                  <th>AVAILABLE</th>
                  <th>RECEIVED</th>
                  <th>EXPIRATION</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <div className="inventory-item-name">
                        {item.name}
                      </div>

                      <div className="inventory-item-id">
                        {item.id}
                      </div>
                    </td>

                    <td>LOT-{String(index + 1).padStart(4, "0")}</td>

                    <td>
                      {item.available.toLocaleString()} {item.unit}
                    </td>

                    <td>2026-10-05</td>

                    <td>{item.expiration}</td>

                    <td>
                      <span
                        className={`inventory-status ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "movement" && (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>DATE / TIME</th>
                  <th>ITEM</th>
                  <th>MOVEMENT</th>
                  <th>QUANTITY</th>
                  <th>REFERENCE</th>
                  <th>USER</th>
                </tr>
              </thead>

              <tbody>
                {INITIAL_MOVEMENTS.map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.date}</td>

                    <td>
                      <div className="inventory-item-name">
                        {movement.item}
                      </div>
                    </td>

                    <td>{movement.type}</td>

                    <td>
                      <strong
                        className={
                          movement.quantity.startsWith("-")
                            ? "inventory-negative"
                            : "inventory-positive"
                        }
                      >
                        {movement.quantity}
                      </strong>
                    </td>

                    <td>{movement.reference}</td>

                    <td>{movement.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="inventory-bottom-grid">
        <div className="inventory-bottom-card">
          <div className="inventory-card-eyebrow">
            STOCK SIGNALS
          </div>

          <h3>Ingredients to restock</h3>

          {lowStock === 0 && outOfStock === 0 ? (
            <div className="inventory-empty">
              <div className="inventory-empty-icon">✓</div>

              <strong>Stock levels healthy</strong>

              <span>
                No ingredients are currently below their
                reorder level.
              </span>
            </div>
          ) : (
            <div className="inventory-alert-list">
              {inventory
                .filter(
                  (item) =>
                    item.available <= item.reorder
                )
                .map((item) => (
                  <div
                    className="inventory-alert-row"
                    key={item.id}
                  >
                    <span>{item.name}</span>
                    <strong>
                      {item.available} {item.unit}
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="inventory-bottom-card">
          <div className="inventory-card-eyebrow">
            ACTIVITY
          </div>

          <h3>Recent stock changes</h3>

          <div className="inventory-activity-list">
            {INITIAL_MOVEMENTS.slice(0, 4).map(
              (movement) => (
                <div
                  className="inventory-activity-row"
                  key={movement.id}
                >
                  <div>
                    <strong>{movement.item}</strong>
                    <span>
                      {movement.type} · {movement.reference}
                    </span>
                  </div>

                  <strong
                    className={
                      movement.quantity.startsWith("-")
                        ? "inventory-negative"
                        : "inventory-positive"
                    }
                  >
                    {movement.quantity}
                  </strong>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}