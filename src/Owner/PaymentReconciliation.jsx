import { useState } from "react";
import "./PaymentReconciliation.css";

const INITIAL_RECORDS = [];

function PaymentReconciliation() {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [actualTotal, setActualTotal] = useState("");
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [message, setMessage] = useState("");

  const systemTotal = 0;
  const actual = Number(actualTotal) || 0;
  const variance = actual - systemTotal;

  function formatPeso(value) {
    return `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function getStatus(value) {
    if (value === 0) return "MATCHED";
    if (value > 0) return "OVER";
    return "SHORT";
  }

  function handleRecordComparison(event) {
    event.preventDefault();

    if (actualTotal === "") {
      setMessage("Please enter the actual collection.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-PH"),
      method: paymentMethod,
      systemTotal,
      actualTotal: actual,
      variance,
      status: getStatus(variance),
    };

    setRecords((current) => [newRecord, ...current]);
    setActualTotal("");
    setMessage("Payment comparison recorded successfully.");
  }

  return (
    <div className="payment-reconciliation-page">

      {/* PAGE HEADER */}
      <div className="payment-page-header">
        <div>
          <div className="payment-eyebrow">
            PAYMENT CONTROLS
          </div>

          <h2>Payment Reconciliation</h2>

          <p>
            Compare actual collections to recorded payments and keep
            payment variances visible.
          </p>
        </div>

        <div className="payment-summary-badge">
          {records.length} {records.length === 1 ? "REVIEW" : "REVIEWS"}
        </div>
      </div>

      {/* NEW REVIEW */}
      <section className="payment-card">

        <div className="payment-card-header">
          <div>
            <div className="payment-eyebrow">
              NEW REVIEW
            </div>

            <h3>Compare collections</h3>
          </div>
        </div>

        <form
          className="payment-form"
          onSubmit={handleRecordComparison}
        >

          <div className="payment-field">
            <label htmlFor="payment-method">
              Payment method
            </label>

            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value)
              }
            >
              <option value="CASH">Cash</option>
              <option value="GCASH">GCash</option>
              <option value="MAYA">Maya</option>
              <option value="QRPH">QRPh</option>
            </select>
          </div>

          <div className="payment-system-total">
            <span>System total</span>

            <strong>
              {formatPeso(systemTotal)}
            </strong>
          </div>

          <div className="payment-field">
            <label htmlFor="actual-total">
              Actual total
            </label>

            <input
              id="actual-total"
              type="number"
              min="0"
              step="0.01"
              value={actualTotal}
              onChange={(event) =>
                setActualTotal(event.target.value)
              }
              placeholder="0.00"
            />
          </div>

          <button
            type="submit"
            className="payment-primary-button"
          >
            Record comparison
          </button>

        </form>

        {actualTotal !== "" && (
          <div className="payment-preview">
            <div>
              <span>Variance</span>
              <strong
                className={
                  variance === 0
                    ? "variance-match"
                    : variance > 0
                    ? "variance-over"
                    : "variance-short"
                }
              >
                {formatPeso(variance)}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong
                className={
                  variance === 0
                    ? "status-match"
                    : variance > 0
                    ? "status-over"
                    : "status-short"
                }
              >
                {getStatus(variance)}
              </strong>
            </div>
          </div>
        )}

        {message && (
          <div className="payment-message">
            {message}
          </div>
        )}

      </section>

      {/* HISTORY */}
      <section className="payment-card">

        <div className="payment-card-header">
          <div>
            <div className="payment-eyebrow">
              REVIEW HISTORY
            </div>

            <h3>Payment comparisons</h3>
          </div>

          <span className="payment-count">
            {records.length} {records.length === 1 ? "EVENT" : "EVENTS"}
          </span>
        </div>

        {records.length === 0 ? (

          <div className="payment-empty">

            <div className="payment-empty-icon">
              ₱
            </div>

            <strong>
              No comparisons recorded
            </strong>

            <span>
              Record a collection count to compare payments.
            </span>

          </div>

        ) : (

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Method</th>
                  <th>System total</th>
                  <th>Actual total</th>
                  <th>Variance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {records.map((record) => (
                  <tr key={record.id}>

                    <td>{record.date}</td>

                    <td>
                      <span className="method-badge">
                        {record.method}
                      </span>
                    </td>

                    <td>
                      {formatPeso(record.systemTotal)}
                    </td>

                    <td>
                      {formatPeso(record.actualTotal)}
                    </td>

                    <td
                      className={
                        record.variance === 0
                          ? "variance-match"
                          : record.variance > 0
                          ? "variance-over"
                          : "variance-short"
                      }
                    >
                      {formatPeso(record.variance)}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          record.status.toLowerCase()
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="payment-view-button"
                        type="button"
                        onClick={() =>
                          alert(
                            `Payment review\n\nDate: ${record.date}\nMethod: ${record.method}\nSystem: ${formatPeso(record.systemTotal)}\nActual: ${formatPeso(record.actualTotal)}\nVariance: ${formatPeso(record.variance)}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default PaymentReconciliation;
