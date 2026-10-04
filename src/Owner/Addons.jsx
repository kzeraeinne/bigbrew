import { useMemo, useState } from "react";
import "./Addons.css";

const INITIAL_ADDONS = [
  {
    id: 1,
    name: "Pearl",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 2,
    name: "Crystal",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 3,
    name: "Cream Cheese",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 4,
    name: "Cream Puff",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 5,
    name: "Cheesecake",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 6,
    name: "Crushed Oreo",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 7,
    name: "Coffee Jelly",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 8,
    name: "Whipped Cream",
    price: 9,
    inventory: 750,
    unit: "g",
    status: "AVAILABLE",
  },
  {
    id: 9,
    name: "Extra Shot",
    price: 5,
    inventory: 5000,
    unit: "g",
    status: "AVAILABLE",
  },
];

function AddOns() {
  const [addons, setAddons] = useState(INITIAL_ADDONS);
  const [search, setSearch] = useState("");
  const [editingAddon, setEditingAddon] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const filteredAddons = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return addons;
    }

    return addons.filter((addon) =>
      addon.name.toLowerCase().includes(keyword)
    );
  }, [addons, search]);

  const openEditPrice = (addon) => {
    setEditingAddon(addon);
    setNewPrice(String(addon.price));
  };

  const closeEditPrice = () => {
    setEditingAddon(null);
    setNewPrice("");
  };

  const savePrice = () => {
    const price = Number(newPrice);

    if (!Number.isFinite(price) || price <= 0) {
      return;
    }

    setAddons((current) =>
      current.map((addon) =>
        addon.id === editingAddon.id
          ? {
              ...addon,
              price,
            }
          : addon
      )
    );

    closeEditPrice();
  };

  const getStatusClass = (status) => {
    if (status === "AVAILABLE") {
      return "addons-status addons-status-available";
    }

    if (status === "LOW STOCK") {
      return "addons-status addons-status-low";
    }

    return "addons-status addons-status-out";
  };

  return (
    <div className="addons-page">
      {/* PAGE HEADER */}
      <div className="addons-header">
        <div>
          <div className="addons-eyebrow">MENU EXTRAS</div>

          <h1>Add-ons</h1>

          <p>
            Manage additional items available for customer orders and their
            selling prices.
          </p>
        </div>

        <div className="addons-summary">
          <strong>{addons.length}</strong>
          <span>ADD-ONS</span>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="addons-info">
        <div className="addons-info-icon">+</div>

        <div>
          <strong>Add-on pricing</strong>

          <p>
            Standard add-ons are currently priced at ₱9. Extra Shot is
            separately priced at ₱5.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
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

      {/* TABLE */}
      <div className="addons-card">
        <div className="addons-table">
          <div className="addons-table-head">
            <div>ADD-ON</div>
            <div>SELLING PRICE</div>
            <div>INVENTORY</div>
            <div>STATUS</div>
            <div>ACTION</div>
          </div>

          {filteredAddons.map((addon) => (
            <div className="addons-table-row" key={addon.id}>
              {/* NAME */}
              <div className="addons-name-cell">
                <div className="addons-product-icon">+</div>

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
                ₱{addon.price.toFixed(2)}
              </div>

              {/* INVENTORY */}
              <div className="addons-inventory">
                {addon.inventory.toLocaleString()} {addon.unit}
              </div>

              {/* STATUS */}
              <div>
                <span className={getStatusClass(addon.status)}>
                  <span className="addons-status-dot" />
                  {addon.status}
                </span>
              </div>

              {/* ACTION */}
              <div>
                <button
                  className="addons-edit-button"
                  onClick={() => openEditPrice(addon)}
                >
                  Edit price
                </button>
              </div>
            </div>
          ))}

          {filteredAddons.length === 0 && (
            <div className="addons-empty">
              <div className="addons-empty-icon">⌕</div>

              <strong>No add-ons found</strong>

              <p>
                Try searching using a different add-on name.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PRICE EDIT MODAL */}
      {editingAddon && (
        <div className="addons-modal-backdrop" onClick={closeEditPrice}>
          <div
            className="addons-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="addons-modal-header">
              <div>
                <span className="addons-eyebrow">PRICE MANAGEMENT</span>

                <h2>Edit price</h2>
              </div>

              <button
                className="addons-close-button"
                onClick={closeEditPrice}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="addons-modal-product">
              <div className="addons-product-icon">+</div>

              <div>
                <strong>{editingAddon.name}</strong>

                <span>
                  Current price: ₱{editingAddon.price.toFixed(2)}
                </span>
              </div>
            </div>

            <label className="addons-field">
              <span>New selling price</span>

              <div className="addons-price-input">
                <span>₱</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  autoFocus
                />
              </div>
            </label>

            <div className="addons-modal-actions">
              <button
                className="addons-cancel-button"
                onClick={closeEditPrice}
              >
                Cancel
              </button>

              <button
                className="addons-save-button"
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

export default AddOns;
