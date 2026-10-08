import React, { useState } from "react";
import "./CustomerPayment.css";

function CustomerPayment({
  checkoutData,
  onBack,
  onPaymentComplete,
}) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const customerName = checkoutData?.customerName || "";
  const cart = checkoutData?.cart || [];
  const total = Number(checkoutData?.total || 0);

  async function handleProceedPayment() {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!customerName.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        "https://kzeraeinne.infinityfreeapp.com/create_order.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: customerName.trim(),
            cart,
            total,
            paymentMethod,
          }),
        }
      );

      const result = await response.json();

      console.log("CREATE ORDER RESPONSE:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create order."
        );
      }

      /*
        IMPORTANT:

        The order is now saved in MySQL.

        Cash:
        - paymentStatus = PENDING
        - cashier will collect payment

        GCash / Maya:
        - paymentStatus = PENDING
        - actual payment verification will happen
          through the payment integration later

        We DO NOT fake a PAID status here.
      */

      const paymentData = {
        customerName,
        cart,
        total: Number(result.total || total),
        paymentMethod,
        paymentStatus: result.paymentStatus,
        orderStatus: result.orderStatus,
        orderNumber: result.orderNumber,
        orderId: result.orderId,
        orderDate:
          result.orderDate || new Date().toISOString(),
      };

      setIsProcessing(false);

      if (onPaymentComplete) {
        onPaymentComplete(paymentData);
      }
    } catch (error) {
      console.error("Order submission error:", error);

      setIsProcessing(false);

      alert(
        error.message ||
          "Unable to submit your order. Please try again."
      );
    }
  }

  return (
    <div className="customer-payment-page">

      {/* HEADER */}
      <header className="customer-payment-header">

        <button
          type="button"
          className="customer-payment-back"
          onClick={onBack}
          disabled={isProcessing}
        >
          ←
        </button>

        <div className="customer-payment-brand">
          <span className="customer-payment-brand-name">
            BIGBREW
          </span>

          <span className="customer-payment-brand-subtitle">
            Secure Checkout
          </span>
        </div>

        <div className="customer-payment-header-spacer" />

      </header>


      {/* CONTENT */}
      <main className="customer-payment-content">

        {/* TITLE */}
        <section className="customer-payment-title">

          <span className="customer-payment-step">
            STEP 2 OF 3
          </span>

          <h1>
            Payment
          </h1>

          <p>
            Choose how you would like to pay
            for your BigBrew order.
          </p>

        </section>


        {/* ORDER TOTAL */}
        <section className="customer-payment-total-card">

          <div>
            <span>
              Customer
            </span>

            <strong>
              {customerName || "Guest"}
            </strong>
          </div>

          <div className="customer-payment-total">

            <span>
              Total
            </span>

            <strong>
              ₱{total.toFixed(2)}
            </strong>

          </div>

        </section>


        {/* PAYMENT METHODS */}
        <section className="customer-payment-section">

          <div className="customer-payment-section-heading">

            <h2>
              Select Payment Method
            </h2>

            <p>
              Choose one payment method below.
            </p>

          </div>


          <div className="customer-payment-methods">

            {/* CASH */}
            <button
              type="button"
              className={`customer-payment-method ${
                paymentMethod === "Cash"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setPaymentMethod("Cash")
              }
              disabled={isProcessing}
            >

              <div className="customer-payment-method-icon">
                ₱
              </div>

              <div className="customer-payment-method-content">

                <strong>
                  Cash
                </strong>

                <span>
                  Pay at the cashier
                </span>

              </div>

              <div className="customer-payment-radio">
                {paymentMethod === "Cash"
                  ? "✓"
                  : ""}
              </div>

            </button>


            {/* GCASH */}
            <button
              type="button"
              className={`customer-payment-method ${
                paymentMethod === "GCash"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setPaymentMethod("GCash")
              }
              disabled={isProcessing}
            >

              <div className="customer-payment-method-icon gcash">
                G
              </div>

              <div className="customer-payment-method-content">

                <strong>
                  GCash
                </strong>

                <span>
                  Pay using GCash
                </span>

              </div>

              <div className="customer-payment-radio">
                {paymentMethod === "GCash"
                  ? "✓"
                  : ""}
              </div>

            </button>


            {/* MAYA */}
            <button
              type="button"
              className={`customer-payment-method ${
                paymentMethod === "Maya"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setPaymentMethod("Maya")
              }
              disabled={isProcessing}
            >

              <div className="customer-payment-method-icon maya">
                M
              </div>

              <div className="customer-payment-method-content">

                <strong>
                  Maya
                </strong>

                <span>
                  Pay using Maya
                </span>

              </div>

              <div className="customer-payment-radio">
                {paymentMethod === "Maya"
                  ? "✓"
                  : ""}
              </div>

            </button>

          </div>

        </section>


        {/* SELECTED PAYMENT INFO */}
        {paymentMethod && (
          <section className="customer-payment-info">

            <div className="customer-payment-info-icon">
              ✓
            </div>

            <div>

              <strong>
                {paymentMethod} selected
              </strong>

              <span>
                {paymentMethod === "Cash"
                  ? "You will pay at the cashier when your order is processed."
                  : `Your ${paymentMethod} payment will remain pending until payment verification is completed.`}
              </span>

            </div>

          </section>
        )}


        {/* ORDER DETAILS */}
        <section className="customer-payment-order">

          <div className="customer-payment-order-heading">

            <h2>
              Order Summary
            </h2>

            <span>
              {cart.length} item
              {cart.length !== 1 ? "s" : ""}
            </span>

          </div>


          <div className="customer-payment-order-items">

            {cart.map((item, index) => {

              const quantity =
                Number(item.quantity || 1);

              /*
                IMPORTANT:
                CustomerMenu uses unitPrice,
                not price.
              */

              const unitPrice =
                Number(item.unitPrice || 0);

              const itemTotal =
                Number(
                  item.total ||
                  unitPrice * quantity
                );

              return (
                <div
                  className="customer-payment-order-item"
                  key={
                    item.id ||
                    `${item.product}-${index}`
                  }
                >

                  <div>

                    <strong>
                      {item.product || "Product"}
                    </strong>

                    <span>

                      {item.size
                        ? `${item.size} • `
                        : ""}

                      {item.sugar
                        ? `${item.sugar} • `
                        : ""}

                      ×{quantity}

                    </span>

                    {/* ADD-ONS */}
                    {Array.isArray(item.addons) &&
                      item.addons.length > 0 && (
                        <small>
                          {item.addons
                            .map((addon) =>
                              addon.name
                            )
                            .join(", ")}
                        </small>
                      )}

                  </div>


                  <strong>
                    ₱{itemTotal.toFixed(2)}
                  </strong>

                </div>
              );
            })}

          </div>


          <div className="customer-payment-final-total">

            <span>
              Amount to Pay
            </span>

            <strong>
              ₱{total.toFixed(2)}
            </strong>

          </div>

        </section>


        {/* ACTIONS */}
        <div className="customer-payment-actions">

          <button
            type="button"
            className="customer-payment-secondary-button"
            onClick={onBack}
            disabled={isProcessing}
          >
            ← Back
          </button>


          <button
            type="button"
            className="customer-payment-primary-button"
            onClick={handleProceedPayment}
            disabled={
              !paymentMethod ||
              isProcessing ||
              !cart.length
            }
          >

            {isProcessing ? (
              <>
                Processing...
              </>
            ) : (
              <>
                Proceed Payment
                <span>→</span>
              </>
            )}

          </button>

        </div>


        <p className="customer-payment-note">
          Your order will be saved to the BigBrew
          database after you proceed.
        </p>

      </main>

    </div>
  );
}

export default CustomerPayment;
