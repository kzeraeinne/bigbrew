import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Inventory.css";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com";

/* =========================================================
   HELPERS
   ========================================================= */

function formatMoney(value) {
  return `₱${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const raw = String(value);

  if (raw.length >= 10) {
    const parts = raw.slice(0, 10).split("-");

    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
  }

  return raw;
}

/* =========================================================
   STATUS CLASS
   ========================================================= */

function statusClass(status) {
  if (status === "IN STOCK") {
    return "inv-status-good";
  }

  if (status === "LOW STOCK") {
    return "inv-status-warning";
  }

  if (status === "EXPIRING SOON") {
    return "inv-status-warning";
  }

  if (status === "EXPIRED") {
    return "inv-status-danger";
  }

  if (status === "OUT OF STOCK") {
    return "inv-status-danger";
  }

  return "";
}

/* =========================================================
   MOVEMENT TYPE
   ========================================================= */

function displayMovementType(type) {
  switch (String(type || "").toUpperCase()) {
    case "PURCHASE":
      return "RECEIVING";

    case "SALE_USAGE":
      return "SALE USAGE";

    case "COUNT_ADJUSTMENT":
      return "COUNT ADJUSTMENT";

    case "ADJUSTMENT":
      return "ADJUSTMENT";

    case "WASTE":
      return "WASTE";

    default:
      return String(type || "").replaceAll("_", " ");
  }
}

/* =========================================================
   MOVEMENT QUANTITY
   ========================================================= */

function formatMovementQuantity(quantity, unit) {
  const number = Number(quantity || 0);

  const formattedNumber = Number.isInteger(number)
    ? number.toLocaleString()
    : number.toLocaleString(undefined, {
        maximumFractionDigits: 3,
      });

  const sign = number > 0 ? "+" : "";

  return `${sign}${formattedNumber} ${unit || ""}`.trim();
}

/* =========================================================
   MOVEMENT DATE
   ========================================================= */

function formatMovementDate(value) {
  if (!value) {
    return "";
  }

  const raw = String(value);

  if (raw.length >= 16) {
    return raw.slice(0, 16);
  }

  return raw;
}

/* =========================================================
   MAP INVENTORY API DATA
   ========================================================= */

function mapInventoryItem(item) {
  const available = Number(
    item.quantity_on_hand || 0
  );

  const reorder = Number(
    item.reorder_level || 0
  );

  /*
   * IMPORTANT:
   *
   * List.php now returns:
   *
   * SUM(total_cost) / SUM(quantity_ordered)
   *
   * Therefore unit_cost is the calculated
   * average inventory unit cost.
   *
   * DO NOT use last_unit_cost here.
   */

  const unitCost = Number(
    item.unit_cost || 0
  );

  const status =
    item.stock_status || "IN STOCK";

  const expiration =
    item.expiration_tracking
      ? "Tracked"
      : "Not tracked";

  const category = "Ingredients";

  return {
    id:
      item.inventory_code ||
      (
        item.inventory_id !== null &&
        item.inventory_id !== undefined
          ? `INV${String(
              item.inventory_id
            ).padStart(3, "0")}`
          : item.ingredient_code
      ),

    inventoryId:
      item.inventory_id,

    ingredientId:
      Number(item.ingredient_id),

    ingredientCode:
      item.ingredient_code || "",

    name:
      item.ingredient_name ||
      "Unknown ingredient",

    category,

    available,

    total: available,

    unit:
      item.unit_of_measure || "",

    reorder,

    safety: null,

    /*
     * THIS IS THE IMPORTANT VALUE.
     *
     * Uses:
     * total purchase cost / total quantity purchased
     */

    unitCost,

    /*
     * Latest purchase cost remains separate.
     * It is NOT used for the Unit Cost column.
     */

    lastUnitCost:
      Number(item.last_unit_cost || 0),

    averageCost:
      Number(item.unit_cost || 0),

    expiration,

    expirationTracking:
      Boolean(
        Number(
          item.expiration_tracking || 0
        )
      ),

    status,

    linkedProducts:
      item.linked_products !== undefined &&
      item.linked_products !== null
        ? Number(item.linked_products)
        : item.linkedProducts !== undefined &&
          item.linkedProducts !== null
          ? Number(item.linkedProducts)
          : 0,

    /*
     * This comes directly from List.php.
     */

    stockValue:
      Number(item.stock_value || 0),
  };
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Inventory() {

  /* =======================================================
     STATE
     ======================================================= */

  const [inventory, setInventory] =
    useState([]);

  const [inventoryLoading, setInventoryLoading] =
    useState(true);

  const [inventoryError, setInventoryError] =
    useState("");

  const [lots, setLots] =
    useState([]);

  const [movements, setMovements] =
    useState([]);

  const [movementLoading, setMovementLoading] =
    useState(false);

  const [movementError, setMovementError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("stock");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All categories");

  const [status, setStatus] =
    useState("All statuses");

  const [sortBy, setSortBy] =
    useState("Name");

  /* =======================================================
     LOAD INVENTORY
     ======================================================= */

  async function loadInventory() {
    try {
      setInventoryLoading(true);
      setInventoryError("");

      /*
       * IMPORTANT:
       *
       * The timestamp prevents the browser from using
       * an old cached List.php response.
       */

      const response = await fetch(
        `${API_BASE}/Api/Inventory/List.php?_=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to retrieve inventory."
        );
      }

      const apiInventory =
        result.data?.inventory || [];

      const apiLots =
        result.data?.lots || [];

      /*
       * DEBUG:
       * This lets us verify exactly what PHP
       * is returning to React.
       */

      console.log(
        "LATEST INVENTORY FROM DATABASE:",
        apiInventory
      );

      /*
       * Specifically check Unit Cost values.
       */

      console.table(
        apiInventory.map((item) => ({
          ingredient:
            item.ingredient_name,

          code:
            item.ingredient_code,

          quantity:
            item.quantity_on_hand,

          unit_cost:
            item.unit_cost,

          last_unit_cost:
            item.last_unit_cost,

          stock_value:
            item.stock_value,
        }))
      );

      setLots(apiLots);

      const formattedInventory =
        apiInventory.map(
          mapInventoryItem
        );

      /*
       * DEBUG:
       * This confirms what the UI receives
       * after mapping.
       */

      console.log(
        "FORMATTED INVENTORY:",
        formattedInventory.map(
          (item) => ({
            name: item.name,

            unitCost:
              item.unitCost,

            lastUnitCost:
              item.lastUnitCost,

            stockValue:
              item.stockValue,
          })
        )
      );

      setInventory(
        formattedInventory
      );

    } catch (error) {

      console.error(
        "Failed to load inventory:",
        error
      );

      setInventoryError(
        error.message ||
          "Unable to load inventory."
      );

      setInventory([]);

      setLots([]);

    } finally {

      setInventoryLoading(false);
    }
  }

  /* =======================================================
     LOAD MOVEMENTS
     ======================================================= */

  async function loadMovements() {
    try {
      setMovementLoading(true);
      setMovementError("");

      const response = await fetch(
        `${API_BASE}/Api/Inventory/Movements.php?_=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to retrieve inventory movements."
        );
      }

      const apiMovements =
        result.data?.movements || [];

      const formattedMovements =
        apiMovements.map(
          (movement) => {

            const quantity =
              Number(
                movement.quantity || 0
              );

            return {
              id:
                Number(
                  movement.movement_id
                ),

              movementId:
                Number(
                  movement.movement_id
                ),

              code:
                movement.movement_code ||
                "",

              movementCode:
                movement.movement_code ||
                "",

              date:
                formatMovementDate(
                  movement.movement_date
                ),

              item:
                movement.ingredient_name ||
                "Unknown ingredient",

              ingredientName:
                movement.ingredient_name ||
                "Unknown ingredient",

              ingredientCode:
                movement.ingredient_code ||
                "",

              unit:
                movement.unit_of_measure ||
                "",

              type:
                displayMovementType(
                  movement.movement_type
                ),

              movementType:
                movement.movement_type ||
                "",

              quantity,

              quantityDisplay:
                formatMovementQuantity(
                  quantity,
                  movement.unit_of_measure
                ),

              reference:
                movement.reference_code ||
                movement.reference_label ||
                (
                  movement.reference_type &&
                  movement.reference_id !== null
                    ? `${movement.reference_type} #${movement.reference_id}`
                    : ""
                ),

              referenceType:
                movement.reference_type ||
                "",

              referenceId:
                movement.reference_id !== null
                  ? Number(
                      movement.reference_id
                    )
                  : null,

              user:
                movement.user_name ||
                movement.user_label ||
                movement.user_code ||
                "System",

              userName:
                movement.user_name ||
                movement.user_label ||
                "System",

              userCode:
                movement.user_code ||
                "",
            };
          }
        );

      setMovements(
        formattedMovements
      );

    } catch (error) {

      console.error(
        "Failed to load inventory movements:",
        error
      );

      setMovementError(
        error.message ||
          "Unable to load inventory movements."
      );

      setMovements([]);

    } finally {

      setMovementLoading(false);
    }
  }

  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {
    loadInventory();
    loadMovements();
  }, []);

  /* =======================================================
     REFRESH MOVEMENTS
     ======================================================= */

  useEffect(() => {
    if (activeTab === "movement") {
      loadMovements();
    }
  }, [activeTab]);

  /* =======================================================
     CATEGORIES
     ======================================================= */

  const categories =
    useMemo(() => {

      const uniqueCategories = [
        ...new Set(
          inventory.map(
            (item) =>
              item.category
          )
        ),
      ];

      return uniqueCategories;

    }, [inventory]);

  /* =======================================================
     FILTER INVENTORY
     ======================================================= */

  const filteredInventory =
    useMemo(() => {

      let result =
        inventory.filter(
          (item) => {

            const searchText =
              search.toLowerCase();

            const itemName =
              String(
                item.name || ""
              ).toLowerCase();

            const itemCategory =
              String(
                item.category || ""
              ).toLowerCase();

            const searchMatch =
              itemName.includes(
                searchText
              ) ||
              itemCategory.includes(
                searchText
              );

            const categoryMatch =
              category ===
                "All categories" ||
              item.category ===
                category;

            const statusMatch =
              status ===
                "All statuses" ||
              item.status ===
                status;

            return (
              searchMatch &&
              categoryMatch &&
              statusMatch
            );
          }
        );

      if (sortBy === "Name") {

        result.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
      }

      if (sortBy === "Stock") {

        result.sort(
          (a, b) =>
            Number(a.available) -
            Number(b.available)
        );
      }

      if (sortBy === "Unit Cost") {

        result.sort(
          (a, b) =>
            Number(b.unitCost) -
            Number(a.unitCost)
        );
      }

      return result;

    }, [
      inventory,
      search,
      category,
      status,
      sortBy,
    ]);

  /* =======================================================
     SUMMARY
     ======================================================= */

  const totalIngredients =
    inventory.length;

  const inStock =
    inventory.filter(
      (item) =>
        item.status ===
        "IN STOCK"
    ).length;

  const lowStock =
    inventory.filter(
      (item) =>
        item.status ===
        "LOW STOCK"
    ).length;

  const outOfStock =
    inventory.filter(
      (item) =>
        item.status ===
        "OUT OF STOCK"
    ).length;

  const expiringSoon =
    lots.filter(
      (lot) =>
        String(
          lot.lot_status || ""
        ).toUpperCase() ===
        "EXPIRING SOON"
    ).length;

  const expired =
    lots.filter(
      (lot) =>
        String(
          lot.lot_status || ""
        ).toUpperCase() ===
        "EXPIRED"
    ).length;

  const stockValue =
    inventory.reduce(
      (total, item) =>
        total +
        Number(
          item.stockValue || 0
        ),
      0
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="inventory-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="inventory-page-heading">

        <div>

          <div className="inventory-eyebrow">
            STOCK CONTROL
          </div>

          <h1>
            Inventory
          </h1>

          <p>
            Monitor ingredient availability,
            stock levels, expiration and
            inventory movements.
          </p>

        </div>

      </div>

      {/* ===================================================
          LOADING
          =================================================== */}

      {inventoryLoading && (
        <div
          className="inventory-no-results"
          style={{
            padding: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Loading inventory...
        </div>
      )}

      {/* ===================================================
          ERROR
          =================================================== */}

      {!inventoryLoading &&
        inventoryError && (
          <div
            className="inventory-no-results"
            style={{
              padding: "20px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {inventoryError}
          </div>
        )}

      {/* ===================================================
          SUMMARY CARDS
          =================================================== */}

      <div className="inventory-stats-grid">

        <div className="inventory-stat-card">

          <span>
            Total inventory items
          </span>

          <strong>
            {totalIngredients}
          </strong>

        </div>

        <div className="inventory-stat-card">

          <span>
            In stock
          </span>

          <strong>
            {inStock}
          </strong>

        </div>

        <div className="inventory-stat-card">

          <span>
            Low / out of stock
          </span>

          <strong>
            {lowStock + outOfStock}
          </strong>

        </div>

        <div className="inventory-stat-card">

          <span>
            Expiring soon
          </span>

          <strong>
            {expiringSoon}
          </strong>

        </div>

        <div className="inventory-stat-card">

          <span>
            Expired
          </span>

          <strong>
            {expired}
          </strong>

        </div>

        <div className="inventory-stat-card">

          <span>
            Estimated stock value
          </span>

          <strong>
            {formatMoney(stockValue)}
          </strong>

        </div>

      </div>

      {/* ===================================================
          MAIN PANEL
          =================================================== */}

      <div className="inventory-panel">

        <div className="inventory-panel-top">

          <div className="inventory-tabs">

            <button
              className={
                activeTab === "stock"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("stock")
              }
            >
              Stock levels
            </button>

            <button
              className={
                activeTab === "expiration"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("expiration")
              }
            >
              Expiration lots
            </button>

            <button
              className={
                activeTab === "movement"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("movement")
              }
            >
              Movement history
            </button>

          </div>

          <div className="inventory-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search name or category..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================================
            STOCK LEVELS
            ================================================= */}

        {activeTab === "stock" && (
          <>

            <div className="inventory-filters">

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >

                <option>
                  All categories
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >

                <option>
                  All statuses
                </option>

                <option>
                  IN STOCK
                </option>

                <option>
                  LOW STOCK
                </option>

                <option>
                  EXPIRING SOON
                </option>

                <option>
                  EXPIRED
                </option>

                <option>
                  OUT OF STOCK
                </option>

              </select>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >

                <option>
                  Name
                </option>

                <option>
                  Stock
                </option>

                <option>
                  Unit Cost
                </option>

              </select>

            </div>

            <div className="inventory-table-wrapper">

              <table className="inventory-table">

                <thead>

                  <tr>

                    <th>
                      INGREDIENT / ID
                    </th>

                    <th>
                      CATEGORY
                    </th>

                    <th>
                      AVAILABLE / TOTAL
                    </th>

                    <th>
                      REORDER / SAFETY
                    </th>

                    <th>
                      UNIT COST
                    </th>

                    <th>
                      EXPIRATION
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      LINKED PRODUCTS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredInventory.map(
                    (item) => (

                      <tr
                        key={
                          item.ingredientId
                        }
                      >

                        <td>

                          <div className="inventory-item-name">
                            {item.name}
                          </div>

                          <div className="inventory-item-id">
                            {item.ingredientCode}
                          </div>

                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>

                          <strong>

                            {Number(
                              item.available
                            ).toLocaleString()}

                            {" / "}

                            {Number(
                              item.total
                            ).toLocaleString()}

                            {" "}

                            {item.unit}

                          </strong>

                        </td>

                        <td>

                          {Number(
                            item.reorder
                          ).toLocaleString()}

                          {" / "}

                          {item.safety !== null
                            ? Number(
                                item.safety
                              ).toLocaleString()
                            : "—"}

                          {" "}

                          {item.unit}

                        </td>

                        {/* =================================
                            UNIT COST
                            ================================= */}

                        <td>

                          {formatMoney(
                            item.unitCost
                          )}

                        </td>

                        <td>
                          {item.expiration}
                        </td>

                        <td>

                          <span
                            className={
                              `inventory-status ${statusClass(
                                item.status
                              )}`
                            }
                          >
                            {item.status}
                          </span>

                        </td>

                        <td>

                          {item.linkedProducts !== null
                            ? `${item.linkedProducts} ${
                                item.linkedProducts === 1
                                  ? "product"
                                  : "products"
                              }`
                            : "—"}

                        </td>

                      </tr>

                    )
                  )}

                  {!filteredInventory.length && (

                    <tr>

                      <td
                        colSpan="8"
                        className="inventory-no-results"
                      >
                        No inventory items match
                        your filters.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </>
        )}

        {/* =================================================
            EXPIRATION LOTS
            ================================================= */}

        {activeTab === "expiration" && (

          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>

                <tr>

                  <th>
                    INGREDIENT
                  </th>

                  <th>
                    LOT / BATCH
                  </th>

                  <th>
                    AVAILABLE
                  </th>

                  <th>
                    RECEIVED
                  </th>

                  <th>
                    EXPIRATION
                  </th>

                  <th>
                    STATUS
                  </th>

                </tr>

              </thead>

              <tbody>

                {lots.map(
                  (lot) => (

                    <tr
                      key={lot.lot_id}
                    >

                      <td>

                        <div className="inventory-item-name">
                          {lot.ingredient_name}
                        </div>

                        <div className="inventory-item-id">
                          {lot.ingredient_code}
                        </div>

                      </td>

                      <td>
                        {lot.lot_code || "—"}
                      </td>

                      <td>

                        {Number(
                          lot.quantity_remaining || 0
                        ).toLocaleString()}

                        {" "}

                        {lot.unit_of_measure}

                      </td>

                      <td>

                        {formatDate(
                          lot.received_date
                        )}

                      </td>

                      <td>

                        {lot.expiration_date
                          ? formatDate(
                              lot.expiration_date
                            )
                          : "No expiration"}

                      </td>

                      <td>

                        <span
                          className={
                            `inventory-status ${statusClass(
                              lot.lot_status
                            )}`
                          }
                        >
                          {lot.lot_status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

                {!lots.length && (

                  <tr>

                    <td
                      colSpan="6"
                      className="inventory-no-results"
                    >
                      No inventory lots
                      available.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

        {/* =================================================
            MOVEMENT HISTORY
            ================================================= */}

        {activeTab === "movement" && (

          <div className="inventory-table-wrapper">

            {movementLoading && (

              <div
                className="inventory-no-results"
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                Loading movement history...
              </div>

            )}

            {!movementLoading &&
              movementError && (

                <div
                  className="inventory-no-results"
                  style={{
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  {movementError}
                </div>

              )}

            {!movementLoading &&
              !movementError && (

                <table className="inventory-table">

                  <thead>

                    <tr>

                      <th>
                        DATE / TIME
                      </th>

                      <th>
                        ITEM
                      </th>

                      <th>
                        MOVEMENT
                      </th>

                      <th>
                        QUANTITY
                      </th>

                      <th>
                        REFERENCE
                      </th>

                      <th>
                        USER
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {movements.map(
                      (movement) => (

                        <tr
                          key={
                            movement.id
                          }
                        >

                          <td>
                            {movement.date}
                          </td>

                          <td>

                            <div className="inventory-item-name">
                              {movement.item}
                            </div>

                            {movement.ingredientCode && (

                              <div className="inventory-item-id">
                                {
                                  movement.ingredientCode
                                }
                              </div>

                            )}

                          </td>

                          <td>
                            {movement.type}
                          </td>

                          <td>

                            <strong
                              className={
                                Number(
                                  movement.quantity
                                ) < 0
                                  ? "inventory-negative"
                                  : "inventory-positive"
                              }
                            >
                              {
                                movement.quantityDisplay
                              }
                            </strong>

                          </td>

                          <td>
                            {movement.reference}
                          </td>

                          <td>
                            {movement.user}
                          </td>

                        </tr>

                      )
                    )}

                    {!movements.length && (

                      <tr>

                        <td
                          colSpan="6"
                          className="inventory-no-results"
                        >
                          No inventory movements
                          recorded yet.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              )}

          </div>

        )}

      </div>

      {/* ===================================================
          BOTTOM GRID
          =================================================== */}

      <div className="inventory-bottom-grid">

        {/* STOCK SIGNALS */}

        <div className="inventory-bottom-card">

          <div className="inventory-card-eyebrow">
            STOCK SIGNALS
          </div>

          <h3>
            Ingredients to restock
          </h3>

          {lowStock === 0 &&
          outOfStock === 0 ? (

            <div className="inventory-empty">

              <div className="inventory-empty-icon">
                ✓
              </div>

              <strong>
                Stock levels healthy
              </strong>

              <span>
                No ingredients are currently
                below their reorder level.
              </span>

            </div>

          ) : (

            <div className="inventory-alert-list">

              {inventory
                .filter(
                  (item) =>
                    item.status ===
                      "LOW STOCK" ||
                    item.status ===
                      "OUT OF STOCK"
                )
                .map(
                  (item) => (

                    <div
                      className="inventory-alert-row"
                      key={
                        item.ingredientId
                      }
                    >

                      <span>
                        {item.name}
                      </span>

                      <strong>

                        {Number(
                          item.available
                        ).toLocaleString()}

                        {" "}

                        {item.unit}

                      </strong>

                    </div>

                  )
                )}

            </div>

          )}

        </div>

        {/* RECENT ACTIVITY */}

        <div className="inventory-bottom-card">

          <div className="inventory-card-eyebrow">
            ACTIVITY
          </div>

          <h3>
            Recent stock changes
          </h3>

          <div className="inventory-activity-list">

            {movements
              .slice(0, 4)
              .map(
                (movement) => (

                  <div
                    className="inventory-activity-row"
                    key={
                      movement.id
                    }
                  >

                    <div>

                      <strong>
                        {movement.item}
                      </strong>

                      <span>

                        {movement.type}

                        {" · "}

                        {movement.reference}

                      </span>

                    </div>

                    <strong
                      className={
                        Number(
                          movement.quantity
                        ) < 0
                          ? "inventory-negative"
                          : "inventory-positive"
                      }
                    >
                      {
                        movement.quantityDisplay
                      }
                    </strong>

                  </div>

                )
              )}

            {!movements.length && (

              <div className="inventory-empty">

                <span>
                  No recent stock changes.
                </span>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}