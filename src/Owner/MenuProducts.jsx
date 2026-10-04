import { useMemo, useState } from "react";
import "./MenuProducts.css";

/* =========================================================
   BIGBREW SMART OPERATIONS
   MENU / PRODUCTS
   Branch: Putatan, Muntinlupa City
   ========================================================= */

const PRODUCT_GROUPS = [
  {
    category: "Milk Tea",
    type: "Milk Tea",
    regular: 29,
    large: 39,
    products: [
      "Dark Choco",
      "Cookies & Cream",
      "Okinawa",
      "Wintermelon",
      "Cheesecake",
      "Matcha",
      "Chocolate",
      "Red Velvet",
      "Salted Caramel",
      "Choco Kisses",
      "Taro",
      "Strawberry",
    ],
  },

  {
    category: "Coffee",
    type: "Iced Coffee",
    regular: 39,
    large: 49,
    products: [
      "Brusko",
      "Mocha",
      "Macchiato",
      "Vanilla",
      "Caramel",
      "Matcha",
      "Fudge",
      "Spanish Latte",
    ],
  },

  {
    category: "Coffee",
    type: "Hot Coffee",
    regular: 39,
    large: 49,
    products: [
      "Brusko",
      "Mocha",
      "Macchiato",
      "Vanilla",
      "Caramel",
      "Matcha",
      "Fudge",
      "Spanish Latte",
    ],
  },

  {
    category: "Fruit Tea",
    type: "Fruit Tea",
    regular: 29,
    large: 39,
    products: [
      "Lychee",
      "Green Apple",
      "Blueberry",
      "Lemon",
      "Strawberry",
      "Kiwi",
      "Mango",
      "Honey Peach",
    ],
  },

  {
    category: "Brosty",
    type: "Brosty",
    regular: 49,
    large: 59,
    products: [
      "Lychee",
      "Green Apple",
      "Blueberry",
      "Lemon",
      "Strawberry",
      "Kiwi",
      "Mango",
      "Honey Peach",
    ],
  },

  {
    category: "Praf",
    type: "Praf",
    regular: 49,
    large: 59,
    products: [
      "Coffee Jelly",
      "Caramel Macchiato",
      "Mocha",
      "Vanilla Coffee",
      "Java Chip",
      "Cheesecake",
      "Cookies & Cream",
      "Creamy Avocado",
      "Chocolate",
      "Matcha",
      "Strawberry",
      "Taro",
    ],
  },
];

/* ---------------------------------------------------------
   BUILD THE 56 PRODUCTS
--------------------------------------------------------- */

const INITIAL_PRODUCTS = PRODUCT_GROUPS.flatMap((group, groupIndex) =>
  group.products.map((name, index) => ({
    id: `${group.category.toLowerCase().replace(/\s+/g, "-")}-${group.type
      .toLowerCase()
      .replace(/\s+/g, "-")}-${index + 1}`,
    name,
    category: group.category,
    type: group.type,
    regular: group.regular,
    large: group.large,
    available: true,
    groupIndex,
  })),
);

/* ---------------------------------------------------------
   MONEY FORMAT
--------------------------------------------------------- */

function peso(amount) {
  return `₱${Number(amount).toFixed(2)}`;
}

/* ---------------------------------------------------------
   PRODUCT ICON
--------------------------------------------------------- */

function ProductIcon({ category }) {
  const icons = {
    "Milk Tea": "🧋",
    Coffee: "☕",
    "Fruit Tea": "🍹",
    Brosty: "🥤",
    Praf: "🥛",
  };

  return (
    <div className="mp-product-icon">
      <span>{icons[category] || "🥤"}</span>
    </div>
  );
}

/* =========================================================
   MENU PRODUCTS
   ========================================================= */

export default function MenuProducts() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All products");
  const [availability, setAvailability] = useState("All availability");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editRegular, setEditRegular] = useState("");
  const [editLarge, setEditLarge] = useState("");

  const categories = [
    "All products",
    "Milk Tea",
    "Coffee",
    "Fruit Tea",
    "Brosty",
    "Praf",
  ];

  /* -------------------------------------------------------
     FILTER PRODUCTS
  ------------------------------------------------------- */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query);

      const matchesCategory =
        category === "All products" || product.category === category;

      const matchesAvailability =
        availability === "All availability" ||
        (availability === "Available" && product.available) ||
        (availability === "Unavailable" && !product.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, category, availability]);

  /* -------------------------------------------------------
     EDIT PRICE
  ------------------------------------------------------- */

  function openPriceEditor(product) {
    setEditingProduct(product);
    setEditRegular(String(product.regular));
    setEditLarge(String(product.large));
  }

  function savePrice() {
    if (!editingProduct) return;

    const regular = Number(editRegular);
    const large = Number(editLarge);

    if (!Number.isFinite(regular) || regular < 0) {
      alert("Please enter a valid regular price.");
      return;
    }

    if (!Number.isFinite(large) || large < 0) {
      alert("Please enter a valid large price.");
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              regular,
              large,
            }
          : product,
      ),
    );

    setEditingProduct(null);
  }

  /* -------------------------------------------------------
     TOGGLE AVAILABILITY
  ------------------------------------------------------- */

  function toggleAvailability(productId) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              available: !product.available,
            }
          : product,
      ),
    );
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="menu-products-page">
      {/* PAGE HEADER */}

      <div className="mp-page-header">
        <div>
          <div className="mp-eyebrow">PRODUCT CATALOG</div>

          <h1>Menu / Products</h1>

          <p>
            Manage the complete BigBrew branch menu, pricing, product types,
            and availability.
          </p>
        </div>

        <div className="mp-product-count">
          <strong>{products.length}</strong>
          <span>PRODUCTS</span>
        </div>
      </div>

      {/* MAIN CARD */}

      <div className="mp-card">
        {/* TOOLBAR */}

        <div className="mp-toolbar">
          <div className="mp-search-wrapper">
            <span className="mp-search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mp-select"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="mp-select"
          >
            <option>All availability</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
        </div>

        {/* RESULT SUMMARY */}

        <div className="mp-result-summary">
          Showing <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </div>

        {/* TABLE */}

        <div className="mp-table-wrapper">
          <table className="mp-table">
            <thead>
              <tr>
                <th className="mp-product-column">PRODUCT</th>
                <th>CATEGORY</th>
                <th>TYPE</th>
                <th>REGULAR / HOT</th>
                <th>LARGE</th>
                <th>AVAILABILITY</th>
                <th className="mp-action-column">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  {/* PRODUCT */}

                  <td>
                    <div className="mp-product-cell">
                      <ProductIcon category={product.category} />

                      <div>
                        <strong>{product.name}</strong>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}

                  <td>
                    <span className="mp-category-text">
                      {product.category}
                    </span>
                  </td>

                  {/* TYPE */}

                  <td>
                    <span
                      className={`mp-type-badge ${
                        product.type === "Iced Coffee"
                          ? "iced"
                          : product.type === "Hot Coffee"
                            ? "hot"
                            : ""
                      }`}
                    >
                      {product.type}
                    </span>
                  </td>

                  {/* REGULAR */}

                  <td>
                    <strong className="mp-price">
                      {peso(product.regular)}
                    </strong>
                  </td>

                  {/* LARGE */}

                  <td>
                    <strong className="mp-price">
                      {peso(product.large)}
                    </strong>
                  </td>

                  {/* AVAILABILITY */}

                  <td>
                    <button
                      type="button"
                      className={`mp-availability ${
                        product.available ? "available" : "unavailable"
                      }`}
                      onClick={() => toggleAvailability(product.id)}
                    >
                      <span className="mp-status-dot" />

                      {product.available ? "AVAILABLE" : "UNAVAILABLE"}
                    </button>
                  </td>

                  {/* ACTION */}

                  <td>
                    <button
                      type="button"
                      className="mp-edit-button"
                      onClick={() => openPriceEditor(product)}
                    >
                      Edit price
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY RESULT */}

          {filteredProducts.length === 0 && (
            <div className="mp-empty">
              <div className="mp-empty-icon">⌕</div>

              <h3>No products found</h3>

              <p>
                Try changing your search or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PRICE MODAL */}

      {editingProduct && (
        <div
          className="mp-modal-overlay"
          onMouseDown={() => setEditingProduct(null)}
        >
          <div
            className="mp-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mp-modal-header">
              <div>
                <div className="mp-eyebrow">PRICE MANAGEMENT</div>

                <h2>{editingProduct.name}</h2>

                <p>
                  {editingProduct.category} · {editingProduct.type}
                </p>
              </div>

              <button
                type="button"
                className="mp-close-button"
                onClick={() => setEditingProduct(null)}
              >
                ×
              </button>
            </div>

            <div className="mp-modal-body">
              <div className="mp-form-group">
                <label>Regular / Hot Price</label>

                <div className="mp-price-input">
                  <span>₱</span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editRegular}
                    onChange={(event) => setEditRegular(event.target.value)}
                  />
                </div>
              </div>

              <div className="mp-form-group">
                <label>Large Price</label>

                <div className="mp-price-input">
                  <span>₱</span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editLarge}
                    onChange={(event) => setEditLarge(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mp-modal-footer">
              <button
                type="button"
                className="mp-cancel-button"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="mp-save-button"
                onClick={savePrice}
              >
                Save price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
