import React, { useState } from "react";
import "./AddProduct.css";

const API_BASE = "http://localhost/bigbrew_api";

export default function AddProduct({
  categories = [],
  onClose,
  onProductCreated,
}) {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const name = productName.trim();
    const regular = Number(regularPrice);
    const large = Number(largePrice);

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (
      regularPrice === "" ||
      !Number.isFinite(regular) ||
      regular < 0
    ) {
      setError("Please enter a valid Regular price.");
      return;
    }

    if (
      largePrice === "" ||
      !Number.isFinite(large) ||
      large < 0
    ) {
      setError("Please enter a valid Large price.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE}/Api/Products/Create.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_name: name,
            category_id: Number(categoryId),
            description: description.trim(),
            regular_price: regular,
            large_price: large,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create product."
        );
      }

      /*
       * Tell MenuProducts that the product was created.
       */
      if (onProductCreated) {
        onProductCreated(result.data);
      }

      /*
       * Close modal.
       */
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Create product error:", err);

      setError(
        err.message ||
          "Unable to create product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="add-product-overlay"
      onMouseDown={onClose}
    >
      <div
        className="add-product-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className="add-product-header">

          <div>
            <div className="add-product-eyebrow">
              PRODUCT CATALOG
            </div>

            <h2>Add New Product</h2>

            <p>
              Add a product and its Regular and Large prices.
            </p>
          </div>

          <button
            type="button"
            className="add-product-close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>

        </div>

        {/* BODY */}
        <form
          className="add-product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}
          <div className="add-product-form-group">

            <label htmlFor="add-product-name">
              Product Name
              <span>*</span>
            </label>

            <input
              id="add-product-name"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(event) =>
                setProductName(event.target.value)
              }
              disabled={saving}
            />

          </div>

          {/* CATEGORY */}
          <div className="add-product-form-group">

            <label htmlFor="add-product-category">
              Category
              <span>*</span>
            </label>

            <select
              id="add-product-category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              disabled={saving}
            >

              <option value="">
                Select category
              </option>

              {categories.map((category) => {

                /*
                 * Supports either:
                 *
                 * { category_id, category_name }
                 *
                 * or
                 *
                 * { id, name }
                 */

                const id =
                  category.category_id ??
                  category.id;

                const name =
                  category.category_name ??
                  category.name;

                return (
                  <option
                    key={id}
                    value={id}
                  >
                    {name}
                  </option>
                );
              })}

            </select>

          </div>

          {/* DESCRIPTION */}
          <div className="add-product-form-group">

            <label htmlFor="add-product-description">
              Description
              <span className="optional">
                Optional
              </span>
            </label>

            <textarea
              id="add-product-description"
              placeholder="Enter product description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={3}
              disabled={saving}
            />

          </div>

          {/* PRICES */}
          <div className="add-product-price-section">

            <div className="add-product-section-title">
              PRODUCT PRICING
            </div>

            <div className="add-product-price-grid">

              {/* REGULAR */}
              <div className="add-product-form-group">

                <label htmlFor="add-product-regular">
                  Regular Price
                  <span>*</span>
                </label>

                <div className="add-product-price-input">

                  <span>₱</span>

                  <input
                    id="add-product-regular"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={regularPrice}
                    onChange={(event) =>
                      setRegularPrice(
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>

              </div>

              {/* LARGE */}
              <div className="add-product-form-group">

                <label htmlFor="add-product-large">
                  Large Price
                  <span>*</span>
                </label>

                <div className="add-product-price-input">

                  <span>₱</span>

                  <input
                    id="add-product-large"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={largePrice}
                    onChange={(event) =>
                      setLargePrice(
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* INFO */}
          <div className="add-product-info">

            <div className="add-product-info-icon">
              ✓
            </div>

            <div>
              <strong>Two sizes will be created</strong>

              <p>
                Every new product automatically gets
                Regular and Large sizes.
              </p>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="add-product-error">
              {error}
            </div>
          )}

          {/* FOOTER */}
          <div className="add-product-footer">

            <button
              type="button"
              className="add-product-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-product-submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
