import { useEffect, useState } from "react";
import "./SyncStatus.css";

const API_BASE_URL = "https://kzeraeinne.infinityfreeapp.com/bigbrew_api";
const API_TEST_URL = `${API_BASE_URL}/Test.php`;

const OFFLINE_ORDERS_KEY = "bigbrew-offline-orders";

/*
|--------------------------------------------------------------------------
| CURRENT CASHIER USER
|--------------------------------------------------------------------------
|
| Same temporary cashier user used by NewSale.jsx.
| Later, replace this with the actual logged-in user's ID.
|
*/
const CURRENT_USER_ID = 2;

function SyncStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [offlineOrders, setOfflineOrders] = useState([]);

  const [backendStatus, setBackendStatus] = useState("checking");
  const [databaseStatus, setDatabaseStatus] = useState("checking");
  const [databaseName, setDatabaseName] = useState("");

  const [lastChecked, setLastChecked] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncError, setSyncError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadOfflineOrders();
    checkBackendConnection();

    const handleOnline = () => {
      setOnline(true);

      setTimeout(() => {
        checkBackendConnection();
      }, 500);
    };

    const handleOffline = () => {
      setOnline(false);

      setBackendStatus("offline");
      setDatabaseStatus("offline");
      setBackendMessage("Browser is offline.");

      setSyncMessage("");
      setSyncError("");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD LOCAL OFFLINE ORDERS
  |--------------------------------------------------------------------------
  */

  function loadOfflineOrders() {
    try {
      const saved = localStorage.getItem(
        OFFLINE_ORDERS_KEY
      );

      if (!saved) {
        setOfflineOrders([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setOfflineOrders(parsed);
      } else {
        setOfflineOrders([]);
      }
    } catch (error) {
      console.error(
        "Unable to load offline orders:",
        error
      );

      setOfflineOrders([]);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE LOCAL ORDERS
  |--------------------------------------------------------------------------
  */

  function saveLocalOrders(orders) {
    try {
      localStorage.setItem(
        OFFLINE_ORDERS_KEY,
        JSON.stringify(orders)
      );

      setOfflineOrders(orders);

      return true;
    } catch (error) {
      console.error(
        "Unable to save local offline orders:",
        error
      );

      return false;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CHECK PHP BACKEND + MYSQL
  |--------------------------------------------------------------------------
  */

  async function checkBackendConnection() {
    if (!navigator.onLine) {
      setBackendStatus("offline");
      setDatabaseStatus("offline");
      setBackendMessage("Browser is offline.");
      return;
    }

    setBackendStatus("checking");
    setDatabaseStatus("checking");
    setBackendMessage("");

    try {
      /*
       * IMPORTANT:
       * Use Test.php here.
       *
       * https://kzeraeinne.infinityfreeapp.com/bigbrew_api
       * only shows the Apache directory listing.
       *
       * Test.php actually returns the JSON connection status.
       */
      const response = await fetch(
        API_TEST_URL,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "BigBrew backend connection failed."
        );
      }

      const mysqlConnected =
        result?.data?.mysql === true;

      setBackendStatus("connected");

      setDatabaseStatus(
        mysqlConnected
          ? "connected"
          : "disconnected"
      );

      setDatabaseName(
        result?.data?.database ||
          "bigbrew_db"
      );

      setBackendMessage(
        result.message ||
          "BigBrew PHP backend is connected to MySQL."
      );

      setLastChecked(new Date());

      loadOfflineOrders();

    } catch (error) {
      console.error(
        "BigBrew backend connection error:",
        error
      );

      setBackendStatus("disconnected");
      setDatabaseStatus("disconnected");
      setDatabaseName("");

      setBackendMessage(
        error.message ||
          "Unable to connect to the BigBrew backend."
      );

      setLastChecked(new Date());
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SYNC ONE OFFLINE ORDER
  |--------------------------------------------------------------------------
  */

  async function syncSingleOrder(offlineOrder) {
    if (!offlineOrder) {
      throw new Error(
        "Invalid offline order."
      );
    }

    /*
     * Only CASH can be created while offline.
     */
    if (
      String(
        offlineOrder.payment_method || ""
      ).toUpperCase() !== "CASH"
    ) {
      throw new Error(
        "Only cash transactions can be synchronized from offline mode."
      );
    }

    /*
     * The offline order must contain
     * backend-ready order items.
     */
    if (
      !Array.isArray(offlineOrder.items) ||
      offlineOrder.items.length === 0
    ) {
      throw new Error(
        "This offline order does not contain valid order items."
      );
    }

    /*
     * Get the unique offline reference.
     */
    const offlineReference =
      String(
        offlineOrder.offline_reference ||
          offlineOrder.id ||
          ""
      ).trim();

    if (!offlineReference) {
      throw new Error(
        "Offline order is missing its offline reference."
      );
    }

    const createdBy = Number(
      offlineOrder.created_by ||
        CURRENT_USER_ID
    );

    if (!createdBy) {
      throw new Error(
        "Offline order is missing a valid user ID."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 1
    | CREATE OR FIND THE ORDER
    |--------------------------------------------------------------------------
    */

    const orderPayload = {
      customer_name:
        offlineOrder.customer_name ||
        offlineOrder.name ||
        "Walk-in Customer",

      items: offlineOrder.items,

      created_by: createdBy,

      offline_reference:
        offlineReference,
    };

    const orderResponse = await fetch(
      `${API_BASE_URL}/Api/Orders/Create.php`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body: JSON.stringify(
          orderPayload
        ),
      }
    );

    let orderData;

    try {
      orderData =
        await orderResponse.json();
    } catch {
      throw new Error(
        "The Orders API returned an invalid response."
      );
    }

    if (
      !orderResponse.ok ||
      !orderData.success
    ) {
      throw new Error(
        orderData.message ||
          "Unable to create the offline order."
      );
    }

    const orderResult =
      orderData.data || {};

    const orderId = Number(
      orderResult.order_id
    );

    if (!orderId) {
      throw new Error(
        "The server did not return a valid order ID."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 2
    | CHECK EXISTING ORDER STATUS
    |--------------------------------------------------------------------------
    */

    const existingOrderStatus =
      String(
        orderResult.order_status ||
          ""
      ).toUpperCase();

    /*
     * If this order was already completely processed,
     * don't create another payment.
     */
    if (
      existingOrderStatus ===
        "CONFIRMED" ||
      existingOrderStatus ===
        "COMPLETED"
    ) {
      return {
        success: true,
        alreadyCompleted: true,
        orderId,
        orderNumber:
          orderResult.order_number ||
          offlineOrder.number ||
          offlineReference,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 3
    | CREATE CASH PAYMENT
    |--------------------------------------------------------------------------
    */

    const paymentAmount = Number(
      offlineOrder.total ??
        offlineOrder.amount ??
        0
    );

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      throw new Error(
        "Offline order has an invalid payment amount."
      );
    }

    const paymentPayload = {
      order_id: orderId,

      payment_method: "Cash",

      amount: paymentAmount,

      transaction_reference:
        null,

      created_by: createdBy,
    };

    const paymentResponse = await fetch(
      `${API_BASE_URL}/Api/Payments/Create.php`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body: JSON.stringify(
          paymentPayload
        ),
      }
    );

    let paymentData;

    try {
      paymentData =
        await paymentResponse.json();
    } catch {
      throw new Error(
        "The Payments API returned an invalid response."
      );
    }

    if (
      !paymentResponse.ok ||
      !paymentData.success
    ) {
      throw new Error(
        paymentData.message ||
          "Unable to process the offline payment."
      );
    }

    return {
      success: true,
      alreadyCompleted: false,
      orderId,
      orderNumber:
        orderResult.order_number ||
        offlineOrder.number ||
        offlineReference,
      payment:
        paymentData.data || null,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | SYNC ALL PENDING ORDERS
  |--------------------------------------------------------------------------
  */

  async function syncPendingOrders() {
    if (syncing) {
      return;
    }

    if (!navigator.onLine) {
      alert(
        "The browser is currently offline. Connect to the backend first."
      );
      return;
    }

    if (
      backendStatus !== "connected" ||
      databaseStatus !== "connected"
    ) {
      alert(
        "The BigBrew backend and MySQL database must be connected before synchronization."
      );

      await checkBackendConnection();

      return;
    }

    /*
     * Get the freshest localStorage data.
     */
    let localOrders = [];

    try {
      const saved =
        localStorage.getItem(
          OFFLINE_ORDERS_KEY
        );

      const parsed = saved
        ? JSON.parse(saved)
        : [];

      localOrders = Array.isArray(
        parsed
      )
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Unable to read local orders:",
        error
      );

      setSyncError(
        "Unable to read the locally stored orders."
      );

      return;
    }

    if (localOrders.length === 0) {
      setSyncMessage(
        "There are no offline orders waiting for synchronization."
      );

      setSyncError("");

      return;
    }

    setSyncing(true);
    setSyncMessage("");
    setSyncError("");

    let successful = 0;
    let failed = 0;

    const remainingOrders = [];

    /*
     * Process one order at a time.
     *
     * This is safer because payment processing
     * can modify inventory.
     */
    for (
      let index = 0;
      index < localOrders.length;
      index += 1
    ) {
      const offlineOrder =
        localOrders[index];

      try {
        await syncSingleOrder(
          offlineOrder
        );

        /*
         * SUCCESS:
         * Do not add it to remainingOrders.
         *
         * This removes it from localStorage.
         */
        successful += 1;

      } catch (error) {
        console.error(
          `Unable to synchronize offline order ${
            index + 1
          }:`,
          error
        );

        /*
         * FAILURE:
         * Keep the order locally.
         */
        failed += 1;

        remainingOrders.push(
          offlineOrder
        );
      }
    }

    /*
     * Save only failed orders.
     */
    saveLocalOrders(
      remainingOrders
    );

    setSyncing(false);

    /*
    |--------------------------------------------------------------------------
    | DISPLAY RESULT
    |--------------------------------------------------------------------------
    */

    if (
      successful > 0 &&
      failed === 0
    ) {
      setSyncMessage(
        `${successful} offline ${
          successful === 1
            ? "order was"
            : "orders were"
        } successfully synchronized with the BigBrew backend.`
      );

      setSyncError("");

    } else if (
      successful > 0 &&
      failed > 0
    ) {
      setSyncMessage(
        `${successful} ${
          successful === 1
            ? "order was"
            : "orders were"
        } synchronized successfully.`
      );

      setSyncError(
        `${failed} ${
          failed === 1
            ? "order remains"
            : "orders remain"
        } pending because synchronization failed.`
      );

    } else {
      setSyncMessage("");

      setSyncError(
        "No offline orders were synchronized. The pending records were kept locally."
      );
    }

    await checkBackendConnection();
  }

  /*
  |--------------------------------------------------------------------------
  | CLEAR LOCAL RECORDS
  |--------------------------------------------------------------------------
  */

  function clearOfflineRecords() {
    const confirmed =
      window.confirm(
        "Clear locally stored offline records? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      OFFLINE_ORDERS_KEY
    );

    setOfflineOrders([]);

    setSyncMessage(
      "Local offline records were cleared."
    );

    setSyncError("");
  }

  /*
  |--------------------------------------------------------------------------
  | STATUS LABELS
  |--------------------------------------------------------------------------
  */

  function getBackendLabel() {
    if (
      backendStatus === "checking"
    ) {
      return "Checking...";
    }

    if (
      backendStatus === "connected"
    ) {
      return "Connected";
    }

    if (
      backendStatus === "offline"
    ) {
      return "Offline";
    }

    return "Not connected";
  }

  function getDatabaseLabel() {
    if (
      databaseStatus === "checking"
    ) {
      return "Checking...";
    }

    if (
      databaseStatus === "connected"
    ) {
      return "Connected";
    }

    if (
      databaseStatus === "offline"
    ) {
      return "Offline";
    }

    return "Not connected";
  }

  const fullyConnected =
    backendStatus ===
      "connected" &&
    databaseStatus ===
      "connected";

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="sync-page">

      {/* PAGE HEADER */}
      <div className="sync-page-header">

        <div>

          <div className="sync-eyebrow">
            CONNECTION STATUS
          </div>

          <h1>
            Offline POS / Sync Status
          </h1>

          <p>
            Cash sales can be saved locally during
            interruptions. Backend synchronization uses
            the BigBrew PHP API and MySQL database.
          </p>

        </div>

        <div
          className={`sync-status-badge ${
            online
              ? "is-online"
              : "is-offline"
          }`}
        >

          <span className="sync-status-dot"></span>

          {online
            ? "BROWSER ONLINE"
            : "OFFLINE — PENDING SYNC"}

        </div>

      </div>


      {/* STATUS CARDS */}
      <div className="sync-metrics">

        {/* BROWSER CONNECTION */}
        <div className="sync-metric-card">

          <span className="sync-metric-label">
            Browser connection
          </span>

          <strong>
            {online
              ? "Online"
              : "Offline"}
          </strong>

          <small>
            Current browser connection
          </small>

        </div>


        {/* PHP BACKEND */}
        <div className="sync-metric-card">

          <span className="sync-metric-label">
            PHP backend
          </span>

          <strong
            className={
              backendStatus ===
              "connected"
                ? "connected"
                : backendStatus ===
                  "checking"
                ? "checking"
                : "not-connected"
            }
          >
            {getBackendLabel()}
          </strong>

          <small>
            BigBrew PHP API
          </small>

        </div>


        {/* MYSQL DATABASE */}
        <div className="sync-metric-card">

          <span className="sync-metric-label">
            MySQL database
          </span>

          <strong
            className={
              databaseStatus ===
              "connected"
                ? "connected"
                : databaseStatus ===
                  "checking"
                ? "checking"
                : "not-connected"
            }
          >
            {getDatabaseLabel()}
          </strong>

          <small>
            {databaseName ||
              "bigbrew_db"}
          </small>

        </div>

      </div>


      {/* CONNECTION STATUS */}
      <div
        className={
          fullyConnected
            ? "sync-success"
            : "sync-warning"
        }
      >

        <div className="sync-warning-icon">
          {fullyConnected
            ? "✓"
            : "!"}
        </div>

        <div>

          <strong>
            {fullyConnected
              ? "BigBrew backend is connected."
              : "Backend connection requires attention."}
          </strong>

          <p>
            {fullyConnected
              ? "The React application can reach the PHP backend, and the PHP backend confirms that MySQL is connected to bigbrew_db."
              : backendMessage ||
                "The system could not confirm the PHP backend and MySQL connection."}
          </p>

          {lastChecked && (
            <small>
              Last checked:{" "}
              {lastChecked.toLocaleString()}
            </small>
          )}

        </div>

      </div>


      {/* SYNC ACTIONS */}
      <div className="sync-actions">

        <button
          type="button"
          className="sync-refresh-button"
          onClick={
            checkBackendConnection
          }
          disabled={
            backendStatus ===
              "checking" ||
            syncing
          }
        >
          {backendStatus ===
          "checking"
            ? "Checking..."
            : "Refresh Connection"}
        </button>


        <button
          type="button"
          className="sync-refresh-button"
          onClick={
            syncPendingOrders
          }
          disabled={
            syncing ||
            offlineOrders.length ===
              0 ||
            !fullyConnected
          }
        >
          {syncing
            ? "Synchronizing..."
            : `Sync Pending Orders${
                offlineOrders.length > 0
                  ? ` (${offlineOrders.length})`
                  : ""
              }`}
        </button>

      </div>


      {/* SYNC RESULT */}
      {(syncMessage ||
        syncError) && (

        <div
          className={
            syncError
              ? "sync-warning"
              : "sync-success"
          }
        >

          <div className="sync-warning-icon">
            {syncError
              ? "!"
              : "✓"}
          </div>

          <div>

            <strong>
              {syncError
                ? "Synchronization requires attention."
                : "Synchronization complete."}
            </strong>

            <p>
              {syncError ||
                syncMessage}
            </p>

          </div>

        </div>

      )}


      {/* LOCAL TRANSACTIONS */}
      <section className="sync-transactions-panel">

        <div className="sync-section-header">

          <div>

            <div className="sync-section-eyebrow">
              LOCAL TRANSACTIONS
            </div>

            <h2>
              Orders created offline
            </h2>

            <p>
              Offline cash orders stored on
              this browser will appear here.
            </p>

          </div>

          {offlineOrders.length >
            0 && (

            <button
              className="sync-clear-button"
              onClick={
                clearOfflineRecords
              }
              disabled={syncing}
            >
              Clear local records
            </button>

          )}

        </div>


        {offlineOrders.length ===
        0 ? (

          <div className="sync-empty-state">

            <div className="sync-empty-icon">
              ↻
            </div>

            <h3>
              No offline transactions
            </h3>

            <p>
              Offline cash orders stored
              in this browser will appear
              here.
            </p>

          </div>

        ) : (

          <div className="sync-orders-list">

            {offlineOrders.map(
              (
                order,
                index
              ) => (

                <div
                  className="sync-order-card"
                  key={
                    order.offline_reference ||
                    order.id ||
                    index
                  }
                >

                  <div className="sync-order-main">

                    <strong>
                      {order.number ||
                        order.offline_reference ||
                        `Offline Order ${
                          index + 1
                        }`}
                    </strong>

                    <span>
                      {order.name ||
                        order.customer_name ||
                        "Walk-in Customer"}
                    </span>

                  </div>


                  <div className="sync-order-details">

                    <span>
                      CASH
                    </span>

                    <strong>
                      ₱
                      {Number(
                        order.total ??
                          order.amount ??
                          0
                      ).toFixed(2)}
                    </strong>

                    <small>
                      {order.created
                        ? new Date(
                            order.created
                          ).toLocaleString()
                        : "Local transaction"}
                    </small>

                  </div>


                  <div className="sync-pending-badge">
                    PENDING SYNC
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* SYNC INFORMATION */}
      <section className="sync-info-grid">

        <div className="sync-info-card">

          <div className="sync-info-icon">
            ✓
          </div>

          <div>

            <h3>
              Offline POS
            </h3>

            <p>
              Cash transactions may continue
              to be recorded locally when the
              browser temporarily loses
              connectivity.
            </p>

          </div>

        </div>


        <div className="sync-info-card">

          <div className="sync-info-icon">
            ↻
          </div>

          <div>

            <h3>
              Backend synchronization
            </h3>

            <p>
              When the backend is available,
              pending cash orders can be
              synchronized with the central
              BigBrew database. Successful
              synchronization also processes
              the payment and existing
              inventory deduction.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default SyncStatus;