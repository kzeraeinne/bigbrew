import { useEffect, useMemo, useState } from "react";
import "./Addons.css";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com";

function AddOns() {
  const [addons, setAddons] = useState([]);
  const [search, setSearch] = useState("");

  const [editingAddon, setEditingAddon] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD ADD-ONS FROM DATABASE
  // =========================================================
  const loadAddons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/Api/Addons/List.php`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load add-ons."
        );
      }

      setAddons(result.data || []);
    } catch (err) {
      console.error("Load add-ons error:", err);
      setError(
        err.message || "Unable to connect to the add-ons API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddons();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredAddons = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return addons;
    }

    return addons.filter((addon) =>
      addon.name.toLowerCase().includes(keyword)
    );
  }, [addons, search]);

  // =========================================================
  // EDIT PRICE
  // =========================================================
  const openEditPrice = (addon) => {
    setEditingAddon(addon);
    setNewPrice(String(addon.price));
    setError("");
  };

  const closeEditPrice = () => {
    if (saving) return;

    setEditingAddon(null);
    setNewPrice("");
  };

  // =========================================================
  // SAVE PRICE TO DATABASE
  // =========================================================
  const savePrice = async () => {
    const price = Number(newPrice);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    if (!editingAddon) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/Api/Addons/Update.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addon_id: editingAddon.id,
            price: price,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update add-on price."
        );
      }

      // Update React state using the response from PHP
      setAddons((current) =>
        current.map((addon) =>
          addon.id === editingAddon.id
            ? {
                ...addon,
                price: Number(result.data.price),
                addon_price: Number(result.data.addon_price),
              }
            : addon
        )
      );

      closeEditPrice();

    } catch (err) {
      console.error("Save add-on price error:", err);

      setError(
        err.message || "Unable to update the add-on price."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================
  const getStatusClass = (status) => {
    if (status === "AVAILABLE") {
      return "addons-status addons-status-available";
    }

    if (status === "LOW STOCK") {
      return "addons-status addons-status-low";
    }

    return "addons-status addons-status-out";
  };

  // =========================================================
  // FORMAT INVENTORY
  // =========================================================
  const formatInventory = (inventory) => {
    if (inventory === null || inventory === undefined) {
      return "—";
    }

    return Number(inventory).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="addons-page">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="addons-header">
        <div>
          <div className="addons-eyebrow">MENU EXTRAS</div>

          <h1>Add-ons</h1>

          <p>
            Manage additional items available for customer
            orders and their selling prices.
          </p>
        </div>

        <div className="addons-summary">
          <strong>{addons.length}</strong>
          <span>ADD-ONS</span>
        </div>
      </div>

      {/* =====================================================
          INFO
      ===================================================== */}
      <div className="addons-info">
        <div className="addons-info-icon">+</div>

        <div>
          <strong>Add-on pricing</strong>

          <p>
            Standard add-ons are currently priced at ₱9.
            Extra Shot is separately priced at ₱5.
          </p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && !editingAddon && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fff1f1",
            color: "#b42318",
            border: "1px solid #fecdca",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <div className="addons-toolbar">

        <div className="addons-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search add-ons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="addons-count">
          Showing <strong>{filteredAddons.length}</strong> of{" "}
          <strong>{addons.length}</strong> add-ons
        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}
      <div className="addons-card">

        <div className="addons-table">

          <div className="addons-table-head">
            <div>ADD-ON</div>
            <div>SELLING PRICE</div>
            <div>INVENTORY</div>
            <div>STATUS</div>
            <div>ACTION</div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="addons-empty">
              <strong>Loading add-ons...</strong>

              <p>
                Getting the latest add-ons and inventory
                from the database.
              </p>
            </div>
          )}

          {/* DATA */}
          {!loading &&
            filteredAddons.map((addon) => (
              <div
                className="addons-table-row"
                key={addon.id}
              >

                {/* ADD-ON */}
                <div className="addons-name-cell">

                  <div className="addons-product-icon">
                    +
                  </div>

                  <div>
                    <strong>{addon.name}</strong>

                    {addon.name === "Extra Shot" && (
                      <span className="addons-note">
                        Coffee add-on
                      </span>
                    )}
                  </div>

                </div>

                {/* PRICE */}
                <div className="addons-price">
                  ₱{Number(addon.price).toFixed(2)}
                </div>

                {/* INVENTORY */}
                <div className="addons-inventory">

                  {formatInventory(addon.inventory)}

                  {addon.unit && (
                    <> {addon.unit}</>
                  )}

                </div>

                {/* STATUS */}
                <div>
                  <span
                    className={getStatusClass(
                      addon.status
                    )}
                  >
                    <span className="addons-status-dot" />

                    {addon.status}
                  </span>
                </div>

                {/* ACTION */}
                <div>
                  <button
                    className="addons-edit-button"
                    onClick={() =>
                      openEditPrice(addon)
                    }
                  >
                    Edit price
                  </button>
                </div>

              </div>
            ))}

          {/* EMPTY SEARCH */}
          {!loading &&
            filteredAddons.length === 0 && (
              <div className="addons-empty">

                <div className="addons-empty-icon">
                  ⌕
                </div>

                <strong>
                  No add-ons found
                </strong>

                <p>
                  Try searching using a different
                  add-on name.
                </p>

              </div>
            )}

        </div>

      </div>

      {/* =====================================================
          EDIT PRICE MODAL
      ===================================================== */}
      {editingAddon && (
        <div
          className="addons-modal-backdrop"
          onClick={closeEditPrice}
        >

          <div
            className="addons-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="addons-modal-header">

              <div>
                <span className="addons-eyebrow">
                  PRICE MANAGEMENT
                </span>

                <h2>Edit price</h2>
              </div>

              <button
                className="addons-close-button"
                onClick={closeEditPrice}
                aria-label="Close"
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* PRODUCT */}
            <div className="addons-modal-product">

              <div className="addons-product-icon">
                +
              </div>

              <div>

                <strong>
                  {editingAddon.name}
                </strong>

                <span>
                  Current price: ₱
                  {Number(
                    editingAddon.price
                  ).toFixed(2)}
                </span>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  marginBottom: "14px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  color: "#b42318",
                  border:
                    "1px solid #fecdca",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            {/* PRICE */}
            <label className="addons-field">

              <span>
                New selling price
              </span>

              <div className="addons-price-input">

                <span>₱</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) =>
                    setNewPrice(
                      e.target.value
                    )
                  }
                  autoFocus
                  disabled={saving}
                />

              </div>

            </label>

            {/* ACTIONS */}
            <div className="addons-modal-actions">

              <button
                className="addons-cancel-button"
                onClick={closeEditPrice}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="addons-save-button"
                onClick={savePrice}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save price"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AddOns;