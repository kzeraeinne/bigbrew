import React, { useMemo, useState } from "react";
import "./CustomerCheckout.css";

function CustomerCheckout({
  cart = [],
  onBack,
  onProceedToPayment,
}) {
  const [customerName, setCustomerName] = useState("");

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      return (
        sum +
        Number(item.total || 0)
      );
    }, 0);
  }, [cart]);

  function handleProceed() {
    const trimmedName =
      customerName.trim();

    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    if (cart.length === 0) {
      alert("Your order is empty.");
      return;
    }

    const checkoutData = {
      customerName:
        trimmedName,

      cart,

      total,
    };

    if (onProceedToPayment) {
      onProceedToPayment(
        checkoutData
      );
    }
  }

  return (
    <div className="customer-checkout-page">

      {/* HEADER */}

      <header className="customer-checkout-header">

        <button
          type="button"
          className="customer-checkout-back"
          onClick={onBack}
        >
          ←
        </button>

        <div className="customer-checkout-brand">

          <span className="customer-checkout-brand-name">
            BIGBREW
          </span>

          <span className="customer-checkout-brand-subtitle">
            Customer Ordering
          </span>

        </div>

        <div className="customer-checkout-header-spacer" />

      </header>


      <main className="customer-checkout-content">

        {/* TITLE */}

        <div className="customer-checkout-title-section">

          <span className="customer-checkout-step">
            STEP 1 OF 3
          </span>

          <h1>
            Review Your Order
          </h1>

          <p>
            Enter your name and review your
            order before proceeding to payment.
          </p>

        </div>


        {/* CUSTOMER INFORMATION */}

        <section className="customer-checkout-section">

          <div className="customer-checkout-section-title">

            <span className="customer-checkout-section-number">
              1
            </span>

            <div>
              <h2>
                Customer Information
              </h2>

              <p>
                What name should we use
                for your order?
              </p>
            </div>

          </div>


          <label
            className="customer-checkout-label"
            htmlFor="customer-name"
          >
            Customer Name
          </label>

          <input
            id="customer-name"
            type="text"
            className="customer-checkout-name-input"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            maxLength={50}
          />

          <span className="customer-checkout-input-hint">
            This name will appear on your
            order and e-receipt.
          </span>

        </section>


        {/* ORDER SUMMARY */}

        <section className="customer-checkout-section">

          <div className="customer-checkout-section-title">

            <span className="customer-checkout-section-number">
              2
            </span>

            <div>
              <h2>
                Order Summary
              </h2>

              <p>
                Check your selected items.
              </p>
            </div>

          </div>


          {cart.length === 0 ? (

            <div className="customer-checkout-empty">

              <div className="customer-checkout-empty-icon">
                🛒
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Add something from the
                menu first.
              </p>

            </div>

          ) : (

            <div className="customer-checkout-items">

              {cart.map(
                (item, index) => {

                  const quantity =
                    Number(
                      item.quantity || 1
                    );

                  const itemPrice =
                    Number(
                      item.unitPrice || 0
                    );

                  const itemTotal =
                    Number(
                      item.total ||
                      itemPrice * quantity
                    );

                  return (

                    <div
                      className="customer-checkout-item"
                      key={
                        item.id ||
                        `${item.product}-${index}`
                      }
                    >

                      <div className="customer-checkout-item-main">

                        <div className="customer-checkout-item-name">
                          {item.product}
                        </div>

                        <div className="customer-checkout-item-details">

                          {item.size && (
                            <span>
                              {item.size === "large"
                                ? "Large"
                                : "Small"}
                            </span>
                          )}

                          {item.sugar && (
                            <span>
                              Sugar {item.sugar}
                            </span>
                          )}

                          {item.addons &&
                            item.addons.length >
                              0 && (

                              <span>
                                +
                                {Array.isArray(
                                  item.addons
                                )
                                  ? item.addons
                                      .map(
                                        (addon) =>
                                          typeof addon ===
                                          "string"
                                            ? addon
                                            : addon.name
                                      )
                                      .join(
                                        ", "
                                      )
                                  : item.addons}
                              </span>

                            )}

                        </div>

                      </div>


                      <div className="customer-checkout-item-right">

                        <span className="customer-checkout-quantity">
                          ×{quantity}
                        </span>

                        <strong>
                          ₱
                          {itemTotal.toFixed(
                            2
                          )}
                        </strong>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}


          {/* TOTAL */}

          <div className="customer-checkout-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₱{total.toFixed(2)}
            </strong>

          </div>

        </section>


        {/* PAYMENT */}

        <section className="customer-checkout-section">

          <div className="customer-checkout-section-title">

            <span className="customer-checkout-section-number">
              3
            </span>

            <div>

              <h2>
                Payment
              </h2>

              <p>
                Select your payment method
                on the next step.
              </p>

            </div>

          </div>


          <div className="customer-checkout-payment-preview">

            <div className="customer-checkout-payment-icon">
              ₱
            </div>

            <div>

              <strong>
                Payment Method
              </strong>

              <span>
                You will choose your payment
                method after reviewing your order.
              </span>

            </div>

          </div>

        </section>


        {/* ACTIONS */}

        <div className="customer-checkout-actions">

          <button
            type="button"
            className="customer-checkout-secondary-button"
            onClick={onBack}
          >
            ← Back to Menu
          </button>


          <button
            type="button"
            className="customer-checkout-primary-button"
            onClick={handleProceed}
            disabled={
              cart.length === 0 ||
              !customerName.trim()
            }
          >

            Proceed to Payment

            <span>
              →
            </span>

          </button>

        </div>


        <p className="customer-checkout-security-note">
          Your order information will be used only
          for processing your BigBrew order.
        </p>

      </main>

    </div>
  );
}

export default CustomerCheckout;
