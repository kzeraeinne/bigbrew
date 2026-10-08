import { useMemo, useState } from "react";

import "./WasteAdjustment.css";

import {
  getWasteRecords,
  confirmWaste,
  rejectWaste,
  submitWaste,
} from "./WasteStore";

import { deductInventory } from "../../Owner/InventoryStore";

import {
  Search,
  ChevronDown,
  Trash2,
  AlertTriangle,
  Package,
  Clock3,
  CheckCircle2,
  X,
  Check,
} from "lucide-react";

/* =========================================================
   INGREDIENT / SUPPLY MASTER
========================================================= */

const INITIAL_INGREDIENTS = [
  {
    id: "ING-001",
    name: "Milk Tea Base",
    category: "Milk Tea",
    stock: 5000,
    unit: "g",
    costPerUnit: 0.18,
  },
  {
    id: "ING-002",
    name: "Tea Component",
    category: "Milk Tea",
    stock: 2800,
    unit: "g",
    costPerUnit: 0.12,
  },
  {
    id: "ING-003",
    name: "Milk / Cream Component",
    category: "Milk Tea",
    stock: 2500,
    unit: "ml",
    costPerUnit: 0.09,
  },
  {
    id: "ING-004",
    name: "Sugar / Sweetener",
    category: "Milk Tea",
    stock: 3500,
    unit: "g",
    costPerUnit: 0.04,
  },
  {
    id: "ING-005",
    name: "Ice",
    category: "Supplies",
    stock: 10000,
    unit: "g",
    costPerUnit: 0.015,
  },
  {
    id: "ING-006",
    name: "Dark Choco Flavor",
    category: "Flavor",
    stock: 900,
    unit: "ml",
    costPerUnit: 0.35,
  },
  {
    id: "ING-007",
    name: "Cookies & Cream Flavor",
    category: "Flavor",
    stock: 900,
    unit: "ml",
    costPerUnit: 0.35,
  },
  {
    id: "ING-008",
    name: "Okinawa Flavor",
    category: "Flavor",
    stock: 900,
    unit: "ml",
    costPerUnit: 0.35,
  },
  {
    id: "ING-009",
    name: "Wintermelon Flavor",
    category: "Flavor",
    stock: 900,
    unit: "ml",
    costPerUnit: 0.35,
  },
  {
    id: "ING-010",
    name: "Cheesecake Flavor",
    category: "Flavor",
    stock: 900,
    unit: "ml",
    costPerUnit: 0.35,
  },
  {
    id: "ING-011",
    name: "Matcha Flavor",
    category: "Flavor",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.42,
  },
  {
    id: "ING-012",
    name: "Chocolate Flavor",
    category: "Flavor",
    stock: 900,
    unit: "ml",
    costPerUnit: 0.35,
  },
  {
    id: "ING-013",
    name: "Red Velvet Flavor",
    category: "Flavor",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.38,
  },
  {
    id: "ING-014",
    name: "Salted Caramel Flavor",
    category: "Flavor",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.4,
  },
  {
    id: "ING-015",
    name: "Choco Kisses Flavor",
    category: "Flavor",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.38,
  },
  {
    id: "ING-016",
    name: "Taro Flavor",
    category: "Flavor",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.36,
  },
  {
    id: "ING-017",
    name: "Strawberry Flavor",
    category: "Flavor",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.36,
  },
  {
    id: "ING-018",
    name: "Lychee Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.3,
  },
  {
    id: "ING-019",
    name: "Green Apple Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.3,
  },
  {
    id: "ING-020",
    name: "Blueberry Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.32,
  },
  {
    id: "ING-021",
    name: "Lemon Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.28,
  },
  {
    id: "ING-022",
    name: "Kiwi Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.31,
  },
  {
    id: "ING-023",
    name: "Mango Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.3,
  },
  {
    id: "ING-024",
    name: "Honey Peach Flavor",
    category: "Fruit Tea",
    stock: 800,
    unit: "ml",
    costPerUnit: 0.31,
  },
  {
    id: "ING-025",
    name: "Coffee Concentrate",
    category: "Coffee",
    stock: 1500,
    unit: "ml",
    costPerUnit: 0.5,
  },
  {
    id: "ING-026",
    name: "Coffee Powder",
    category: "Coffee",
    stock: 1500,
    unit: "g",
    costPerUnit: 0.55,
  },
  {
    id: "ING-027",
    name: "Caramel Sauce",
    category: "Coffee",
    stock: 700,
    unit: "ml",
    costPerUnit: 0.45,
  },
  {
    id: "ING-028",
    name: "Vanilla Syrup",
    category: "Coffee",
    stock: 700,
    unit: "ml",
    costPerUnit: 0.42,
  },
  {
    id: "ING-029",
    name: "Mocha Sauce",
    category: "Coffee",
    stock: 700,
    unit: "ml",
    costPerUnit: 0.46,
  },
  {
    id: "ING-030",
    name: "Cream Cheese",
    category: "Add-ons",
    stock: 1200,
    unit: "g",
    costPerUnit: 0.6,
  },
  {
    id: "ING-031",
    name: "Cream Puff",
    category: "Add-ons",
    stock: 600,
    unit: "g",
    costPerUnit: 0.5,
  },
  {
    id: "ING-032",
    name: "Whipped Cream",
    category: "Add-ons",
    stock: 1000,
    unit: "g",
    costPerUnit: 0.55,
  },
  {
    id: "ING-033",
    name: "Pearl",
    category: "Add-ons",
    stock: 2500,
    unit: "g",
    costPerUnit: 0.18,
  },
  {
    id: "ING-034",
    name: "Crystal",
    category: "Add-ons",
    stock: 2000,
    unit: "g",
    costPerUnit: 0.16,
  },
  {
    id: "ING-035",
    name: "Cheesecake Pieces",
    category: "Add-ons",
    stock: 1200,
    unit: "g",
    costPerUnit: 0.45,
  },
  {
    id: "ING-036",
    name: "Crushed Oreo",
    category: "Add-ons",
    stock: 1000,
    unit: "g",
    costPerUnit: 0.4,
  },
  {
    id: "ING-037",
    name: "Coffee Jelly",
    category: "Add-ons",
    stock: 1500,
    unit: "g",
    costPerUnit: 0.2,
  },
  {
    id: "ING-038",
    name: "Cups",
    category: "Supplies",
    stock: 700,
    unit: "pcs",
    costPerUnit: 2.5,
  },
  {
    id: "ING-039",
    name: "Lids",
    category: "Supplies",
    stock: 700,
    unit: "pcs",
    costPerUnit: 1.2,
  },
  {
    id: "ING-040",
    name: "Straws",
    category: "Supplies",
    stock: 700,
    unit: "pcs",
    costPerUnit: 0.7,
  },
];

const WASTE_REASONS = [
  "EXPIRED",
  "SPOILED",
  "DAMAGED",
  "SPILLED",
  "PREPARATION ERROR",
  "QUALITY ISSUE",
  "STOCK ADJUSTMENT",
  "OTHER",
];

/* =========================================================
   HELPERS
========================================================= */

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(value) {
  return `₱${Number(value || 0).toFixed(2)}`;
}

/* =========================================================
   OWNER WASTE / WASTE ADJUSTMENT
========================================================= */

function WasteAdjustment() {
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);

  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [quantity, setQuantity] = useState("");

  const [reason, setReason] = useState("EXPIRED");

  const [notes, setNotes] = useState("");

  const [wasteRecords, setWasteRecords] = useState(() =>
    getWasteRecords()
  );

  const [showSuccess, setShowSuccess] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [approvalMessage, setApprovalMessage] = useState("");

  /* =======================================================
     FILTERED INGREDIENTS
  ======================================================= */

  const filteredIngredients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return ingredients;
    }

    return ingredients.filter((ingredient) => {
      return (
        ingredient.name.toLowerCase().includes(term) ||
        ingredient.category.toLowerCase().includes(term) ||
        ingredient.unit.toLowerCase().includes(term)
      );
    });
  }, [ingredients, searchTerm]);

  /* =======================================================
     RECORD GROUPS
  ======================================================= */

  const confirmedRecords = useMemo(() => {
    return wasteRecords.filter(
      (record) => record.status === "CONFIRMED"
    );
  }, [wasteRecords]);

  const pendingRecords = useMemo(() => {
    return wasteRecords.filter(
      (record) => record.status === "PENDING"
    );
  }, [wasteRecords]);

  const rejectedRecords = useMemo(() => {
    return wasteRecords.filter(
      (record) => record.status === "REJECTED"
    );
  }, [wasteRecords]);

  /* =======================================================
     TOTALS
  ======================================================= */

  const totalWasteValue = useMemo(() => {
    return confirmedRecords.reduce((total, record) => {
      return total + Number(record.totalCost || 0);
    }, 0);
  }, [confirmedRecords]);

  const pendingWasteValue = useMemo(() => {
    return pendingRecords.reduce((total, record) => {
      return total + Number(record.totalCost || 0);
    }, 0);
  }, [pendingRecords]);

  const availableIngredients = useMemo(() => {
    return ingredients.filter(
      (ingredient) => Number(ingredient.stock) > 0
    ).length;
  }, [ingredients]);

  /* =======================================================
     SELECT INGREDIENT
  ======================================================= */

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setSearchTerm(ingredient.name);
    setIsPickerOpen(false);
    setErrorMessage("");
  };

  /* =======================================================
     QUANTITY INPUT
  ======================================================= */

  const handleQuantityChange = (event) => {
    const value = event.target.value;

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setQuantity(value);
    setErrorMessage("");
  };

  /* =======================================================
     CLEAR FORM
  ======================================================= */

  const handleClearForm = () => {
    setSelectedIngredient(null);
    setSearchTerm("");
    setQuantity("");
    setReason("EXPIRED");
    setNotes("");
    setErrorMessage("");
  };

  /* =======================================================
     OWNER MANUAL WASTE
     
     Manual owner entries are automatically CONFIRMED.
  ======================================================= */

  const handleConfirmWaste = () => {
    const qty = Number(quantity);

    if (!selectedIngredient) {
      setErrorMessage("Please select an ingredient or supply.");
      return;
    }

    if (!qty || qty <= 0) {
      setErrorMessage("Please enter a valid quantity.");
      return;
    }

    if (qty > Number(selectedIngredient.stock)) {
      setErrorMessage(
        `Cannot record ${qty} ${selectedIngredient.unit}. Available stock is ${selectedIngredient.stock} ${selectedIngredient.unit}.`
      );
      return;
    }

    const totalCost =
      qty * Number(selectedIngredient.costPerUnit || 0);

    const submitted = submitWaste({
      ingredientId: selectedIngredient.id,
      ingredientName: selectedIngredient.name,
      category: selectedIngredient.category,
      quantity: qty,
      unit: selectedIngredient.unit,
      reason,
      notes,
      totalCost,
      submittedBy: "Owner",
    });

    const updatedRecords = confirmWaste(submitted.id);

    setWasteRecords(updatedRecords);

    setIngredients((currentIngredients) => {
      return currentIngredients.map((ingredient) => {
        if (ingredient.id !== selectedIngredient.id) {
          return ingredient;
        }

        return {
          ...ingredient,
          stock: Math.max(
            0,
            Number(ingredient.stock) - qty
          ),
        };
      });
    });

    handleClearForm();

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  /* =======================================================
     APPROVE CASHIER WASTE
  ======================================================= */

  const handleApprove = (record) => {
    const ingredient = ingredients.find(
      (item) => item.id === record.ingredientId
    );

    if (!ingredient) {
      setApprovalMessage(
        `Cannot confirm ${record.id}: ingredient or supply was not found.`
      );
      return;
    }

    const qty = Number(record.quantity || 0);

    if (qty <= 0) {
      setApprovalMessage(
        `Cannot confirm ${record.id}: invalid quantity.`
      );
      return;
    }

    if (qty > Number(ingredient.stock)) {
      setApprovalMessage(
        `Cannot confirm ${record.id}: insufficient stock. Available stock is ${ingredient.stock} ${ingredient.unit}.`
      );
      return;
    }

    const inventoryResult = deductInventory({
  ingredientName: record.ingredientName,
  quantity: qty,
  unit: record.unit,
  reference: record.id,
  user: "Owner",
});

if (!inventoryResult.success) {
  setApprovalMessage(inventoryResult.message);
  return;
}

    const updatedRecords = confirmWaste(record.id);

    setWasteRecords(updatedRecords);

    setIngredients((currentIngredients) => {
      return currentIngredients.map((item) => {
        if (item.id !== record.ingredientId) {
          return item;
        }

        return {
          ...item,
          stock: Math.max(
            0,
            Number(item.stock) - qty
          ),
        };
      });
    });

    setApprovalMessage(
      `${record.id} confirmed. Inventory has been deducted.`
    );

    setTimeout(() => {
      setApprovalMessage("");
    }, 3000);
  };

  /* =======================================================
     REJECT CASHIER WASTE
  ======================================================= */

  const handleReject = (record) => {
    const updatedRecords = rejectWaste(record.id);

    setWasteRecords(updatedRecords);

    setApprovalMessage(
      `${record.id} rejected. Inventory was not changed.`
    );

    setTimeout(() => {
      setApprovalMessage("");
    }, 3000);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="waste-page">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="waste-page-header">
        <div>
          <h1>Waste & Adjustment</h1>

          <p>
            Record waste, review cashier submissions, and
            control inventory adjustments.
          </p>
        </div>
      </div>

      {/* ===================================================
          SUCCESS MESSAGE
      =================================================== */}

      {showSuccess && (
        <div className="waste-success">
          <CheckCircle2 size={18} />

          <span>
            Waste recorded successfully and inventory was
            updated.
          </span>
        </div>
      )}

      {/* ===================================================
          APPROVAL MESSAGE
      =================================================== */}

      {approvalMessage && (
        <div className="waste-success">
          <CheckCircle2 size={18} />

          <span>{approvalMessage}</span>
        </div>
      )}

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="waste-summary">

        <div className="waste-stat">
          <div className="waste-stat-icon">
            <Trash2 size={20} />
          </div>

          <div>
            <span>Total Confirmed Waste</span>

            <strong>
              {formatCurrency(totalWasteValue)}
            </strong>
          </div>
        </div>

        <div className="waste-stat">
          <div className="waste-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pending Approval</span>

            <strong>
              {pendingRecords.length}
            </strong>
          </div>
        </div>

        <div className="waste-stat">
          <div className="waste-stat-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Pending Waste Value</span>

            <strong>
              {formatCurrency(pendingWasteValue)}
            </strong>
          </div>
        </div>

        <div className="waste-stat">
          <div className="waste-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Available Items</span>

            <strong>
              {availableIngredients}
            </strong>
          </div>
        </div>

      </div>

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div className="waste-grid">

        {/* =================================================
            RECORD WASTE FORM
        ================================================= */}

        <div className="waste-card">

          <div className="waste-card-header">
            <div>
              <h2>Record Waste</h2>

              <p>
                Owner entries are immediately confirmed and
                deducted from inventory.
              </p>
            </div>
          </div>

          <div className="waste-form">

            {/* ---------------------------------------------
                INGREDIENT
            --------------------------------------------- */}

            <div className="waste-field">

              <label>
                Ingredient / Supply
              </label>

              <div
                className={`ingredient-search ${
                  isPickerOpen ? "is-open" : ""
                }`}
              >

                <Search
                  size={19}
                  className="ingredient-search-icon"
                />

                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search ingredient or supply..."
                  onFocus={() => setIsPickerOpen(true)}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setIsPickerOpen(true);
                    setSelectedIngredient(null);
                    setErrorMessage("");
                  }}
                />

                <button
                  type="button"
                  className="ingredient-chevron"
                  onClick={() =>
                    setIsPickerOpen((current) => !current)
                  }
                >
                  <ChevronDown
                    size={20}
                    className={
                      isPickerOpen
                        ? "chevron-rotated"
                        : ""
                    }
                  />
                </button>

                {isPickerOpen && (
                  <div className="ingredient-dropdown">

                    {filteredIngredients.length === 0 ? (
                      <div className="ingredient-empty">
                        No ingredients or supplies found.
                      </div>
                    ) : (
                      filteredIngredients.map(
                        (ingredient) => (
                          <button
                            type="button"
                            key={ingredient.id}
                            className="ingredient-option"
                            onClick={() =>
                              handleSelectIngredient(
                                ingredient
                              )
                            }
                          >
                            <div>
                              <strong>
                                {ingredient.name}
                              </strong>

                              <span>
                                {ingredient.category}
                              </span>
                            </div>

                            <div>
                              <strong>
                                {ingredient.stock}
                              </strong>

                              <span>
                                {ingredient.unit}
                              </span>
                            </div>
                          </button>
                        )
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* ---------------------------------------------
                SELECTED INGREDIENT
            --------------------------------------------- */}

            {selectedIngredient && (
              <div className="waste-selected-item">

                <div>
                  <strong>
                    {selectedIngredient.name}
                  </strong>

                  <span>
                    Available:{" "}
                    {selectedIngredient.stock}{" "}
                    {selectedIngredient.unit}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIngredient(null);
                    setSearchTerm("");
                  }}
                >
                  <X size={17} />
                </button>

              </div>
            )}

            {/* ---------------------------------------------
                QUANTITY + REASON
            --------------------------------------------- */}

            <div className="waste-form-row">

              <div className="waste-field">

                <label>
                  Quantity
                </label>

                <div className="waste-input-with-unit">

                  <input
                    type="text"
                    inputMode="decimal"
                    value={quantity}
                    placeholder="0"
                    onChange={handleQuantityChange}
                  />

                  <span>
                    {selectedIngredient?.unit || "unit"}
                  </span>

                </div>

              </div>

              <div className="waste-field">

                <label>
                  Reason
                </label>

                <select
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                >
                  {WASTE_REASONS.map(
                    (wasteReason) => (
                      <option
                        key={wasteReason}
                        value={wasteReason}
                      >
                        {wasteReason}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            {/* ---------------------------------------------
                ERROR
            --------------------------------------------- */}

            {errorMessage && (
              <div className="waste-error">
                <AlertTriangle size={18} />

                <span>{errorMessage}</span>
              </div>
            )}

            {/* ---------------------------------------------
                NOTES
            --------------------------------------------- */}

            <div className="waste-field">

              <label>
                Notes
              </label>

              <textarea
                value={notes}
                placeholder="Add additional details..."
                onChange={(event) =>
                  setNotes(event.target.value)
                }
              />

            </div>

            {/* ---------------------------------------------
                COST
            --------------------------------------------- */}

            <div className="waste-cost">

              <div>
                <span>
                  Estimated Waste Cost
                </span>

                <strong>
                  {formatCurrency(
                    Number(quantity || 0) *
                      Number(
                        selectedIngredient?.costPerUnit ||
                          0
                      )
                  )}
                </strong>
              </div>

              {selectedIngredient && (
                <small>
                  Based on{" "}
                  {formatCurrency(
                    selectedIngredient.costPerUnit
                  )}{" "}
                  per {selectedIngredient.unit}
                </small>
              )}

            </div>

            {/* ---------------------------------------------
                ACTIONS
            --------------------------------------------- */}

            <div className="waste-actions">

              <button
                type="button"
                className="waste-clear"
                onClick={handleClearForm}
              >
                Clear
              </button>

              <button
                type="button"
                className="waste-confirm"
                onClick={handleConfirmWaste}
              >
                <Check size={18} />

                Record Waste
              </button>

            </div>

          </div>
        </div>

        {/* =================================================
            PENDING APPROVALS
        ================================================= */}

        <div className="waste-card">

          <div className="waste-card-header">

            <div>
              <h2>Pending Approvals</h2>

              <p>
                Cashier-Barista waste submissions waiting
                for Owner review.
              </p>
            </div>

            <div className="waste-pending-count">
              {pendingRecords.length}
            </div>

          </div>

          {pendingRecords.length === 0 ? (

            <div className="waste-empty-state">

              <CheckCircle2 size={34} />

              <strong>
                No pending waste
              </strong>

              <span>
                All cashier submissions have been reviewed.
              </span>

            </div>

          ) : (

            <div className="waste-pending-list">

              {pendingRecords.map((record) => (

                <div
                  className="waste-pending-item"
                  key={record.id}
                >

                  <div className="waste-pending-main">

                    <div className="waste-pending-title">
                      <strong>
                        {record.ingredientName}
                      </strong>

                      <span>
                        {record.id}
                      </span>
                    </div>

                    <div className="waste-pending-details">

                      <span>
                        {record.quantity}{" "}
                        {record.unit}
                      </span>

                      <span>
                        {record.reason}
                      </span>

                      <span>
                        {formatCurrency(
                          record.totalCost
                        )}
                      </span>

                    </div>

                    <div className="waste-pending-meta">
                      Submitted by{" "}
                      {record.submittedBy ||
                        "Cashier-Barista"}{" "}
                      •{" "}
                      {formatDateTime(
                        record.submittedAt
                      )}
                    </div>

                    {record.notes && (
                      <div className="waste-pending-notes">
                        {record.notes}
                      </div>
                    )}

                  </div>

                  <div className="waste-pending-actions">

                    <button
                      type="button"
                      className="waste-reject"
                      onClick={() =>
                        handleReject(record)
                      }
                    >
                      <X size={16} />

                      Reject
                    </button>

                    <button
                      type="button"
                      className="waste-approve"
                      onClick={() =>
                        handleApprove(record)
                      }
                    >
                      <Check size={16} />

                      Confirm
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ===================================================
          WASTE HISTORY
      =================================================== */}

      <div className="waste-card waste-history-card">

        <div className="waste-card-header">

          <div>
            <h2>Waste History</h2>

            <p>
              Confirmed and rejected waste records are kept
              for monitoring and audit purposes.
            </p>
          </div>

          <div className="waste-history-summary">

            <span>
              Confirmed:{" "}
              <strong>
                {confirmedRecords.length}
              </strong>
            </span>

            <span>
              Rejected:{" "}
              <strong>
                {rejectedRecords.length}
              </strong>
            </span>

          </div>

        </div>

        {wasteRecords.length === 0 ? (

          <div className="waste-empty-state">

            <Package size={34} />

            <strong>
              No waste records yet
            </strong>

            <span>
              Waste submissions and owner adjustments will
              appear here.
            </span>

          </div>

        ) : (

          <div className="waste-record-list">

            {wasteRecords.map((record) => {

              const status =
                record.status || "CONFIRMED";

              return (
                <div
                  className="waste-record"
                  key={record.id}
                >

                  <div className="waste-record-icon">
                    <Trash2 size={19} />
                  </div>

                  <div className="waste-record-main">

                    <div className="waste-record-title">

                      <strong>
                        {record.ingredientName}
                      </strong>

                      <span className="waste-record-id">
                        {record.id}
                      </span>

                    </div>

                    <div className="waste-record-meta">

                      <span>
                        {record.quantity}{" "}
                        {record.unit}
                      </span>

                      <span>
                        {record.reason}
                      </span>

                      {record.category && (
                        <span>
                          {record.category}
                        </span>
                      )}

                    </div>

                    {record.notes && (
                      <div className="waste-record-notes">
                        {record.notes}
                      </div>
                    )}

                    <div className="waste-record-date">

                      Submitted:{" "}
                      {formatDateTime(
                        record.submittedAt ||
                          record.createdAt
                      )}

                      {record.approvedAt && (
                        <>
                          {" "}
                          • Confirmed:{" "}
                          {formatDateTime(
                            record.approvedAt
                          )}
                        </>
                      )}

                      {record.rejectedAt && (
                        <>
                          {" "}
                          • Rejected:{" "}
                          {formatDateTime(
                            record.rejectedAt
                          )}
                        </>
                      )}

                    </div>

                  </div>

                  <div className="waste-record-right">

                    <strong>
                      {formatCurrency(
                        record.totalCost
                      )}
                    </strong>

                    <span
                      className={`waste-status waste-status-${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

/* =========================================================
   EXPORTS
========================================================= */

export const Waste = WasteAdjustment;

export { WasteAdjustment };

export default WasteAdjustment;
