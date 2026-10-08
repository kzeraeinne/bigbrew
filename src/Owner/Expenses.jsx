import { useEffect, useState } from "react";
import "./Expenses.css";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com/bigbrew_api";

function Expenses() {
  const [category, setCategory] = useState("Utilities");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   * =========================================================
   * GET CURRENT USER ID
   * =========================================================
   */

  const getCurrentUserId = () => {
    try {
      const storedUser = localStorage.getItem("bigbrew_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        return (
          user?.user_id ??
          user?.id ??
          user?.userId ??
          null
        );
      }
    } catch (error) {
      console.error("Unable to read bigbrew_user:", error);
    }

    return null;
  };

  /*
   * =========================================================
   * FORMAT EXPENSES FROM API
   * =========================================================
   */

  const mapExpense = (expense) => {
    return {
      id: expense.expense_id,
      expenseCode: expense.expense_code,
      category: expense.category,
      description: expense.description || "",
      amount: Number(expense.amount || 0),
      paymentMethod: expense.payment_method,
      date: expense.expense_date,
      recordedBy: expense.recorded_by,
      recordedByName: expense.recorded_by_name || "",
    };
  };

  /*
   * =========================================================
   * LOAD EXPENSES FROM MYSQL
   * =========================================================
   */

  const loadExpenses = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/Api/Expenses/List.php`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load expenses."
        );
      }

      const apiExpenses = result.data?.expenses || [];

      setExpenses(apiExpenses.map(mapExpense));

    } catch (error) {
      console.error("Expense loading error:", error);

      alert(
        "Unable to load expenses from the database.\n\n" +
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * LOAD WHEN PAGE OPENS
   * =========================================================
   */

  useEffect(() => {
    loadExpenses();
  }, []);

  /*
   * =========================================================
   * TOTAL EXPENSES
   * =========================================================
   */

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  /*
   * =========================================================
   * ADD EXPENSE
   * =========================================================
   */

  const addExpense = async () => {
    if (!description.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter a valid description and amount.");
      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const currentUserId = getCurrentUserId();

      /*
       * The backend allows recorded_by to be NULL,
       * so the expense can still be saved even if
       * the current user is not stored in localStorage.
       */

      const payload = {
        category: category,
        description: description.trim(),
        amount: Number(amount),
        payment_method: paymentMethod,
        recorded_by: currentUserId,
      };

      const response = await fetch(
        `${API_BASE}/Api/Expenses/Create.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to record expense."
        );
      }

      /*
       * Add the newly created database record
       * to the React list immediately.
       */

      const createdExpense = result.data?.expense;

      if (createdExpense) {
        setExpenses((prev) => [
          mapExpense(createdExpense),
          ...prev,
        ]);
      } else {
        /*
         * Fallback: reload everything from MySQL.
         */
        await loadExpenses();
      }

      /*
       * Clear form after successful save.
       */

      setDescription("");
      setAmount("");

      alert("Expense recorded successfully.");

    } catch (error) {
      console.error("Add expense error:", error);

      alert(
        "Unable to record expense.\n\n" +
        error.message
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="expenses-page">

      {/* PAGE HEADER */}
      <div className="expenses-header">
        <div>
          <div className="expenses-eyebrow">OPERATING COSTS</div>

          <h1>Operating Expenses</h1>

          <p>
            Track branch operating costs separately from customer sales.
          </p>
        </div>

        <div className="expenses-total-badge">
          <span>Total Expenses</span>

          <strong>
            ₱
            {totalExpenses.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
      </div>

      {/* CONTENT */}
      <div className="expenses-grid">

        {/* ADD EXPENSE */}
        <section className="expense-card">

          <div className="card-label">NEW EXPENSE</div>

          <h2>Record an expense</h2>

          <div className="expense-form">

            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Utilities</option>
                <option>Supplies</option>
                <option>Transportation</option>
                <option>Maintenance</option>
                <option>Rent</option>
                <option>Communication</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                placeholder="Expense description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="expense-row">

              <div className="form-group">
                <label>Amount</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₱0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>GCash</option>
                  <option>Maya</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

            </div>

            <button
              className="add-expense-btn"
              onClick={addExpense}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Expense"}
            </button>

          </div>
        </section>

        {/* SUMMARY */}
        <section className="expense-card summary-card">

          <div className="card-label">SUMMARY</div>

          <h2>Expense overview</h2>

          <div className="expense-total">
            ₱
            {totalExpenses.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </div>

          <p className="expense-total-label">
            Total recorded operating expenses
          </p>

          {loading ? (
            <div className="expense-empty">

              <div className="empty-icon">₱</div>

              <h3>Loading expenses...</h3>

              <p>
                Retrieving records from the database.
              </p>

            </div>
          ) : expenses.length === 0 ? (
            <div className="expense-empty">

              <div className="empty-icon">₱</div>

              <h3>No expenses recorded</h3>

              <p>
                Records will appear here as activity is recorded.
              </p>

            </div>
          ) : (
            <div className="expense-count">
              {expenses.length} expense
              {expenses.length !== 1 ? "s" : ""} recorded
            </div>
          )}

        </section>

      </div>

      {/* EXPENSE HISTORY */}
      <section className="expense-card history-card">

        <div className="history-header">

          <div>
            <div className="card-label">EXPENSE HISTORY</div>
            <h2>Recorded expenses</h2>
          </div>

          <span className="history-count">
            {expenses.length} RECORD
            {expenses.length !== 1 ? "S" : ""}
          </span>

        </div>

        {loading ? (
          <div className="history-empty">
            Loading expense transactions...
          </div>
        ) : expenses.length === 0 ? (
          <div className="history-empty">
            No expense transactions yet.
          </div>
        ) : (
          <div className="expense-table-wrapper">

            <table className="expense-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Payment</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>

                {expenses.map((expense) => (

                  <tr key={expense.id}>

                    <td>
                      {expense.date}
                    </td>

                    <td>
                      {expense.category}
                    </td>

                    <td>
                      {expense.description}
                    </td>

                    <td>
                      {expense.paymentMethod}
                    </td>

                    <td>
                      ₱
                      {Number(expense.amount).toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
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

export default Expenses;