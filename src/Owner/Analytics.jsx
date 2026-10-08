import { useEffect, useMemo, useState } from "react";
import "./Analytics.css";

const API_BASE_URL = "https://kzeraeinne.infinityfreeapp.com/bigbrew_api";

const ANALYTICS_API =
  `${API_BASE_URL}/Api/Analytics/Dashboard.php`;


function peso(value) {
  return `₱${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}


function number(value) {
  return Number(value || 0).toLocaleString("en-PH");
}


function quantity(value) {
  return Number(value || 0).toLocaleString("en-PH", {
    maximumFractionDigits: 3,
  });
}


function ratio(value) {
  if (
    value === null ||
    value === undefined ||
    Number(value) <= 0
  ) {
    return "INSUFFICIENT DATA";
  }

  return `${Number(value).toFixed(2)}x`;
}


function days(value) {
  if (
    value === null ||
    value === undefined ||
    Number(value) <= 0
  ) {
    return "INSUFFICIENT DATA";
  }

  return `${Number(value).toFixed(1)} days`;
}


export default function Analytics() {

  const [activeTab, setActiveTab] =
    useState("sales");

  const [period, setPeriod] =
    useState("month");

  const [category, setCategory] =
    useState("all");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedIngredient, setSelectedIngredient] =
    useState("");


  const tabs = [
    {
      id: "sales",
      label: "Sales Analysis",
    },
    {
      id: "inventory",
      label: "Inventory & Demand",
    },
    {
      id: "expenses",
      label: "Expenses",
    },
  ];


  /*
  =========================================================
  LOAD ANALYTICS
  =========================================================
  */

  useEffect(() => {

    let cancelled = false;


    async function loadAnalytics() {

      setLoading(true);
      setError("");


      try {

        const params =
          new URLSearchParams({
            period,
            category,
          });


        const response =
          await fetch(
            `${ANALYTICS_API}?${params.toString()}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );


        const result =
          await response.json();


        if (
          !response.ok ||
          !result.success
        ) {

          throw new Error(
            result?.data?.error ||
            result?.message ||
            "Unable to retrieve analytics data."
          );
        }


        if (!cancelled) {

          setAnalytics(
            result.data || null
          );
        }

      } catch (err) {

        console.error(
          "Analytics API Error:",
          err
        );


        if (!cancelled) {

          setError(
            err?.message ||
            "Unable to connect to the Analytics database."
          );

          setAnalytics(null);
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadAnalytics();


    return () => {
      cancelled = true;
    };

  }, [period, category]);


  /*
  =========================================================
  DATA
  =========================================================
  */

  const sales =
    analytics?.sales || {
      revenue: 0,
      orders: 0,
      quantity_sold: 0,
      average_order: 0,
    };


  const categories =
    Array.isArray(
      analytics?.categories
    )
      ? analytics.categories
      : [];


  const salesTrend =
    Array.isArray(
      analytics?.sales_trend
    )
      ? analytics.sales_trend
      : [];


  const topProducts =
    Array.isArray(
      analytics?.top_products
    )
      ? analytics.top_products
      : [];


  const salesByCategory =
    Array.isArray(
      analytics?.sales_by_category
    )
      ? analytics.sales_by_category
      : [];


  const inventory =
    Array.isArray(
      analytics?.inventory
    )
      ? analytics.inventory
      : [];


  const mostUsedIngredients =
    Array.isArray(
      analytics?.most_used_ingredients
    )
      ? analytics.most_used_ingredients
      : [];


  const restockingRecommendations =
    Array.isArray(
      analytics?.restocking_recommendations
    )
      ? analytics.restocking_recommendations
      : [];


  const expenses =
    analytics?.expenses || {
      total: 0,
      records: 0,
      by_category: [],
    };


  /*
  =========================================================
  SELECTED INGREDIENT
  =========================================================
  */

  useEffect(() => {

    if (inventory.length === 0) {

      setSelectedIngredient("");

      return;
    }


    const stillExists =
      inventory.some(
        (item) =>
          item.name ===
          selectedIngredient
      );


    if (!stillExists) {

      setSelectedIngredient(
        inventory[0].name
      );
    }

  }, [
    inventory,
    selectedIngredient
  ]);


  const selectedInventory =
    inventory.find(
      (item) =>
        item.name ===
        selectedIngredient
    ) ||
    inventory[0] ||
    null;


  /*
  =========================================================
  SALES TREND MAX
  =========================================================
  */

  const maxTrendRevenue =
    useMemo(() => {

      if (!salesTrend.length) {
        return 0;
      }


      return Math.max(
        ...salesTrend.map(
          (item) =>
            Number(
              item.revenue || 0
            )
        ),
        0
      );

    }, [salesTrend]);


  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (
    loading &&
    !analytics
  ) {

    return (
      <div className="analytics-page">

        <div className="page-heading">

          <div>

            <div className="eyebrow">
              BUSINESS INTELLIGENCE
            </div>

            <h2>
              Analytics
            </h2>

            <p>
              Explore stored branch activity to make better
              business decisions.
            </p>

          </div>

        </div>


        <section className="analytics-panel">

          <div className="analytics-empty">

            <div className="empty-icon">
              ↻
            </div>

            <strong>
              Loading analytics...
            </strong>

            <span>
              Retrieving current data from the BigBrew
              database.
            </span>

          </div>

        </section>

      </div>
    );
  }


  return (

    <div className="analytics-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            BUSINESS INTELLIGENCE
          </div>

          <h2>
            Analytics
          </h2>

          <p>
            Explore stored branch activity to make better
            business decisions.
          </p>

        </div>

      </div>


      {/* =====================================================
          MAIN ANALYTICS WORKSPACE
          ===================================================== */}

      <section className="analytics-panel">


        {/* ===================================================
            TABS
            =================================================== */}

        <div className="analytics-tabs">

          {tabs.map((tab) => (

            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(tab.id)
              }
            >
              {tab.label}
            </button>

          ))}

        </div>


        {/* ===================================================
            ERROR
            =================================================== */}

        {error && (

          <div className="inline-warning">

            Analytics could not be loaded from
            the database.

            <br />

            {error}

          </div>

        )}


        {/* ===================================================
            SALES
            =================================================== */}

        {activeTab === "sales" && (

          <SalesAnalysis

            period={period}
            setPeriod={setPeriod}

            category={category}
            setCategory={setCategory}

            categories={categories}

            sales={sales}

            salesTrend={salesTrend}

            maxTrendRevenue={
              maxTrendRevenue
            }

            topProducts={
              topProducts
            }

            salesByCategory={
              salesByCategory
            }

          />

        )}


        {/* ===================================================
            INVENTORY
            =================================================== */}

        {activeTab === "inventory" && (

          <InventoryDemand

            inventory={inventory}

            mostUsedIngredients={
              mostUsedIngredients
            }

            restockingRecommendations={
              restockingRecommendations
            }

            selectedIngredient={
              selectedIngredient
            }

            setSelectedIngredient={
              setSelectedIngredient
            }

            selectedInventory={
              selectedInventory
            }

          />

        )}


        {/* ===================================================
            EXPENSES
            =================================================== */}

        {activeTab === "expenses" && (

          <Expenses
            sales={sales}
            expenses={expenses}
          />

        )}

      </section>

    </div>
  );
}


/* =========================================================
   SALES ANALYSIS
   ========================================================= */

function SalesAnalysis({

  period,
  setPeriod,

  category,
  setCategory,

  categories,

  sales,

  salesTrend,
  maxTrendRevenue,

  topProducts,

  salesByCategory,

}) {

  return (
    <>

      {/* ===================================================
          FILTERS
          =================================================== */}

      <div className="filter-row">

        <select
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value)
          }
        >

          <option value="today">
            Today
          </option>

          <option value="week">
            This Week
          </option>

          <option value="month">
            This Month
          </option>

          <option value="year">
            This Year
          </option>

        </select>


        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="all">
            All categories
          </option>

          {categories.map(
            (item) => (

              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>

            )
          )}

        </select>

      </div>


      {/* ===================================================
          KPI CARDS
          =================================================== */}

      <div className="metric-grid compact-metrics">


        <div className="metric-card">

          <span>
            Sales revenue
          </span>

          <strong>
            {peso(sales.revenue)}
          </strong>

        </div>


        <div className="metric-card">

          <span>
            Orders
          </span>

          <strong>
            {number(sales.orders)}
          </strong>

        </div>


        <div className="metric-card">

          <span>
            Quantity sold
          </span>

          <strong>
            {number(
              sales.quantity_sold
            )}
          </strong>

        </div>


        <div className="metric-card">

          <span>
            Average order
          </span>

          <strong>

            {sales.orders > 0
              ? peso(
                  sales.average_order
                )
              : "INSUFFICIENT DATA"}

          </strong>

        </div>

      </div>


      {/* ===================================================
          SALES TREND + TOP PRODUCTS
          =================================================== */}

      <div className="analytics-split">


        {/* =================================================
            SALES TREND
            ================================================= */}

        <section className="inner-panel">

          <h3>
            Sales trend
          </h3>


          {salesTrend.length === 0 ? (

            <div className="analytics-empty">

              <div className="empty-icon">
                ▤
              </div>

              <strong>
                No sales data available
              </strong>

              <span>
                Completed sales will appear here.
              </span>

            </div>

          ) : (

            <div className="analytics-sales-chart">

              <div className="analytics-chart-y-axis">

                <span>
                  {peso(
                    maxTrendRevenue
                  )}
                </span>

                <span>
                  {peso(
                    maxTrendRevenue *
                    0.8
                  )}
                </span>

                <span>
                  {peso(
                    maxTrendRevenue *
                    0.6
                  )}
                </span>

                <span>
                  {peso(
                    maxTrendRevenue *
                    0.4
                  )}
                </span>

                <span>
                  {peso(
                    maxTrendRevenue *
                    0.2
                  )}
                </span>

                <span>
                  ₱0
                </span>

              </div>


              <div className="analytics-chart-body">

                <div className="analytics-chart-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>


                <div className="analytics-chart-bars">

                  {salesTrend.map(
                    (item) => {

                      const revenue =
                        Number(
                          item.revenue || 0
                        );


                      const height =
                        maxTrendRevenue > 0
                          ? Math.max(
                              (
                                revenue /
                                maxTrendRevenue
                              ) * 100,
                              revenue > 0
                                ? 4
                                : 0
                            )
                          : 0;


                      const date =
                        new Date(
                          `${item.date}T00:00:00`
                        );


                      const label =
                        date.toLocaleDateString(
                          "en-PH",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        );


                      return (

                        <div
                          className="analytics-chart-column"
                          key={item.date}
                          title={`${label}: ${peso(
                            revenue
                          )}`}
                        >

                          <div className="analytics-bar-area">

                            <div
                              className="analytics-zero-bar"
                              style={{
                                height:
                                  `${height}%`,
                              }}
                            />

                          </div>

                          <span>
                            {label}
                          </span>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            TOP PRODUCTS
            ================================================= */}

        <section className="inner-panel">

          <h3>
            Top-selling products
          </h3>


          {topProducts.length === 0 ? (

            <div className="analytics-empty">

              <div className="empty-icon">
                ▤
              </div>

              <strong>
                No data available
              </strong>

              <span>
                Records will appear here as
                activity is recorded.
              </span>

            </div>

          ) : (

            topProducts.map(
              (product, index) => (

                <div
                  className="category-row"
                  key={`${product.product_name}-${index}`}
                >

                  <span>

                    <strong>
                      {index + 1}.{" "}
                      {product.product_name}
                    </strong>

                  </span>

                  <strong>
                    {number(
                      product.quantity_sold
                    )}{" "}
                    sold
                  </strong>

                </div>

              )
            )

          )}

        </section>

      </div>


      {/* ===================================================
          SALES BY CATEGORY
          =================================================== */}

      <section className="inner-panel">

        <h3>
          Sales by category
        </h3>


        {salesByCategory.length === 0 ? (

          <div className="analytics-empty">

            <div className="empty-icon">
              ▤
            </div>

            <strong>
              No category sales data
            </strong>

            <span>
              Category sales will appear here
              when completed transactions exist.
            </span>

          </div>

        ) : (

          salesByCategory.map(
            (item) => (

              <div
                className="category-row"
                key={item.category}
              >

                <span>
                  {item.category}
                </span>

                <strong>
                  {peso(
                    item.revenue
                  )}
                </strong>

              </div>

            )
          )

        )}

      </section>

    </>
  );
}


/* =========================================================
   INVENTORY & DEMAND
   ========================================================= */

function InventoryDemand({

  inventory,

  mostUsedIngredients,

  restockingRecommendations,

  selectedIngredient,
  setSelectedIngredient,

  selectedInventory,

}) {

  return (
    <>

      {/* ===================================================
          INFORMATION NOTICE
          =================================================== */}

      <div className="inline-warning">

        Inventory turnover uses:

        <br />

        COGS = Beginning Inventory +
        Purchases − Ending Inventory

        <br />

        Average Inventory =
        (Opening Inventory +
        Closing Inventory) ÷ 2

        <br />

        Turnover Ratio =
        COGS ÷ Average Inventory

        <br />

        DSI =
        (Average Inventory ÷ COGS) × 365

      </div>


      {/* ===================================================
          INVENTORY TABLE
          =================================================== */}

      <div className="table-scroll">

        <table>

          <thead>

            <tr>

              <th>
                INGREDIENT
              </th>

              <th>
                RECENT USAGE
              </th>

              <th>
                CURRENT STOCK
              </th>

              <th>
                REORDER LEVEL
              </th>

              <th>
                TURNOVER / DAYS TO SELL
              </th>

              <th>
                RECOMMENDATION
              </th>

            </tr>

          </thead>


          <tbody>

            {inventory.length === 0 ? (

              <tr>

                <td colSpan="6">
                  No inventory records available.
                </td>

              </tr>

            ) : (

              inventory.map(
                (ingredient) => (

                  <tr
                    key={
                      ingredient.inventory_id
                    }
                    onClick={() =>
                      setSelectedIngredient(
                        ingredient.name
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    <td>

                      <strong>
                        {ingredient.name}
                      </strong>

                    </td>


                    <td>

                      {ingredient.recent_usage > 0
                        ? `${quantity(
                            ingredient.recent_usage
                          )} ${
                            ingredient.unit || ""
                          }`
                        : "0"}

                    </td>


                    <td>

                      {quantity(
                        ingredient.stock
                      )}{" "}

                      {ingredient.unit || ""}

                    </td>


                    <td>

                      {quantity(
                        ingredient.reorder
                      )}{" "}

                      {ingredient.unit || ""}

                    </td>


                    <td>

                      {ingredient.data_status ===
                      "CALCULATED" ? (

                        <div>

                          <strong>
                            {ratio(
                              ingredient.turnover_ratio
                            )}
                          </strong>

                          <br />

                          <span>
                            {days(
                              ingredient.days_sales_in_inventory
                            )}
                          </span>

                        </div>

                      ) : (

                        <span className="badge warning">
                          INSUFFICIENT DATA
                        </span>

                      )}

                    </td>


                    <td>

                      <span
                        className={
                          ingredient.recommendation ===
                          "RESTOCK"
                            ? "badge warning"
                            : "badge"
                        }
                      >

                        {ingredient.recommendation}

                      </span>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ===================================================
          PRODUCT DEMAND & FORECAST
          =================================================== */}

      <section className="inner-panel">

        <h3>
          Product demand & forecast
        </h3>

        <div className="helper-line">
          FORECAST BASED ON HISTORICAL SALES DATA
        </div>


        <div className="analytics-empty">

          <div className="empty-icon">
            ↗
          </div>

          <strong>
            Insufficient data for forecast
          </strong>

          <span>
            More historical sales are needed
            to identify reliable demand trends.
          </span>

        </div>

      </section>


      {/* ===================================================
          INGREDIENT INTELLIGENCE
          =================================================== */}

      <div className="analytics-section-heading">

        <div>

          <div className="eyebrow">
            INGREDIENT INTELLIGENCE
          </div>

          <h3>
            Usage, impact & restocking
          </h3>

        </div>


        <button
          type="button"
          className="secondary-button"
        >
          Review in Purchasing →
        </button>

      </div>


      {/* ===================================================
          INGREDIENT DETAILS
          =================================================== */}

      <div className="analytics-two-column">


        <section className="analytics-card ingredient-detail">

          <label>
            Select an ingredient
          </label>


          <select
            value={selectedIngredient}
            onChange={(e) =>
              setSelectedIngredient(
                e.target.value
              )
            }
          >

            {inventory.map(
              (ingredient) => (

                <option
                  key={
                    ingredient.inventory_id
                  }
                  value={
                    ingredient.name
                  }
                >
                  {ingredient.name}
                </option>

              )
            )}

          </select>


          {selectedInventory ? (

            <>

              <div className="ingredient-stats">


                <div>

                  <span>
                    SALES USAGE
                  </span>

                  <strong>

                    {quantity(
                      selectedInventory.recent_usage
                    )}{" "}

                    {selectedInventory.unit || ""}

                  </strong>

                </div>


                <div>

                  <span>
                    AVAILABLE
                  </span>

                  <strong>

                    {quantity(
                      selectedInventory.stock
                    )}{" "}

                    {selectedInventory.unit || ""}

                  </strong>

                </div>


                <div>

                  <span>
                    WASTE / LOSS
                  </span>

                  <strong>

                    {quantity(
                      selectedInventory.waste_quantity
                    )}{" "}

                    {selectedInventory.unit || ""}

                  </strong>

                </div>


                <div>

                  <span>
                    RECEIVING EVENTS
                  </span>

                  <strong>

                    {number(
                      selectedInventory.receiving_events
                    )}

                  </strong>

                </div>


              </div>


              {/* =========================================
                  PRODUCTS
                  ========================================= */}

              <div className="ingredient-products">

                <h4>

                  Products using{" "}

                  {selectedInventory.name}

                </h4>


                <div className="product-tags">

                  {selectedInventory.products?.length > 0 ? (

                    selectedInventory.products.map(
                      (product) => (

                        <span
                          key={product}
                        >
                          {product}
                        </span>

                      )
                    )

                  ) : (

                    <span>
                      No recipe-linked products
                    </span>

                  )}

                </div>

              </div>


              {/* =========================================
                  FORMULA DETAILS
                  ========================================= */}

              <div className="inline-warning">

                <strong>
                  Inventory Cost Analysis
                </strong>

                <br />

                Beginning Inventory:{" "}
                {peso(
                  selectedInventory.beginning_inventory_value
                )}

                <br />

                Purchases:{" "}
                {peso(
                  selectedInventory.purchases_value
                )}

                <br />

                Ending Inventory:{" "}
                {peso(
                  selectedInventory.ending_inventory_value
                )}

                <br />

                COGS:{" "}
                {peso(
                  selectedInventory.cogs
                )}

                <br />

                Average Inventory:{" "}
                {peso(
                  selectedInventory.average_inventory_value
                )}

                <br />

                Inventory Turnover:{" "}

                {ratio(
                  selectedInventory.turnover_ratio
                )}

                <br />

                Days Sales in Inventory:{" "}

                {days(
                  selectedInventory.days_sales_in_inventory
                )}

              </div>


            </>

          ) : (

            <div className="analytics-empty">

              <div className="empty-icon">
                ◇
              </div>

              <strong>
                No inventory selected
              </strong>

              <span>
                Inventory records will appear here
                when available.
              </span>

            </div>

          )}

        </section>


        {/* =================================================
            MOST USED
            ================================================= */}

        <section className="analytics-card">

          <h3>
            Most used ingredients
          </h3>


          {mostUsedIngredients.length === 0 ? (

            <div className="analytics-empty">

              <div className="empty-icon">
                ◇
              </div>

              <strong>
                No sales usage yet
              </strong>

              <span>
                Complete a cash sale to see
                ingredient consumption rankings.
              </span>

            </div>

          ) : (

            mostUsedIngredients
              .filter(
                (item) =>
                  Number(
                    item.recent_usage
                  ) > 0
              )
              .slice(0, 10)
              .map(
                (item) => (

                  <div
                    className="category-row"
                    key={
                      item.inventory_id
                    }
                  >

                    <span>
                      {item.name}
                    </span>

                    <strong>

                      {quantity(
                        item.recent_usage
                      )}{" "}

                      {item.unit || ""}

                    </strong>

                  </div>

                )
              )

          )}


          {/* =================================================
              RESTOCKING
              ================================================= */}

          <div className="inner-panel">

            <h3>
              Restocking recommendations
            </h3>


            {restockingRecommendations.length === 0 ? (

              <div className="analytics-empty">

                <strong>
                  No current restock recommendations
                </strong>

                <span>
                  Recommendations will appear when
                  inventory reaches or falls below
                  the reorder level.
                </span>

              </div>

            ) : (

              restockingRecommendations.map(
                (item) => (

                  <div
                    className="category-row"
                    key={
                      item.inventory_id
                    }
                  >

                    <span>
                      {item.name}
                    </span>

                    <strong>
                      RESTOCK
                    </strong>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </div>

    </>
  );
}


/* =========================================================
   EXPENSES
   ========================================================= */

function Expenses({
  sales,
  expenses,
}) {

  const totalExpenses =
    Number(
      expenses?.total || 0
    );


  const expenseRecords =
    Number(
      expenses?.records || 0
    );


  const expenseCategories =
    Array.isArray(
      expenses?.by_category
    )
      ? expenses.by_category
      : [];


  const recordedSales =
    Number(
      sales?.revenue || 0
    );


  const maxComparison =
    Math.max(
      recordedSales,
      totalExpenses,
      1
    );


  const salesWidth =
    (
      recordedSales /
      maxComparison
    ) * 100;


  const expenseWidth =
    (
      totalExpenses /
      maxComparison
    ) * 100;


  return (
    <>

      {/* ===================================================
          EXPENSE KPI CARDS
          =================================================== */}

      <div className="metric-grid compact-metrics">

        <div className="metric-card">

          <span>
            Recorded sales
          </span>

          <strong>
            {peso(recordedSales)}
          </strong>

        </div>


        <div className="metric-card">

          <span>
            Operating expenses
          </span>

          <strong>
            {peso(totalExpenses)}
          </strong>

        </div>


        <div className="metric-card">

          <span>
            Expense records
          </span>

          <strong>
            {number(
              expenseRecords
            )}
          </strong>

        </div>

      </div>


      {/* ===================================================
          SALES VS EXPENSES
          =================================================== */}

      <section className="inner-panel">

        <h3>
          Sales vs operating expenses
        </h3>


        <div className="comparison-bars">


          <div>

            <span>
              Sales
            </span>

            <div>

              <i
                style={{
                  width:
                    `${Math.max(
                      salesWidth,
                      recordedSales > 0
                        ? 3
                        : 0
                    )}%`,
                }}
              />

            </div>

          </div>


          <div>

            <span>
              Expenses
            </span>

            <div>

              <i
                className="expense-bar"
                style={{
                  width:
                    `${Math.max(
                      expenseWidth,
                      totalExpenses > 0
                        ? 3
                        : 0
                    )}%`,
                }}
              />

            </div>

          </div>


        </div>

      </section>


      {/* ===================================================
          EXPENSES BY CATEGORY
          =================================================== */}

      <section className="inner-panel">

        <h3>
          Expenses by category
        </h3>


        {expenseCategories.length === 0 ? (

          <div className="analytics-empty">

            <div className="empty-icon">
              ₱
            </div>

            <strong>
              No expense data available
            </strong>

            <span>
              Expense records will appear here
              when an expense source is connected.
            </span>

          </div>

        ) : (

          expenseCategories.map(
            (item) => (

              <div
                className="category-row"
                key={item.name}
              >

                <span>
                  {item.name}
                </span>

                <strong>
                  {peso(item.amount)}
                </strong>

              </div>

            )
          )

        )}

      </section>

    </>
  );
}