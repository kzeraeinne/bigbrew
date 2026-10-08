import React, { useEffect, useState } from "react";
import "./Receiving.css";

/* =========================================================
   SMALL LOCAL UI COMPONENTS
   ========================================================= */

function SectionHead({ title, eyebrow }) {
  return (
    <div className="section-head">
      {eyebrow && (
        <div className="section-eyebrow">
          {eyebrow}
        </div>
      )}

      <h2>{title}</h2>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      {children}
    </label>
  );
}

function Empty({ title, detail, icon: Icon }) {
  return (
    <div
      className="receiving-empty"
      style={{
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      {Icon && (
        <div
          style={{
            fontSize: "34px",
            marginBottom: "12px",
          }}
        >
          <Icon />
        </div>
      )}

      <strong
        style={{
          display: "block",
          fontSize: "18px",
          marginBottom: "6px",
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color: "#8a817a",
        }}
      >
        {detail}
      </span>
    </div>
  );
}

function Badge({ tone = "warning", children }) {
  const styles = {
    positive: {
      background: "#eef8f0",
      color: "#28653a",
      border: "1px solid #c6e2cb",
    },

    warning: {
      background: "#fff7e8",
      color: "#9a6500",
      border: "1px solid #ead5a4",
    },

    negative: {
      background: "#fff1ef",
      color: "#9d3024",
      border: "1px solid #efc5bf",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        ...styles[tone],
      }}
    >
      {children}
    </span>
  );
}

function Truck() {
  return (
    <span
      aria-hidden="true"
      style={{
        fontSize: "32px",
      }}
    >
      🚚
    </span>
  );
}

/* =========================================================
   RECEIVING
   ========================================================= */

function Receiving({
  store,
  update,
  user,
}) {
  const API_BASE = "https://kzeraeinne.infinityfreeapp.com/bigbrew_api";

  const [purchases, setPurchases] = useState([]);
  const [receivings, setReceivings] = useState([]);

  const [amounts, setAmounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     GET CURRENT USER ID
     ========================================================= */

  function getUserId() {
    if (user && typeof user === "object") {
      if (user.user_id) {
        return Number(user.user_id);
      }

      if (user.userId) {
        return Number(user.userId);
      }

      if (user.id) {
        return Number(user.id);
      }
    }

    try {
      const storedUser =
        localStorage.getItem("bigbrew_user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);

        return Number(
          parsed?.user_id ||
            parsed?.userId ||
            parsed?.id ||
            0
        );
      }
    } catch (err) {
      console.error(
        "Unable to read logged-in user:",
        err
      );
    }

    return 0;
  }

  /* =========================================================
     LOAD PURCHASES + RECEIVING HISTORY
     ========================================================= */

  async function loadReceivingData() {
    try {
      setLoading(true);
      setError("");

      const [
        purchasesResponse,
        receivingsResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE}/Api/Purchases/List.php`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        ),

        fetch(
          `${API_BASE}/Api/Receivings/List.php`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        ),
      ]);

      const purchasesText =
        await purchasesResponse.text();

      const receivingsText =
        await receivingsResponse.text();

      let purchasesResult;
      let receivingsResult;

      try {
        purchasesResult =
          purchasesText
            ? JSON.parse(purchasesText)
            : {};
      } catch {
        throw new Error(
          `Purchases API returned invalid JSON. HTTP ${purchasesResponse.status}.`
        );
      }

      try {
        receivingsResult =
          receivingsText
            ? JSON.parse(receivingsText)
            : {};
      } catch {
        throw new Error(
          `Receivings API returned invalid JSON. HTTP ${receivingsResponse.status}.`
        );
      }

      if (
        !purchasesResponse.ok ||
        !purchasesResult.success
      ) {
        throw new Error(
          purchasesResult.message ||
            "Failed to load purchases."
        );
      }

      if (
        !receivingsResponse.ok ||
        !receivingsResult.success
      ) {
        throw new Error(
          receivingsResult.message ||
            "Failed to load receiving history."
        );
      }

      setPurchases(
        purchasesResult.data?.purchases || []
      );

      setReceivings(
        receivingsResult.data?.receivings || []
      );
    } catch (err) {
      console.error(
        "Receiving load error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load receiving data."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    loadReceivingData();
  }, []);

  /* =========================================================
     FIND ORDERED QUANTITY
     ========================================================= */

  function getOrderedQuantity(
    purchase,
    ingredientId
  ) {
    const item =
      purchase?.items?.find(
        (x) =>
          Number(x.ingredient_id) ===
          Number(ingredientId)
      );

    return item
      ? Number(item.quantity_ordered || 0)
      : 0;
  }

  /* =========================================================
     FIND RECEIVED QUANTITY
     ========================================================= */

  function getReceivedQuantity(
    purchase,
    ingredientId
  ) {
    const item =
      purchase?.items?.find(
        (x) =>
          Number(x.ingredient_id) ===
          Number(ingredientId)
      );

    return item
      ? Number(item.quantity_received || 0)
      : 0;
  }

  /* =========================================================
     PURCHASES STILL NEEDING RECEIVING
     ========================================================= */

  const awaitingReceipt =
    purchases.flatMap((purchase) => {
      const purchaseStatus =
        String(
          purchase.purchase_status || ""
        ).toUpperCase();

      if (
        purchaseStatus === "CANCELLED" ||
        purchaseStatus === "COMPLETED"
      ) {
        return [];
      }

      return (purchase.items || [])
        .map((item) => {
          const ordered = Number(
            item.quantity_ordered || 0
          );

          const received = Number(
            item.quantity_received || 0
          );

          const remaining = Math.max(
            ordered - received,
            0
          );

          if (remaining <= 0) {
            return null;
          }

          return {
            purchase,
            item,
            ordered,
            received,
            remaining,

            key: `${purchase.purchase_id}-${item.ingredient_id}`,
          };
        })
        .filter(Boolean);
    });

  /* =========================================================
     PROCESS DELIVERY
     ========================================================= */

  async function handleDelivery(row) {
    const quantity = Number(
      amounts[row.key] || 0
    );

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setError(
        "Enter the actual quantity received."
      );

      return;
    }

    if (quantity > row.remaining) {
      setError(
        `You can only receive up to ${row.remaining} ${row.item.unit_of_measure}.`
      );

      return;
    }

    setSavingId(row.key);
    setError("");
    setSuccess("");

    try {
      const receivedBy = getUserId();

      const payload = {
        purchase_id: Number(
          row.purchase.purchase_id
        ),

        received_by:
          receivedBy > 0
            ? receivedBy
            : null,

        items: [
          {
            ingredient_id: Number(
              row.item.ingredient_id
            ),

            quantity_received: quantity,
          },
        ],
      };

      console.log(
        "Creating receiving:",
        payload
      );

      const response = await fetch(
        `${API_BASE}/Api/Receivings/Create.php`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const responseText =
        await response.text();

      let result;

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        throw new Error(
          `Receiving API returned invalid JSON. HTTP ${response.status}.`
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to record receiving."
        );
      }

      setAmounts((current) => ({
        ...current,
        [row.key]: "",
      }));

      setSuccess(
        result.message ||
          "Item delivered successfully."
      );

      /*
       * Reload from MySQL.
       *
       * This makes the following come from
       * the actual database:
       *
       * - Awaiting Receipt
       * - Receiving History
       * - Quantity Received
       * - Remaining Quantity
       * - Purchase Status
       * - Inventory
       */

      await loadReceivingData();
    } catch (err) {
      console.error(
        "Receiving error:",
        err
      );

      setError(
        err?.message ||
          "Unable to record delivery."
      );
    } finally {
      setSavingId(null);
    }
  }

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <>
        <div className="page-intro">
          <div>
            <div className="eyebrow blue">
              GOODS IN
            </div>

            <h1>Receiving</h1>

            <p>
              Confirm actual delivered
              quantities. Only received stock
              is added to inventory.
            </p>
          </div>
        </div>

        <div className="panel">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading receiving data...
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     MAIN PAGE
     ========================================================= */

  return (
    <>
      <div className="page-intro">
        <div>
          <div className="eyebrow blue">
            GOODS IN
          </div>

          <h1>Receiving</h1>

          <p>
            Confirm actual delivered
            quantities. Only received stock
            is added to inventory.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="receiving-error"
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#fff1ef",
            border: "1px solid #efc5bf",
            color: "#9d3024",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="receiving-success"
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#eef8f0",
            border: "1px solid #c6e2cb",
            color: "#28653a",
          }}
        >
          ✓ {success}
        </div>
      )}

      {/* =====================================================
          AWAITING RECEIPT
          ===================================================== */}

      <div className="panel">
        <SectionHead
          title="Awaiting receipt"
          eyebrow="PURCHASE ORDERS"
        />

        {awaitingReceipt.length ? (
          awaitingReceipt.map((row) => {
            const ingredientName =
              row.item.ingredient_name ||
              "Unknown ingredient";

            const unit =
              row.item.unit_of_measure ||
              "";

            const isSaving =
              savingId === row.key;

            return (
              <div
                className="receive-row"
                key={row.key}
              >
                <div>
                  <strong>
                    {ingredientName}
                  </strong>

                  <small>
                    {row.purchase.supplier_name}
                    {" · "}
                    {row.purchase.purchase_code}
                  </small>

                  <small>
                    Ordered{" "}
                    {row.ordered} {unit}
                    {" · "}
                    Already received{" "}
                    {row.received} {unit}
                  </small>

                  <small>
                    Remaining{" "}
                    {row.remaining} {unit}
                  </small>
                </div>

                <div className="receive-actions">
                  <Field
                    label="Actual quantity received"
                  >
                    <input
                      type="number"
                      min="0"
                      max={row.remaining}
                      step="0.001"
                      placeholder="0"
                      value={
                        amounts[row.key] || ""
                      }
                      disabled={isSaving}
                      onChange={(e) =>
                        setAmounts(
                          (current) => ({
                            ...current,
                            [row.key]:
                              e.target.value,
                          })
                        )
                      }
                    />
                  </Field>

                  <button
                    className="btn primary"
                    type="button"
                    disabled={isSaving}
                    onClick={() =>
                      handleDelivery(row)
                    }
                  >
                    {isSaving
                      ? "Saving..."
                      : "Item Delivered"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <Empty
            title="Nothing awaiting receipt"
            detail="All pending purchase quantities have been received."
            icon={Truck}
          />
        )}
      </div>

      {/* =====================================================
          RECEIVING HISTORY
          ===================================================== */}

      <div className="panel table-panel spaced-panel">
        <SectionHead
          title="Receiving history & variances"
          eyebrow="RECEIPTS"
        />

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>RECEIVING</th>
                <th>SUPPLIER</th>
                <th>INGREDIENT</th>
                <th>ORDERED</th>
                <th>RECEIVED</th>
                <th>VARIANCE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {receivings.length ? (
                receivings.map(
                  (receiving) => {
                    const purchase =
                      purchases.find(
                        (p) =>
                          Number(
                            p.purchase_id
                          ) ===
                          Number(
                            receiving.purchase_id
                          )
                      );

                    return (
                      <React.Fragment
                        key={
                          receiving.receiving_id
                        }
                      >
                        {(receiving.items || [])
                          .map((item) => {
                            const ordered =
                              purchase
                                ? getOrderedQuantity(
                                    purchase,
                                    item.ingredient_id
                                  )
                                : 0;

                            const received =
                              Number(
                                item.quantity_received ||
                                  0
                              );

                            /*
                             * The purchase list contains
                             * cumulative received quantity.
                             */

                            const cumulativeReceived =
                              purchase
                                ? getReceivedQuantity(
                                    purchase,
                                    item.ingredient_id
                                  )
                                : received;

                            const variance =
                              cumulativeReceived -
                              ordered;

                            return (
                              <tr
                                key={`${receiving.receiving_id}-${item.receiving_item_id}`}
                              >
                                <td>
                                  <strong>
                                    {
                                      receiving.receiving_code
                                    }
                                  </strong>

                                  <small>
                                    {
                                      receiving.purchase_code
                                    }
                                  </small>
                                </td>

                                <td>
                                  {
                                    receiving.supplier_name
                                  }
                                </td>

                                <td>
                                  {
                                    item.ingredient_name
                                  }
                                </td>

                                <td>
                                  {ordered.toFixed(
                                    3
                                  )}{" "}
                                  {
                                    item.unit_of_measure
                                  }
                                </td>

                                <td>
                                  {cumulativeReceived.toFixed(
                                    3
                                  )}{" "}
                                  {
                                    item.unit_of_measure
                                  }
                                </td>

                                <td
                                  style={{
                                    fontWeight: 700,

                                    color:
                                      variance ===
                                      0
                                        ? "inherit"
                                        : variance <
                                          0
                                        ? "#b42318"
                                        : "#28653a",
                                  }}
                                >
                                  {variance > 0
                                    ? "+"
                                    : ""}

                                  {variance.toFixed(
                                    3
                                  )}{" "}
                                  {
                                    item.unit_of_measure
                                  }
                                </td>

                                <td>
                                  <Badge
                                    tone={
                                      receiving.receiving_status ===
                                      "COMPLETED"
                                        ? "positive"
                                        : "warning"
                                    }
                                  >
                                    {
                                      receiving.receiving_status
                                    }
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No receiving history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Receiving;