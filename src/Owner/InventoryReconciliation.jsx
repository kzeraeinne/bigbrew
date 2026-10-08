import { useEffect, useState } from "react";
import "./InventoryReconciliation.css";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com";

// Only these inventory records will appear
const ALLOWED_INVENTORY_IDS = [42, 43, 44, 45];

function InventoryReconciliation() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const [physicalQty, setPhysicalQty] = useState("");
  const [counts, setCounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD INVENTORY FROM MYSQL
  // =========================================================
  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/Api/Inventory/List.php`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to retrieve inventory."
          );
        }

        const inventoryData = Array.isArray(result.data?.inventory)
          ? result.data.inventory
          : [];

        // Only inventory records connected to ingredient IDs 42–45
        const filteredInventory = inventoryData.filter((item) =>
          ALLOWED_INVENTORY_IDS.includes(
            Number(item.ingredient_id)
          )
        );

        const mappedIngredients = filteredInventory.map((item) => ({
          id: Number(item.ingredient_id),

          name:
            item.ingredient_name ||
            "Unknown inventory",

          unit:
            item.unit_of_measure || "",

          // Actual quantity from inventory.quantity_on_hand
          systemQty:
            Number(item.quantity_on_hand) || 0,

          inventoryId:
            Number(item.inventory_id),

          inventoryCode:
            item.inventory_code ||
            `INV${String(item.inventory_id).padStart(3, "0")}`,
        }));

        setIngredients(mappedIngredients);

        if (mappedIngredients.length > 0) {
          setSelectedIngredient(
            mappedIngredients[0]
          );
        } else {
          setSelectedIngredient(null);
        }
      } catch (err) {
        console.error(
          "Failed to load inventory:",
          err
        );

        setError(
          err.message ||
            "Unable to connect to the inventory API."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  // =========================================================
  // CALCULATE VARIANCE
  // =========================================================
  const variance =
    physicalQty === "" || !selectedIngredient
      ? null
      : Number(physicalQty) -
        selectedIngredient.systemQty;

  // =========================================================
  // INVENTORY CHANGE
  // =========================================================
  function handleIngredientChange(event) {
    const ingredient = ingredients.find(
      (item) =>
        item.id === Number(event.target.value)
    );

    if (!ingredient) {
      return;
    }

    setSelectedIngredient(ingredient);
    setPhysicalQty("");
  }

  // =========================================================
  // RECORD COUNT
  // =========================================================
  function handleRecordCount() {
    if (!selectedIngredient) {
      alert("Please select an inventory item.");
      return;
    }

    if (physicalQty === "") {
      alert("Please enter the physical quantity.");
      return;
    }

    const physical = Number(physicalQty);

    if (
      Number.isNaN(physical) ||
      physical < 0
    ) {
      alert(
        "Please enter a valid physical quantity."
      );
      return;
    }

    const currentVariance =
      physical -
      selectedIngredient.systemQty;

    const newCount = {
      id: Date.now(),

      date:
        new Date().toLocaleDateString(
          "en-PH"
        ),

      ingredient:
        selectedIngredient.name,

      system:
        selectedIngredient.systemQty,

      physical: physical,

      variance: currentVariance,

      status:
        currentVariance === 0
          ? "Matched"
          : "For Review",
    };

    setCounts((previous) => [
      newCount,
      ...previous,
    ]);

    setPhysicalQty("");
  }

  return (
    <div className="inventory-reconciliation-page">
      <div className="ir-heading">
        <div>
          <div className="ir-eyebrow">
            CONTROL & ACCURACY
          </div>

          <h2>
            Inventory Reconciliation
          </h2>

          <p>
            Compare physical stock with system stock
            and review inventory variances before
            adjustments are made.
          </p>
        </div>

        <div className="ir-count-badge">
          {counts.length} COUNT
          {counts.length !== 1 ? "S" : ""}
        </div>
      </div>

      {/* RECORD COUNT */}
      <section className="ir-card">
        <div className="ir-card-header">
          <div>
            <div className="ir-section-label">
              NEW COUNT
            </div>

            <h3>
              Record physical count
            </h3>
          </div>
        </div>

        <div className="ir-form">
          <div className="ir-field ingredient-field">
            <label>
              Inventory
            </label>

            <select
              value={
                selectedIngredient
                  ? selectedIngredient.id
                  : ""
              }
              onChange={
                handleIngredientChange
              }
              disabled={
                loading ||
                ingredients.length === 0
              }
            >
              {loading ? (
                <option value="">
                  Loading inventory...
                </option>
              ) : ingredients.length === 0 ? (
                <option value="">
                  No inventory found
                </option>
              ) : (
                ingredients.map(
                  (ingredient) => (
                    <option
                      key={ingredient.id}
                      value={ingredient.id}
                    >
                      {ingredient.name}
                    </option>
                  )
                )
              )}
            </select>
          </div>

          <div className="ir-system-quantity">
            <span>
              System quantity
            </span>

            <strong>
              {selectedIngredient
                ? selectedIngredient.systemQty.toLocaleString()
                : "—"}{" "}
              {selectedIngredient
                ? selectedIngredient.unit
                : ""}
            </strong>
          </div>

          <div className="ir-field physical-field">
            <label>
              Physical quantity
            </label>

            <input
              type="number"
              min="0"
              placeholder={
                selectedIngredient
                  ? `Enter quantity in ${selectedIngredient.unit}`
                  : "Enter quantity"
              }
              value={physicalQty}
              onChange={(event) =>
                setPhysicalQty(
                  event.target.value
                )
              }
              disabled={
                !selectedIngredient
              }
            />
          </div>

          <button
            type="button"
            className="ir-record-button"
            onClick={
              handleRecordCount
            }
            disabled={
              !selectedIngredient
            }
          >
            Record count
          </button>
        </div>

        {error && (
          <div
            style={{
              marginTop: "12px",
              color: "#b42318",
            }}
          >
            {error}
          </div>
        )}

        {variance !== null && (
          <div
            className={`ir-variance-preview ${
              variance === 0
                ? "matched"
                : "review"
            }`}
          >
            <span>
              Variance
            </span>

            <strong>
              {variance > 0 ? "+" : ""}
              {variance.toLocaleString()}{" "}
              {selectedIngredient
                ? selectedIngredient.unit
                : ""}
            </strong>

            <span>
              {variance === 0
                ? "System and physical quantity match."
                : "This count requires Owner review."}
            </span>
          </div>
        )}
      </section>

      {/* COUNT REVIEWS */}
      <section className="ir-card">
        <div className="ir-card-header">
          <div>
            <div className="ir-section-label">
              VARIANCES
            </div>

            <h3>
              Count reviews
            </h3>
          </div>

          <div className="ir-event-count">
            {counts.length} RECORD
            {counts.length !== 1
              ? "S"
              : ""}
          </div>
        </div>

        <div className="ir-table-wrapper">
          <table className="ir-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>INVENTORY</th>
                <th>SYSTEM</th>
                <th>PHYSICAL</th>
                <th>VARIANCE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {counts.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="ir-empty">
                      <div className="ir-empty-icon">
                        ▦
                      </div>

                      <strong>
                        No counts recorded
                      </strong>

                      <span>
                        Physical inventory
                        counts will appear
                        here for review.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                counts.map((count) => (
                  <tr key={count.id}>
                    <td>
                      {count.date}
                    </td>

                    <td>
                      <strong>
                        {count.ingredient}
                      </strong>
                    </td>

                    <td>
                      {count.system.toLocaleString()}
                    </td>

                    <td>
                      {count.physical.toLocaleString()}
                    </td>

                    <td
                      className={
                        count.variance === 0
                          ? "variance-matched"
                          : "variance-warning"
                      }
                    >
                      {count.variance > 0
                        ? "+"
                        : ""}
                      {count.variance.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`ir-status ${
                          count.status ===
                          "Matched"
                            ? "status-matched"
                            : "status-review"
                        }`}
                      >
                        {count.status}
                      </span>
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
}

export default InventoryReconciliation;