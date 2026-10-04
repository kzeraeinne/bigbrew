import { useMemo, useState } from "react";
import "./Ingredients.css";

const INGREDIENTS = [
  ["Blueberry Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "2 products"],
  ["Brosty Base", "Brosty Components", "3500 / 3500 ml", "500 / 750 ml", "₱0.06", "2026-12-04", "8 products"],
  ["Brusko Coffee Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Caramel Coffee Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Caramel Macchiato Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Cheesecake Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Chocolate Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Choco Kisses Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Coffee Jelly", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.08", "2026-12-04", "0 products"],
  ["Coffee / Espresso", "Coffee Components", "5000 / 5000 g", "500 / 750 g", "₱0.18", "2026-12-04", "9 products"],
  ["Cookies & Cream Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Cream Cheese", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.10", "2026-12-04", "0 products"],
  ["Cream Puff", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.09", "2026-12-04", "0 products"],
  ["Crushed Oreo", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.09", "2026-12-04", "0 products"],
  ["Crystal", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.07", "2026-12-04", "0 products"],
  ["Dark Choco Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Fudge Coffee Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Green Apple Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Honey Peach Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Kiwi Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Lemon Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Lychee Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Mango Flavor", "Fruit Tea Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Matcha Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.14", "2026-12-04", "2 products"],
  ["Matcha Coffee Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.14", "2026-12-04", "1 product"],
  ["Matcha Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Milk Base", "Milk Tea Bases", "2800 / 2800 g", "400 / 600 g", "₱0.03", "2026-12-04", "20 products"],
  ["Mocha Coffee Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Mocha Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Okinawa Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Pearl", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.07", "2026-12-04", "0 products"],
  ["Red Velvet Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Salted Caramel Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Spanish Latte Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Strawberry Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "2 products"],
  ["Strawberry Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Straws", "Straws", "700 / 700 pcs", "100 / 150 pcs", "₱0.20", "2026-12-04", "48 products"],
  ["Sugar / Sweetener", "Sweeteners", "3500 / 3500 g", "500 / 750 g", "₱0.02", "2026-12-04", "49 products"],
  ["Taro Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Taro Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Tea Component", "Milk Tea Bases", "2800 / 2800 g", "400 / 600 g", "₱0.03", "2026-12-04", "20 products"],
  ["Vanilla Coffee Component", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "1 product"],
  ["Vanilla Coffee Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Whipped Cream", "Toppings / Add-ons", "750 / 750 g", "150 / 225 g", "₱0.08", "2026-12-04", "0 products"],
  ["Wintermelon Flavor", "Milk Tea Flavors / Syrups", "900 / 900 ml", "180 / 270 ml", "₱0.12", "2026-12-04", "1 product"],
  ["Ice", "Ice / Supplies", "12000 / 12000 g", "3000 / 4500 g", "₱0.01", "2026-12-04", "56 products"],
  ["Cups - Regular", "Packaging Supplies", "1000 / 1000 pcs", "150 / 250 pcs", "₱2.20", "2026-12-04", "56 products"],
  ["Cups - Large", "Packaging Supplies", "1000 / 1000 pcs", "150 / 250 pcs", "₱2.60", "2026-12-04", "56 products"],
  ["Cup Seals", "Packaging Supplies", "1000 / 1000 pcs", "150 / 250 pcs", "₱0.85", "2026-12-04", "56 products"],
  ["Plastic Lids", "Packaging Supplies", "1000 / 1000 pcs", "150 / 250 pcs", "₱0.70", "2026-12-04", "56 products"],
  ["Napkins", "Packaging Supplies", "2000 / 2000 pcs", "300 / 500 pcs", "₱0.12", "2026-12-04", "56 products"],
  ["Coffee Cups", "Packaging Supplies", "500 / 500 pcs", "75 / 125 pcs", "₱1.80", "2026-12-04", "8 products"],
  ["Coffee Lids", "Packaging Supplies", "500 / 500 pcs", "75 / 125 pcs", "₱0.65", "2026-12-04", "8 products"],
  ["Chocolate Syrup", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "2 products"],
  ["Caramel Syrup", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "2 products"],
  ["Vanilla Syrup", "Coffee Flavors / Syrups", "850 / 850 ml", "160 / 240 ml", "₱0.13", "2026-12-04", "2 products"],
  ["Creamer", "Coffee Components", "3000 / 3000 g", "400 / 600 g", "₱0.05", "2026-12-04", "8 products"],
  ["Coffee Beans", "Coffee Components", "5000 / 5000 g", "750 / 1000 g", "₱0.22", "2026-12-04", "8 products"],
  ["Condensed Milk", "Milk Components", "3000 / 3000 g", "400 / 600 g", "₱0.06", "2026-12-04", "20 products"],
  ["Fresh Milk", "Milk Components", "5000 / 5000 ml", "750 / 1000 ml", "₱0.08", "2026-12-04", "20 products"],
  ["Water", "Basic Components", "20000 / 20000 ml", "3000 / 5000 ml", "₱0.01", "2026-12-04", "56 products"],
  ["Cheesecake Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Cookies & Cream Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.15", "2026-12-04", "1 product"],
  ["Java Chip Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.16", "2026-12-04", "1 product"],
  ["Creamy Avocado Praf Component", "Praf Components", "850 / 850 g", "160 / 240 g", "₱0.16", "2026-12-04", "1 product"],
  ["Strawberry Brosty Component", "Brosty Components", "3500 / 3500 ml", "500 / 750 ml", "₱0.06", "2026-12-04", "1 product"],
  ["Mango Brosty Component", "Brosty Components", "3500 / 3500 ml", "500 / 750 ml", "₱0.06", "2026-12-04", "1 product"],
  ["Lychee Brosty Component", "Brosty Components", "3500 / 3500 ml", "500 / 750 ml", "₱0.06", "2026-12-04", "1 product"],
];

function statusFromStock(value) {
  const current = Number(value.split("/")[0].trim());
  const reorder = Number(value.split("/")[1]?.trim() || 0);

  if (current <= 0) return "OUT OF STOCK";
  if (reorder && current <= reorder) return "LOW STOCK";
  return "IN STOCK";
}

export default function Ingredients() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Name");
  const [tab, setTab] = useState("stock");

  const categories = [
    "All categories",
    ...new Set(INGREDIENTS.map((item) => item[1])),
  ];

  const filteredIngredients = useMemo(() => {
    let data = [...INGREDIENTS];

    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter((item) =>
        item.join(" ").toLowerCase().includes(q)
      );
    }

    if (category !== "All categories") {
      data = data.filter((item) => item[1] === category);
    }

    if (status !== "All statuses") {
      data = data.filter((item) => statusFromStock(item[2]) === status);
    }

    if (sort === "Name") {
      data.sort((a, b) => a[0].localeCompare(b[0]));
    }

    if (sort === "Category") {
      data.sort((a, b) => a[1].localeCompare(b[1]));
    }

    return data;
  }, [search, category, status, sort]);

  const inStock = INGREDIENTS.filter(
    (item) => statusFromStock(item[2]) === "IN STOCK"
  ).length;

  const lowStock = INGREDIENTS.filter(
    (item) => statusFromStock(item[2]) === "LOW STOCK"
  ).length;

  return (
    <div className="ingredients-page">
      <div className="ingredients-heading">
        <div>
          <div className="ingredients-eyebrow">STOCK CONTROL</div>

          <h1>Ingredients</h1>

          <p>
            Track every component behind the menu, from individual flavors to
            cups and ice.
          </p>
        </div>

        <button className="ingredients-primary-button">
          <span>+</span>
          Add ingredient
        </button>
      </div>

      <div className="ingredients-stat-grid">
        <div className="ingredients-stat-card">
          <span>Total ingredients</span>
          <strong>65</strong>
        </div>

        <div className="ingredients-stat-card">
          <span>In stock</span>
          <strong>{inStock}</strong>
        </div>

        <div className="ingredients-stat-card">
          <span>Low / out of stock</span>
          <strong>{lowStock}</strong>
        </div>

        <div className="ingredients-stat-card">
          <span>Expiring soon</span>
          <strong>0</strong>
        </div>

        <div className="ingredients-stat-card">
          <span>Expired</span>
          <strong>0</strong>
        </div>

        <div className="ingredients-stat-card">
          <span>Estimated stock value</span>
          <strong>₱5,462.00</strong>
        </div>
      </div>

      <div className="ingredients-panel">
        <div className="ingredients-tabs-row">
          <div className="ingredients-tabs">
            <button
              className={tab === "stock" ? "active" : ""}
              onClick={() => setTab("stock")}
            >
              Stock levels
            </button>

            <button
              className={tab === "expiration" ? "active" : ""}
              onClick={() => setTab("expiration")}
            >
              Expiration lots
            </button>

            <button
              className={tab === "movement" ? "active" : ""}
              onClick={() => setTab("movement")}
            >
              Movement history
            </button>
          </div>

          <div className="ingredients-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search name, supplier, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="ingredients-filters">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All statuses</option>
            <option>IN STOCK</option>
            <option>LOW STOCK</option>
            <option>OUT OF STOCK</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Name</option>
            <option>Category</option>
          </select>
        </div>

        {tab === "stock" && (
          <div className="ingredients-table-wrapper">
            <table className="ingredients-table">
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
                </tr>
              </thead>

              <tbody>
                {filteredIngredients.map((item, index) => {
                  const ingredientStatus = statusFromStock(item[2]);

                  return (
                    <tr key={`${item[0]}-${index}`}>
                      <td>
                        <div className="ingredient-name">
                          {item[0]}
                        </div>

                        <div className="ingredient-id">
                          ingredient-{index + 1} · {item[1]}
                        </div>
                      </td>

                      <td>{item[1]}</td>

                      <td className="strong-cell">
                        {item[2]}
                      </td>

                      <td>{item[3]}</td>

                      <td>{item[4]}</td>

                      <td>{item[5]}</td>

                      <td>
                        <span
                          className={`ingredient-status ${ingredientStatus
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {ingredientStatus}
                        </span>
                      </td>

                      <td>{item[6]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!filteredIngredients.length && (
              <div className="ingredients-empty">
                No ingredients match your search or filters.
              </div>
            )}
          </div>
        )}

        {tab === "expiration" && (
          <div className="ingredients-empty-panel">
            <div className="ingredients-empty-icon">◷</div>
            <strong>No expiration alerts</strong>
            <span>
              Ingredients approaching or past their expiration date will
              appear here.
            </span>
          </div>
        )}

        {tab === "movement" && (
          <div className="ingredients-empty-panel">
            <div className="ingredients-empty-icon">↕</div>
            <strong>No recent stock movements</strong>
            <span>
              Purchases, receiving, sales deductions, waste, and adjustments
              will appear here.
            </span>
          </div>
        )}
      </div>

      <div className="ingredients-bottom-grid">
        <div className="ingredients-bottom-card">
          <div className="bottom-eyebrow">STOCK SIGNALS</div>
          <h3>Ingredients to restock</h3>

          <div className="bottom-empty">
            <div className="bottom-empty-icon">□</div>
            <strong>Stock levels healthy</strong>
            <span>No ingredients currently below reorder level.</span>
          </div>
        </div>

        <div className="ingredients-bottom-card">
          <div className="bottom-eyebrow">ACTIVITY</div>
          <h3>Recent stock changes</h3>

          <div className="bottom-empty">
            <div className="bottom-empty-icon">□</div>
            <strong>No activity yet</strong>
            <span>
              Your first sale, receipt, waste record, or adjustment will
              appear here.
            </span>
          </div>
        </div>
      </div>

      <p className="ingredients-footer-note">
        Ingredient records support recipe-based inventory deductions,
        purchasing, receiving, expiration monitoring, waste recording, and
        inventory reconciliation.
      </p>
    </div>
  );
}
