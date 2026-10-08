import React, { useEffect, useMemo, useState } from "react";
import "./MenuProducts.css";
import AddProduct from "./Addproduct";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com";

export default function MenuProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [editForm, setEditForm] = useState({
    product_id: "",
    product_name: "",
    category_id: "",
    description: "",
    regular_price: "",
    large_price: "",
    is_active: 1,
  });

  /* =========================================================
     LOAD PRODUCTS
     ========================================================= */

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/Api/Products/List.php`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load products."
        );
      }

      setProducts(result.data?.products || []);
    } catch (err) {
      console.error("Load products error:", err);

      setError(
        err.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     LOAD CATEGORIES
     ========================================================= */

  async function loadCategories() {
    try {
      setCategoryLoading(true);
      setCategoryError("");

      const response = await fetch(
        `${API_BASE}/Api/Categories/List.php`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load categories."
        );
      }

      const activeCategories =
        (result.data?.categories || []).filter(
          (category) =>
            Number(category.is_active) === 1
        );

      setCategories(activeCategories);
    } catch (err) {
      console.error(
        "Load categories error:",
        err
      );

      setCategoryError(
        err.message ||
          "Unable to load categories."
      );

      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  }

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  /* =========================================================
     FILTER PRODUCTS
     ========================================================= */

  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        searchValue === "" ||
        String(product.product_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(product.product_code || "")
          .toLowerCase()
          .includes(searchValue);

      const isAvailable =
        product.available === true;

      const matchesCategory =
        selectedCategory === "all" ||
        String(product.category_id) ===
          String(selectedCategory);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" &&
          isAvailable) ||
        (availabilityFilter === "unavailable" &&
          !isAvailable);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    products,
    search,
    selectedCategory,
    availabilityFilter,
  ]);

  /* =========================================================
     ADD PRODUCT
     ========================================================= */

  function handleProductCreated() {
    loadProducts();
    loadCategories();
  }

  /* =========================================================
     OPEN EDIT
     ========================================================= */

  function openEditProduct(product) {
    setEditError("");

    setEditForm({
      product_id: product.product_id,
      product_name: product.product_name || "",
      category_id:
        product.category_id !== null &&
        product.category_id !== undefined
          ? String(product.category_id)
          : "",
      description: product.description || "",
      regular_price:
        product.regular_price !== null &&
        product.regular_price !== undefined
          ? String(product.regular_price)
          : "",
      large_price:
        product.large_price !== null &&
        product.large_price !== undefined
          ? String(product.large_price)
          : "",
      is_active:
        Number(product.is_active) === 1
          ? 1
          : 0,
    });

    setEditingProduct(product);
  }

  /* =========================================================
     CLOSE EDIT
     ========================================================= */

  function closeEditProduct() {
    if (saving) {
      return;
    }

    setEditingProduct(null);
    setEditError("");
  }

  /* =========================================================
     EDIT FORM CHANGE
     ========================================================= */

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /* =========================================================
     SAVE PRODUCT
     ========================================================= */

  async function handleSaveProduct(event) {
    event.preventDefault();

    setEditError("");

    const productName =
      editForm.product_name.trim();

    const categoryId =
      Number(editForm.category_id);

    const regularPrice =
      Number(editForm.regular_price);

    const largePrice =
      Number(editForm.large_price);

    if (!productName) {
      setEditError(
        "Product name is required."
      );
      return;
    }

    if (!categoryId || categoryId <= 0) {
      setEditError(
        "Please select a category."
      );
      return;
    }

    if (
      editForm.regular_price === "" ||
      !Number.isFinite(regularPrice) ||
      regularPrice < 0
    ) {
      setEditError(
        "Please enter a valid Regular price."
      );
      return;
    }

    if (
      editForm.large_price === "" ||
      !Number.isFinite(largePrice) ||
      largePrice < 0
    ) {
      setEditError(
        "Please enter a valid Large price."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE}/Api/Products/Update.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id:
              Number(editForm.product_id),

            product_name: productName,

            category_id: categoryId,

            description:
              editForm.description.trim(),

            regular_price: regularPrice,

            large_price: largePrice,

            /*
             * is_active is the catalog/archive
             * status only.
             *
             * It is NOT product availability.
             */
            is_active:
              Number(editForm.is_active) === 1
                ? 1
                : 0,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update product."
        );
      }

      setEditingProduct(null);
      setEditError("");

      await loadProducts();
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setEditError(
        err.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="menu-products-page">

      {/* HEADER */}

      <div className="mp-page-header">

        <div>
          <div className="mp-eyebrow">
            PRODUCT CATALOG
          </div>

          <h1>
            Menu & Products
          </h1>

          <p>
            Manage your products, pricing,
            categories, and recipes.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div className="mp-product-count">
            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              PRODUCTS
            </span>
          </div>

          <button
            type="button"
            className="mp-add-product-button"
            onClick={() =>
              setShowAddProduct(true)
            }
          >
            <span className="mp-add-product-plus">
              +
            </span>

            Add Product
          </button>
        </div>

      </div>

      {/* MAIN CARD */}

      <div className="mp-card">

        {/* TOOLBAR */}

        <div className="mp-toolbar">

          <div className="mp-search-wrapper">

            <span className="mp-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            className="mp-select"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
            disabled={categoryLoading}
          >
            <option value="all">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category.category_id
                  }
                  value={
                    category.category_id
                  }
                >
                  {
                    category.category_name
                  }
                </option>
              )
            )}
          </select>

          <select
            className="mp-select"
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Availability
            </option>

            <option value="available">
              Available
            </option>

            <option value="unavailable">
              Unavailable
            </option>
          </select>

        </div>

        {/* CATEGORY ERROR */}

        {categoryError && (
          <div
            style={{
              margin: "0 20px 14px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#fff3ef",
              color: "#a24f47",
              fontSize: "13px",
            }}
          >
            {categoryError}
          </div>
        )}

        {/* RESULT SUMMARY */}

        {!loading && (
          <div className="mp-result-summary">
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong>
              {products.length}
            </strong>{" "}
            products
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={{
              margin: "0 20px 16px",
              padding: "11px 13px",
              borderRadius: "8px",
              background: "#fff3ef",
              color: "#a24f47",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="mp-empty">

            <div className="mp-empty-icon">
              ⏳
            </div>

            <h3>
              Loading products...
            </h3>

            <p>
              Please wait while the
              product catalog is loaded.
            </p>

          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="mp-empty">

            <div className="mp-empty-icon">
              ☕
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try changing your search
              or filter.
            </p>

          </div>
        ) : (

          /* TABLE */

          <div className="mp-table-wrapper">

            <table className="mp-table">

              <thead>
                <tr>
                  <th>
                    PRODUCT
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    SIZE
                  </th>

                  <th>
                    REGULAR
                  </th>

                  <th>
                    LARGE
                  </th>

                  <th>
                    AVAILABILITY
                  </th>

                  <th>
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {

    const regularSize =
      (product.sizes || []).find(
        (size) =>
          String(size.sizeName || "")
            .toLowerCase() === "regular"
      );

    const largeSize =
      (product.sizes || []).find(
        (size) =>
          String(size.sizeName || "")
            .toLowerCase() === "large"
      );

    const regularAvailable =
      regularSize?.available === true;

    const largeAvailable =
      largeSize?.available === true;

                    return (
                      <tr
                        key={
                          product.product_id
                        }
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="mp-product-cell">

                            <div className="mp-product-icon">
                              <span>
                                ☕
                              </span>
                            </div>

                            <div>
                              <strong>
                                {
                                  product.product_name
                                }
                              </strong>
                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="mp-category-text">
                            {
                              product.category_name ||
                              "Uncategorized"
                            }
                          </span>

                        </td>

                        {/* SIZE */}

                        <td>

                          <span className="mp-type-badge">
                            Regular, Large
                          </span>

                        </td>

                        {/* REGULAR */}

                        <td>

                          <div
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap: "4px",
                            }}
                          >

                            <span className="mp-price">
                              ₱
                              {Number(
                                product.regular_price ||
                                  0
                              ).toFixed(2)}
                            </span>

                            <span
                              style={{
                                fontSize:
                                  "10px",
                                fontWeight:
                                  800,
                                color:
                                  regularAvailable
                                    ? "#378052"
                                    : "#a24f47",
                              }}
                            >
                              {regularAvailable
                                ? "Available"
                                : "Unavailable"}
                            </span>

                          </div>

                        </td>

                        {/* LARGE */}

                        <td>

                          <div
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap: "4px",
                            }}
                          >

                            <span className="mp-price">
                              ₱
                              {Number(
                                product.large_price ||
                                  0
                              ).toFixed(2)}
                            </span>

                            <span
                              style={{
                                fontSize:
                                  "10px",
                                fontWeight:
                                  800,
                                color:
                                  largeAvailable
                                    ? "#378052"
                                    : "#a24f47",
                              }}
                            >
                              {largeAvailable
                                ? "Available"
                                : "Unavailable"}
                            </span>

                          </div>

                        </td>

                        {/* OVERALL AVAILABILITY */}

                        <td>

                          <span
                            className={`mp-availability ${
                              product.available
                                ? "available"
                                : "unavailable"
                            }`}
                            style={{
                              cursor:
                                "default",
                            }}
                          >

                            <span className="mp-status-dot" />

                            {product.available
                              ? "Available"
                              : "Unavailable"}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="mp-edit-button"
                            onClick={() =>
                              openEditProduct(
                                product
                              )
                            }
                          >
                            Edit
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ADD PRODUCT */}

      {showAddProduct && (
        <AddProduct
          categories={categories}
          onClose={() =>
            setShowAddProduct(false)
          }
          onProductCreated={
            handleProductCreated
          }
        />
      )}

      {/* EDIT PRODUCT MODAL */}

      {editingProduct && (
        <div
          className="mp-modal-overlay"
          onMouseDown={closeEditProduct}
        >

          <div
            className="mp-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mp-modal-header">

              <div>

                <h2>
                  Edit Product
                </h2>

                <p>
                  Update product details
                  and pricing.
                </p>

              </div>

              <button
                type="button"
                className="mp-close-button"
                onClick={
                  closeEditProduct
                }
                disabled={saving}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSaveProduct
              }
            >

              <div className="mp-modal-body">

                {/* PRODUCT NAME */}

                <div className="mp-form-group">

                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    value={
                      editForm.product_name
                    }
                    onChange={
                      handleEditChange
                    }
                    disabled={saving}
                  />

                </div>

                {/* CATEGORY */}

                <div className="mp-form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category_id"
                    value={
                      editForm.category_id
                    }
                    onChange={
                      handleEditChange
                    }
                    disabled={
                      saving ||
                      categoryLoading
                    }
                  >

                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.category_id
                          }
                          value={
                            category.category_id
                          }
                        >
                          {
                            category.category_name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="mp-form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      editForm.description
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter product description"
                    disabled={saving}
                  />

                </div>

                {/* PRICES */}

                <div className="mp-edit-price-grid">

                  <div className="mp-form-group">

                    <label>
                      Regular Price
                    </label>

                    <div className="mp-price-input">

                      <span>
                        ₱
                      </span>

                      <input
                        type="number"
                        name="regular_price"
                        min="0"
                        step="0.01"
                        value={
                          editForm.regular_price
                        }
                        onChange={
                          handleEditChange
                        }
                        disabled={saving}
                      />

                    </div>

                  </div>

                  <div className="mp-form-group">

                    <label>
                      Large Price
                    </label>

                    <div className="mp-price-input">

                      <span>
                        ₱
                      </span>

                      <input
                        type="number"
                        name="large_price"
                        min="0"
                        step="0.01"
                        value={
                          editForm.large_price
                        }
                        onChange={
                          handleEditChange
                        }
                        disabled={saving}
                      />

                    </div>

                  </div>

                </div>

                {/* CATALOG STATUS */}

                <div className="mp-edit-status">

                  <div>

                    <strong>
                      Product Catalog Status
                    </strong>

                    <p>
                      Archive this product
                      if it should no longer
                      appear in the active
                      catalog.
                    </p>

                  </div>

                  <span
                    className={`mp-status-toggle ${
                      Number(
                        editForm.is_active
                      ) === 1
                        ? "active"
                        : ""
                    }`}
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      cursor:
                        "default",
                    }}
                  >

                    <span className="mp-status-toggle-dot" />

                    {Number(
                      editForm.is_active
                    ) === 1
                      ? "Active"
                      : "Archived"}

                  </span>

                </div>

                {/* ERROR */}

                {editError && (
                  <div
                    style={{
                      padding:
                        "10px 12px",
                      borderRadius:
                        "8px",
                      background:
                        "#fff3ef",
                      color:
                        "#a24f47",
                      fontSize:
                        "13px",
                    }}
                  >
                    {editError}
                  </div>
                )}

              </div>

              {/* FOOTER */}

              <div className="mp-modal-footer">

                <button
                  type="button"
                  className="mp-cancel-button"
                  onClick={
                    closeEditProduct
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mp-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}