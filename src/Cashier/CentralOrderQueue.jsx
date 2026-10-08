import React, { useEffect, useState } from "react";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com";

const CentralOrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState("");

  // =========================================================
  // GET ORDERS
  // =========================================================
  const fetchOrders = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_BASE}/Api/Orders/List.php`
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to load orders.");
      }

      const orderList = result.data?.orders || [];

      setOrders(orderList);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await fetch(
        `${API_BASE}/Api/Orders/UpdateStatus.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            new_status: newStatus,
            changed_by: 2,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update order status."
        );
      }

      // Refresh orders after successful update
      await fetchOrders();
    } catch (err) {
      console.error("Update order status error:", err);
      setError(
        err.message || "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =========================================================
  // INITIAL LOAD + AUTO REFRESH
  // =========================================================
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // STATUS ACTION
  // =========================================================
  const handleStatusUpdate = (order) => {
    const currentStatus =
      order.orderStatus ||
      order.order_status;

    const orderId =
      order.orderId ||
      order.order_id;

    if (currentStatus === "PENDING") {
      updateOrderStatus(orderId, "CONFIRMED");
    } else if (currentStatus === "CONFIRMED") {
      updateOrderStatus(orderId, "PREPARING");
    } else if (currentStatus === "PREPARING") {
      updateOrderStatus(orderId, "READY");
    } else if (currentStatus === "READY") {
      updateOrderStatus(orderId, "RELEASED");
    }
  };

  // =========================================================
  // STATUS LABEL
  // =========================================================
  const getActionLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Confirm";

      case "CONFIRMED":
        return "Start Preparing";

      case "PREPARING":
        return "Mark Ready";

      case "READY":
        return "Release";

      default:
        return "";
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";

      case "CONFIRMED":
        return "confirmed";

      case "PREPARING":
        return "preparing";

      case "READY":
        return "ready";

      case "RELEASED":
        return "released";

      case "CANCELLED":
        return "cancelled";

      default:
        return "";
    }
  };

  // =========================================================
  // COUNTS
  // =========================================================
  const pendingCount = orders.filter(
    (order) =>
      order.orderStatus === "PENDING" ||
      order.order_status === "PENDING" ||
      order.orderStatus === "CONFIRMED" ||
      order.order_status === "CONFIRMED"
  ).length;

  const preparingCount = orders.filter(
    (order) =>
      order.orderStatus === "PREPARING" ||
      order.order_status === "PREPARING"
  ).length;

  const readyCount = orders.filter(
    (order) =>
      order.orderStatus === "READY" ||
      order.order_status === "READY"
  ).length;

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="central-order-queue">

      {/* =====================================================
          HEADER / COUNTS
      ===================================================== */}
      <div className="order-queue-header">
        <div>
          <h1>Central Order Queue</h1>
          <p>Manage and monitor customer orders</p>
        </div>

        <div className="order-queue-stats">
          <div className="queue-stat">
            <span className="queue-stat-label">
              Pending
            </span>

            <span className="queue-stat-value">
              {pendingCount}
            </span>
          </div>

          <div className="queue-stat">
            <span className="queue-stat-label">
              Preparing
            </span>

            <span className="queue-stat-value">
              {preparingCount}
            </span>
          </div>

          <div className="queue-stat">
            <span className="queue-stat-label">
              Ready
            </span>

            <span className="queue-stat-value">
              {readyCount}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="order-queue-error">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading ? (
        <div className="order-queue-loading">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="order-queue-empty">
          No orders found.
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => {
            const orderId =
              order.orderId ||
              order.order_id;

            const orderNumber =
              order.orderNumber ||
              order.order_number ||
              order.orderCode ||
              order.order_code ||
              `Order #${orderId}`;

            const customerName =
              order.customerName ||
              order.customer_name ||
              "Walk-in Customer";

            const paymentMethod =
              order.paymentMethod ||
              order.payment_method ||
              "-";

            const paymentStatus =
              order.paymentStatus ||
              order.payment_status ||
              "-";

            const orderDate =
              order.orderDate ||
              order.order_date ||
              order.createdAt ||
              order.created_at ||
              "-";

            const total =
              Number(
                order.totalAmount ??
                order.total_amount ??
                order.total ??
                0
              );

            const orderStatus =
              order.orderStatus ||
              order.order_status ||
              "PENDING";

            const statusClass =
              getStatusClass(orderStatus);

            const actionLabel =
              getActionLabel(orderStatus);

            return (
              <div
                className="order-card"
                key={orderId}
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}
                <div className="order-card-header">

                  <div>
                    <h3>
                      {orderNumber}
                    </h3>

                    <span className="order-customer">
                      {customerName}
                    </span>
                  </div>

                  <span
                    className={`order-status ${statusClass}`}
                  >
                    {orderStatus}
                  </span>

                </div>

                {/* =================================================
                    ORDER INFORMATION
                ================================================= */}
                <div className="order-card-info">

                  <div>
                    <span className="info-label">
                      Payment
                    </span>

                    <span className="info-value">
                      {paymentMethod}
                    </span>
                  </div>

                  <div>
                    <span className="info-label">
                      Payment Status
                    </span>

                    <span className="info-value">
                      {paymentStatus}
                    </span>
                  </div>

                  <div>
                    <span className="info-label">
                      Date
                    </span>

                    <span className="info-value">
                      {orderDate}
                    </span>
                  </div>

                  <div>
                    <span className="info-label">
                      Total
                    </span>

                    <span className="info-value">
                      ₱{total.toFixed(2)}
                    </span>
                  </div>

                </div>

                {/* =================================================
                    ITEMS
                ================================================= */}
                {Array.isArray(order.items) &&
                  order.items.length > 0 && (
                    <div className="order-items">

                      {order.items.map((item) => (
                        <div
                          className="order-item"
                          key={
                            item.orderItemId ||
                            item.order_item_id
                          }
                        >
                          <div className="order-item-name">
                            {item.productName ||
                              item.product_name ||
                              "Product"}
                          </div>

                          <div className="order-item-size">
                            {item.sizeName ||
                              item.size_name ||
                              item.sizeSnapshot ||
                              item.size_snapshot ||
                              ""}
                          </div>

                          <div className="order-item-quantity">
                            ×{" "}
                            {item.quantity || 0}
                          </div>

                          <div className="order-item-price">
                            ₱
                            {Number(
                              item.itemTotal ??
                              item.item_total ??
                              0
                            ).toFixed(2)}
                          </div>
                        </div>
                      ))}

                    </div>
                  )}

                {/* =================================================
                    ACTION
                ================================================= */}
                {actionLabel && (
                  <div className="order-card-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(order)
                      }
                      disabled={
                        updatingOrderId === orderId
                      }
                    >
                      {updatingOrderId === orderId
                        ? "Updating..."
                        : actionLabel}
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default CentralOrderQueue;