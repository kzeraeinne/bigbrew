import React from "react";
import "./CustomerReceipt.css";

function CustomerReceipt({
  paymentData,
  onViewOrderStatus,
}) {
  const orderNumber =
    paymentData?.orderNumber ||
    "00127";

  const customerName =
    paymentData?.customerName ||
    "Guest";

  const cart =
    paymentData?.cart ||
    [];

  const total =
    Number(paymentData?.total || 0);

  const paymentMethod =
    paymentData?.paymentMethod ||
    "Cash";

  const paymentStatus =
    paymentData?.paymentStatus ||
    "PENDING";

  const orderDate =
    paymentData?.orderDate
      ? new Date(paymentData.orderDate)
      : new Date();

  const formattedDate =
    orderDate.toLocaleDateString(
      "en-PH",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  const formattedTime =
    orderDate.toLocaleTimeString(
      "en-PH",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  return (
    <div className="customer-receipt-page">

      {/* HEADER */}
      <header className="customer-receipt-header">

        <div className="customer-receipt-brand">
          <span className="customer-receipt-brand-name">
            BIGBREW
          </span>

          <span className="customer-receipt-brand-subtitle">
            Order Receipt
          </span>
        </div>

      </header>


      {/* CONTENT */}
      <main className="customer-receipt-content">

        {/* SUCCESS */}
        <section className="customer-receipt-success">

          <div className="customer-receipt-success-icon">
            ✓
          </div>

          <h1>
            Order Confirmed!
          </h1>

          <p>
            Thank you, {customerName}.
            Your order has been received.
          </p>

        </section>


        {/* ORDER NUMBER */}
        <section className="customer-receipt-number-card">

          <span>
            ORDER NUMBER
          </span>

          <strong>
            #{orderNumber}
          </strong>

          <p>
            Please keep this number for your order.
          </p>

        </section>


        {/* RECEIPT */}
        <section className="customer-receipt-card">

          <div className="customer-receipt-card-header">

            <div>
              <strong>
                BIGBREW
              </strong>

              <span>
                Putatan, Muntinlupa City
              </span>
            </div>

            <span className="customer-receipt-paid-label">
              {paymentStatus === "PAID"
                ? "PAID"
                : "PENDING"}
            </span>

          </div>


          <div className="customer-receipt-meta">

            <div>
              <span>
                Customer
              </span>

              <strong>
                {customerName}
              </strong>
            </div>

            <div>
              <span>
                Date
              </span>

              <strong>
                {formattedDate}
              </strong>
            </div>

            <div>
              <span>
                Time
              </span>

              <strong>
                {formattedTime}
              </strong>
            </div>

            <div>
              <span>
                Payment
              </span>

              <strong>
                {paymentMethod}
              </strong>
            </div>

          </div>


          {/* ITEMS */}
          <div className="customer-receipt-items">

            <div className="customer-receipt-items-title">
              Order Items
            </div>

            {cart.map((item, index) => {

              const quantity =
                Number(item.quantity || 1);

              const price =
                Number(item.price || 0);

              const itemTotal =
                price * quantity;

              return (
                <div
                  className="customer-receipt-item"
                  key={
                    item.id ||
                    `${item.name}-${index}`
                  }
                >

                  <div className="customer-receipt-item-info">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.size
                        ? `${item.size} • `
                        : ""}
                      {item.sugar
                        ? `Sugar ${item.sugar}`
                        : ""}
                    </span>

                    {item.addOns &&
                      item.addOns.length > 0 && (
                        <small>
                          Add-ons:{" "}
                          {Array.isArray(item.addOns)
                            ? item.addOns.join(", ")
                            : item.addOns}
                        </small>
                      )}

                  </div>

                  <div className="customer-receipt-item-price">

                    <span>
                      ×{quantity}
                    </span>

                    <strong>
                      ₱{itemTotal.toFixed(2)}
                    </strong>

                  </div>

                </div>
              );
            })}

          </div>


          {/* TOTAL */}
          <div className="customer-receipt-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₱{total.toFixed(2)}
            </strong>

          </div>


          {/* FOOTER */}
          <div className="customer-receipt-card-footer">

            <span>
              Thank you for choosing BigBrew!
            </span>

            <small>
              Please show your order number
              when claiming your order.
            </small>

          </div>

        </section>


        {/* STATUS PREVIEW */}
        <section className="customer-receipt-status">

          <div className="customer-receipt-status-icon">
            ⏱
          </div>

          <div>

            <strong>
              Your order is being processed
            </strong>

            <span>
              You can track your order status
              after viewing your receipt.
            </span>

          </div>

        </section>


        {/* ACTION */}
        <button
          type="button"
          className="customer-receipt-status-button"
          onClick={onViewOrderStatus}
        >
          Track My Order
          <span>
            →
          </span>
        </button>


        <p className="customer-receipt-note">
          Keep your order number handy when
          claiming your drink.
        </p>

      </main>

    </div>
  );
}

export default CustomerReceipt;
