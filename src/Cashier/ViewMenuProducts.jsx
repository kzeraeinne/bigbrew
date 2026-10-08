import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Coffee,
  Check,
  X,
} from "lucide-react";
import "./ViewMenuProducts.css";

/*
 * ============================================================
 * BIGBREW - CASHIER / BARISTA
 * VIEW MENU / PRODUCTS
 * ============================================================
 *
 * READ-ONLY PRODUCT CATALOG
 *
 * The Owner's MenuProducts module is responsible for:
 * - Adding products
 * - Editing products
 * - Changing prices
 * - Changing availability
 * - Managing product information
 *
 * Cashier-Barista can ONLY:
 * - View products
 * - Search products
 * - Filter by category
 * - Check current availability
 *
 * Product data is read from the same browser storage used by
 * the Owner module.
 *
 * When the backend is connected, replace loadProducts()
 * with the API/database request.
 * ============================================================
 */

const PRODUCT_STORAGE_KEY = "bigbrew_products";

/* ------------------------------------------------------------
   FALLBACK PRODUCTS
   Used only when there is no saved product data yet.
   ------------------------------------------------------------ */

const defaultProducts = [
  // MILK TEA
  {
    id: "MT-001",
    name: "Dark Choco",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-002",
    name: "Cookies & Cream",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-003",
    name: "Okinawa",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-004",
    name: "Wintermelon",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-005",
    name: "Cheesecake",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-006",
    name: "Matcha",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-007",
    name: "Chocolate",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-008",
    name: "Red Velvet",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-009",
    name: "Salted Caramel",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-010",
    name: "Choco Kisses",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-011",
    name: "Taro",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "MT-012",
    name: "Strawberry",
    category: "Milk Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },

  // ICED COFFEE
  {
    id: "IC-001",
    name: "Brusko",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-002",
    name: "Mocha",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-003",
    name: "Macchiato",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-004",
    name: "Vanilla",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-005",
    name: "Caramel",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-006",
    name: "Matcha",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-007",
    name: "Fudge",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "IC-008",
    name: "Spanish Latte",
    category: "Iced Coffee",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },

  // HOT COFFEE
  {
    id: "HC-001",
    name: "Brusko",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-002",
    name: "Mocha",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-003",
    name: "Macchiato",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-004",
    name: "Vanilla",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-005",
    name: "Caramel",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-006",
    name: "Matcha",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-007",
    name: "Fudge",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },
  {
    id: "HC-008",
    name: "Spanish Latte",
    category: "Hot Coffee",
    regularPrice: 39,
    largePrice: null,
    available: true,
  },

  // FRUIT TEA
  {
    id: "FT-001",
    name: "Lychee",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-002",
    name: "Green Apple",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-003",
    name: "Blueberry",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-004",
    name: "Lemon",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-005",
    name: "Strawberry",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-006",
    name: "Kiwi",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-007",
    name: "Mango",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },
  {
    id: "FT-008",
    name: "Honey Peach",
    category: "Fruit Tea",
    regularPrice: 29,
    largePrice: 39,
    available: true,
  },

  // BROSTY
  {
    id: "BR-001",
    name: "Lychee",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-002",
    name: "Green Apple",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-003",
    name: "Blueberry",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-004",
    name: "Lemon",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-005",
    name: "Strawberry",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-006",
    name: "Kiwi",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-007",
    name: "Mango",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "BR-008",
    name: "Honey Peach",
    category: "Brosty",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },

  // PRAF
  {
    id: "PR-001",
    name: "Coffee Jelly",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-002",
    name: "Caramel Macchiato",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-003",
    name: "Mocha",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-004",
    name: "Vanilla Coffee",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-005",
    name: "Java Chip",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-006",
    name: "Cheesecake",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-007",
    name: "Cookies & Cream",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-008",
    name: "Creamy Avocado",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-009",
    name: "Chocolate",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-010",
    name: "Matcha",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-011",
    name: "Strawberry",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
  {
    id: "PR-012",
    name: "Taro",
    category: "Praf",
    regularPrice: 49,
    largePrice: 59,
    available: true,
  },
];

/* ------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------ */

function normalizeAvailability(product) {
  if (typeof product.available === "boolean") {
    return product.available;
  }

  if (typeof product.isAvailable === "boolean") {
    return product.isAvailable;
  }

  if (typeof product.availability === "boolean") {
    return product.availability;
  }

  if (typeof product.availability === "string") {
    return product.availability.toLowerCase() === "available";
  }

  if (typeof product.status === "string") {
    return product.status.toLowerCase() === "available";
  }

  return true;
}

function normalizeProduct(product, index) {
  return {
    id: product.id ?? product.productId ?? `PRODUCT-${index + 1}`,
    name: product.name ?? product.productName ?? "Unnamed Product",
    category: product.category ?? product.categoryName ?? "Other",
    regularPrice:
      product.regularPrice ??
      product.price ??
      product.smallPrice ??
      product.regular ??
      0,
    largePrice:
      product.largePrice ??
      product.large ??
      product.large_price ??
      null,
    available: normalizeAvailability(product),
  };
}

function loadProducts() {
  try {
    const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (!stored) {
      return defaultProducts;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return defaultProducts;
    }

    return parsed.map(normalizeProduct);
  } catch (error) {
    console.error("Unable to load BigBrew products:", error);
    return defaultProducts;
  }
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "—";
  }

  return `₱${number.toFixed(2)}`;
}

/* ------------------------------------------------------------
   COMPONENT
   ------------------------------------------------------------ */

const ViewMenuProducts = () => {
  const [products, setProducts] = useState(loadProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All products");

  /* ----------------------------------------------------------
     Load changes made by Owner
     ---------------------------------------------------------- */

  useEffect(() => {
    const refreshProducts = () => {
      setProducts(loadProducts());
    };

    window.addEventListener("storage", refreshProducts);

    /*
     * Same-tab communication.
     * Owner's MenuProducts can dispatch:
     *
     * window.dispatchEvent(
     *   new Event("bigbrew:products-updated")
     * );
     */
    window.addEventListener(
      "bigbrew:products-updated",
      refreshProducts
    );

    return () => {
      window.removeEventListener("storage", refreshProducts);
      window.removeEventListener(
        "bigbrew:products-updated",
        refreshProducts
      );
    };
  }, []);

  /* ----------------------------------------------------------
     Categories
     * ---------------------------------------------------------- */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["All products", ...uniqueCategories];
  }, [products]);

  /* ----------------------------------------------------------
     Filter
     * ---------------------------------------------------------- */

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All products" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, category]);

  const availableCount = products.filter(
    (product) => product.available
  ).length;

  const unavailableCount = products.length - availableCount;

  return (
    <div className="view-menu-page">
      {/* ------------------------------------------------------
          PAGE HEADER
      ------------------------------------------------------ */}

      <div className="view-menu-header">
        <div>
          <div className="view-menu-eyebrow">
            PRODUCT CATALOG
          </div>

          <h1>View menu / products</h1>

          <p>
            View the current BigBrew menu, prices, and product
            availability.
          </p>
        </div>

        <div className="view-menu-count">
          <strong>{products.length}</strong>
          <span>PRODUCTS</span>
        </div>
      </div>

      {/* ------------------------------------------------------
          MAIN CARD
      ------------------------------------------------------ */}

      <section className="products-card">
        {/* TOOLBAR */}

        <div className="products-toolbar">
          <div className="product-search">
            <Search size={20} strokeWidth={2} />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search products..."
              aria-label="Search products"
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="category-filter">
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              aria-label="Filter products by category"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              className="category-chevron"
              size={18}
            />
          </div>
        </div>

        {/* STATUS SUMMARY */}

        <div className="availability-summary">
          <div className="summary-left">
            <span className="summary-dot available-dot" />
            <span>
              {availableCount} available
            </span>

            <span className="summary-divider" />

            <span className="summary-dot unavailable-dot" />
            <span>
              {unavailableCount} unavailable
            </span>
          </div>

          <div className="summary-result">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </div>
        </div>

        {/* ----------------------------------------------------
            TABLE
        ---------------------------------------------------- */}

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th className="product-column">
                  PRODUCT
                </th>

                <th>CATEGORY</th>

                <th>REGULAR / HOT</th>

                <th>LARGE</th>

                <th className="availability-column">
                  AVAILABILITY
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-products"
                  >
                    <div className="empty-products-icon">
                      <Search size={25} />
                    </div>

                    <strong>
                      No products found
                    </strong>

                    <span>
                      Try changing your search or
                      category filter.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    {/* PRODUCT */}

                    <td className="product-cell">
                      <div className="product-icon">
                        <Coffee
                          size={22}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="product-name">
                        {product.name}
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="category-cell">
                      {product.category}
                    </td>

                    {/* REGULAR */}

                    <td className="price-cell">
                      {formatPrice(
                        product.regularPrice
                      )}
                    </td>

                    {/* LARGE */}

                    <td className="price-cell large-price">
                      {formatPrice(
                        product.largePrice
                      )}
                    </td>

                    {/* AVAILABILITY */}

                    <td className="availability-cell">
                      {product.available ? (
                        <span className="availability-badge available">
                          <Check size={14} strokeWidth={3} />
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="availability-badge unavailable">
                          <X size={14} strokeWidth={3} />
                          UNAVAILABLE
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ViewMenuProducts;
