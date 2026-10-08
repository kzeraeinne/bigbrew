import React from "react";
import "./CustomerOrderStatus.css";

function CustomerOrderStatus({
  orderData,
  onBackToMenu,
}) {
  const orderNumber =
    orderData?.orderNumber || "00127";

  const customerName =
    orderData?.customerName || "Guest";

  const orderStatus =
    orderData?.orderStatus || "PREPARING";

  const total =
    Number(orderData?.total || 0);

  const cart =
    orderData?.cart || [];

  const paymentMethod =
    orderData?.paymentMethod || "Cash";

  const normalizedStatus =
    String(orderStatus).toUpperCase();

  const isPreparing =
    normalizedStatus === "PREPARING";

  const isReady =
    normalizedStatus === "READY";

  const isReleased =
    normalizedStatus === "RELEASED";

  function getCurrentStep() {
    if (isReleased) {
      return 3;
    }

    if (isReady) {
      return 2;
    }

    return 1;
  }

  const currentStep =
    getCurrentStep();

  return (
    <div className="customer-order-status-page">

      {/* HEADER */}
      <header className="customer-order-status-header">

        <div className="customer-order-status-brand">

          <span className="customer-order-status-brand-name">
            BIGBREW
          </span>

          <span className="customer-order-status-brand-subtitle">
            Order Tracking
          </span>

        </div>

      </header>


      {/* CONTENT */}
      <main className="customer-order-status-content">

        {/* TITLE */}
        <section className="customer-order-status-title">

          <span className="customer-order-status-label">
            ORDER STATUS
          </span>

          <h1>
            Track Your Order
          </h1>

          <p>
            Hi {customerName}! Here's the
            current status of your order.
          </p>

        </section>


        {/* ORDER NUMBER */}
        <section className="customer-order-number-card">

          <div>

            <span>
              ORDER NUMBER
            </span>

            <strong>
              #{orderNumber}
            </strong>

          </div>

          <div className="customer-order-number-total">

            <span>
              Total
            </span>

            <strong>
              ₱{total.toFixed(2)}
            </strong>

          </div>

        </section>


        {/* CURRENT STATUS */}
        <section
          className={`customer-current-status ${
            isReleased
              ? "released"
              : isReady
                ? "ready"
                : "preparing"
          }`}
        >

          <div className="customer-current-status-icon">

            {isReleased
              ? "✓"
              : isReady
                ? "✓"
                : "⏱"}

          </div>

          <div className="customer-current-status-text">

            <span>
              CURRENT STATUS
            </span>

            <strong>
              {isReleased
                ? "Order Released"
                : isReady
                  ? "Ready for Release"
                  : "Preparing Your Order"}
            </strong>

            <p>
              {isReleased
                ? "Your order has been released. Thank you for choosing BigBrew!"
                : isReady
                  ? "Your order is ready! Please proceed to the counter and show your order number."
                  : "Our barista is preparing your drinks. Please wait for the order to be ready."}
            </p>

          </div>

        </section>


        {/* PROGRESS */}
        <section className="customer-order-progress-card">

          <div className="customer-order-progress-heading">

            <h2>
              Order Progress
            </h2>

            <span>
              {currentStep} of 3
            </span>

          </div>


          <div className="customer-order-progress">

            {/* STEP 1 */}
            <div
              className={`customer-progress-step ${
                currentStep >= 1
                  ? "completed"
                  : ""
              }`}
            >

              <div className="customer-progress-icon">
                {currentStep > 1
                  ? "✓"
                  : "1"}
              </div>

              <div className="customer-progress-text">

                <strong>
                  Order Received
                </strong>

                <span>
                  Your order has been received.
                </span>

              </div>

            </div>


            <div
              className={`customer-progress-line ${
                currentStep >= 2
                  ? "completed"
                  : ""
              }`}
            />


            {/* STEP 2 */}
            <div
              className={`customer-progress-step ${
                currentStep >= 2
                  ? "completed"
                  : ""
              }`}
            >

              <div className="customer-progress-icon">
                {currentStep > 2
                  ? "✓"
                  : "2"}
              </div>

              <div className="customer-progress-text">

                <strong>
                  Preparing
                </strong>

                <span>
                  Your drinks are being prepared.
                </span>

              </div>

            </div>


            <div
              className={`customer-progress-line ${
                currentStep >= 3
                  ? "completed"
                  : ""
              }`}
            />


            {/* STEP 3 */}
            <div
              className={`customer-progress-step ${
                currentStep >= 3
                  ? "completed"
                  : ""
              }`}
            >

              <div className="customer-progress-icon">
                {currentStep >= 3
                  ? "✓"
                  : "3"}
              </div>

              <div className="customer-progress-text">

                <strong>
                  Ready for Release
                </strong>

                <span>
                  Pick up your order at the counter.
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* READY MESSAGE */}
        {isReady && (

          <section className="customer-ready-card">

            <div className="customer-ready-icon">
              ✓
            </div>

            <div>

              <strong>
                Your order is ready!
              </strong>

              <span>
                Please show this screen or your
                order number to the cashier.
              </span>

            </div>

          </section>

        )}


        {/* RELEASED MESSAGE */}
        {isReleased && (

          <section className="customer-released-card">

            <div className="customer-released-icon">
              ✓
            </div>

            <div>

              <strong>
                Order Released
              </strong>

              <span>
                Your order has been successfully
                released. Enjoy your BigBrew!
              </span>

            </div>

          </section>

        )}


        {/* ORDER DETAILS */}
        <section className="customer-order-details">

          <div className="customer-order-details-heading">

            <h2>
              Order Details
            </h2>

            <span>
              {cart.length} item
              {cart.length !== 1
                ? "s"
                : ""}
            </span>

          </div>


          <div className="customer-order-items">

            {cart.map((item, index) => {

              const quantity =
                Number(item.quantity || 1);

              const price =
                Number(item.price || 0);

              return (
                <div
                  className="customer-order-item"
                  key={
                    item.id ||
                    `${item.name}-${index}`
                  }
                >

                  <div>

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

                      {" "}×{quantity}
                    </span>

                  </div>

                  <strong>
                    ₱{(
                      price * quantity
                    ).toFixed(2)}
                  </strong>

                </div>
              );

            })}

          </div>


          <div className="customer-order-details-total">

            <span>
              Payment
            </span>

            <strong>
              {paymentMethod}
            </strong>

          </div>

          <div className="customer-order-details-total">

            <span>
              Total
            </span>

            <strong>
              ₱{total.toFixed(2)}
            </strong>

          </div>

        </section>


        {/* RETURN BUTTON */}
        {isReleased && (

          <button
            type="button"
            className="customer-order-menu-button"
            onClick={onBackToMenu}
          >
            Back to Menu
          </button>

        )}


        <p className="customer-order-status-note">
          Order status will automatically update
          when the cashier or barista processes
          your order.
        </p>

      </main>

    </div>
  );
}

export default CustomerOrderStatus;
