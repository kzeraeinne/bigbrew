import { useEffect, useMemo, useState } from "react";

import "./Purchasing.css";



const API_BASE = "http\://localhost/bigbrew_api";



function formatPeso(value) {

  return `₱${Number(value || 0).toLocaleString("en-PH", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  })}`;

}



export default function Purchasing({

  store = {},

  update,

  user = null,

}) {

  const [activeTab, setActiveTab] = useState("orders");



  // =========================================================

  // API DATA

  // =========================================================



  const [suppliers, setSuppliers] = useState([]);

  const [ingredients, setIngredients] = useState([]);

  const [purchaseOrders, setPurchaseOrders] = useState([]);



  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  // =========================================================

  // PURCHASE ORDER FORM

  // =========================================================



  const [selectedSupplier, setSelectedSupplier] = useState("");

  const [expectedDelivery, setExpectedDelivery] = useState("");

  const [notes, setNotes] = useState("");



  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [quantity, setQuantity] = useState("");

  const [totalCost, setTotalCost] = useState("");



  const [orderItems, setOrderItems] = useState([]);



  // =========================================================

  // SUPPLIER FORM

  // =========================================================



  const [supplierForm, setSupplierForm] = useState({

    name: "",

    contact: "",

    phone: "",

    email: "",

    address: "",

  });



  const [savingSupplier, setSavingSupplier] = useState(false);



  // =========================================================

  // SEARCH / FILTER

  // =========================================================



  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("ALL");



  // =========================================================

  // LOAD ALL PROCUREMENT DATA

  // =========================================================



  useEffect(() => {

    loadProcurementData();

  }, []);



  async function loadProcurementData() {

    try {

      setLoading(true);

      setError("");



      await Promise.all([

        loadSuppliers(),

        loadIngredients(),

        loadPurchases(),

      ]);

    } catch (err) {

      console.error("Purchasing load error:", err);



      setError(

        err.message ||

          "Unable to connect to the BigBrew backend."

      );

    } finally {

      setLoading(false);

    }

  }



  // =========================================================

  // LOAD SUPPLIERS

  // =========================================================



  async function loadSuppliers() {

    const response = await fetch(

      `${API_BASE}/Api/Suppliers/List.php`,

      {

        method: "GET",

        headers: {

          Accept: "application/json",

        },

      }

    );



    const result = await response.json();



    if (!response.ok || !result.success) {

      throw new Error(

        result.message ||

          "Failed to retrieve suppliers."

      );

    }



    const apiSuppliers =

      result.data?.suppliers || [];



    /*

     * IMPORTANT:

     * The PHP API returns snake_case fields:

     *

     * supplier_id

     * supplier_code

     * supplier_name

     * contact_person

     * contact_number

     * address

     * is_active

     *

     * The React UI uses camelCase fields.

     *

     * supplierId MUST always contain the actual

     * numeric database supplier_id.

     */



    const formattedSuppliers =

      apiSuppliers.map((supplier) => {

        const supplierId = Number(

          supplier.supplier_id

        );



        return {

          id: supplierId,

          supplierId: supplierId,



          code:

            supplier.supplier_code || "",



          supplierCode:

            supplier.supplier_code || "",



          name:

            supplier.supplier_name || "",



          supplierName:

            supplier.supplier_name || "",



          contact:

            supplier.contact_person || "",



          contactPerson:

            supplier.contact_person || "",



          phone:

            supplier.contact_number || "",



          contactNumber:

            supplier.contact_number || "",



          address:

            supplier.address || "",



          active:

            Number(supplier.is_active) === 1,



          isActive:

            Number(supplier.is_active) === 1,

        };

      });



    setSuppliers(formattedSuppliers);

  }



  // =========================================================

  // LOAD INGREDIENTS

  // =========================================================



  async function loadIngredients() {

    const response = await fetch(

      `${API_BASE}/Api/Ingredients/List.php`,

      {

        method: "GET",

        headers: {

          Accept: "application/json",

        },

      }

    );



    const result = await response.json();



    if (!response.ok || !result.success) {

      throw new Error(

        result.message ||

          "Failed to retrieve ingredients."

      );

    }



    const apiIngredients =

      result.data?.ingredients || [];



    const formattedIngredients =

      apiIngredients

        .filter(

          (ingredient) =>

            Number(ingredient.is_active) === 1

        )

        .map((ingredient) => ({

          id: Number(

            ingredient.ingredient_id

          ),



          ingredientId: Number(

            ingredient.ingredient_id

          ),



          code:

            ingredient.ingredient_code || "",



          name:

            ingredient.ingredient_name || "",



          unit:

            ingredient.unit_of_measure || "unit",



          cost: Number(

            ingredient.unit_cost ??

              ingredient.last_unit_cost ??

              0

          ),



          category:

            ingredient.category_name ||

            ingredient.category ||

            "Other",

        }));



    setIngredients(formattedIngredients);



    if (

      formattedIngredients.length > 0 &&

      !selectedIngredient

    ) {

      setSelectedIngredient(

        String(formattedIngredients[0].id)

      );

    }

  }



  // =========================================================

  // LOAD PURCHASES

  // =========================================================



  async function loadPurchases() {

    const response = await fetch(

      `${API_BASE}/Api/Purchases/List.php`,

      {

        method: "GET",

        headers: {

          Accept: "application/json",

        },

      }

    );



    const result = await response.json();



    if (!response.ok || !result.success) {

      throw new Error(

        result.message ||

          "Failed to retrieve purchase orders."

      );

    }



    const apiPurchases =

      result.data?.purchases || [];



    const formattedPurchases =

      apiPurchases.map((purchase) => ({

        id:

          purchase.purchase_code ||

          `PURCH${String(

            purchase.purchase_id

          ).padStart(3, "0")}`,



        purchaseId:

          Number(purchase.purchase_id),



        supplier:

          purchase.supplier_name ||

          "Unknown Supplier",



        supplierId:

          Number(purchase.supplier_id),



        status:

          purchase.purchase_status ||

          "PENDING",



        purchaseDate:

          purchase.purchase_date || "",



        total:

          Number(purchase.total_amount || 0),



        createdBy:

          purchase.created_by,



        createdByCode:

          purchase.created_by_code || "",



        createdByName:

          purchase.created_by_name || "",



        fullyReceived:

          Boolean(purchase.fully_received),



        itemCount:

          Number(purchase.item_count || 0),



        items:

          (purchase.items || []).map(

            (item) => ({

              id:

                item.purchase_item_id,



              purchaseItemId:

                Number(

                  item.purchase_item_id

                ),



              purchaseItemCode:

                item.purchase_item_code || "",



              ingredientId:

                Number(

                  item.ingredient_id

                ),



              ingredientName:

                item.ingredient_name ||

                "Unknown Ingredient",



              ingredientCode:

                item.ingredient_code || "",



              category:

                item.category_name ||

                item.category ||

                "Other",



              unit:

                item.unit_of_measure ||

                "unit",



              quantity:

                Number(

                  item.quantity_ordered || 0

                ),



              quantityOrdered:

                Number(

                  item.quantity_ordered || 0

                ),



              unitCost:

                Number(

                  item.unit_cost || 0

                ),



              totalCost:

                Number(

                  item.total_cost || 0

                ),



              received:

                Number(

                  item.quantity_received || 0

                ),



              quantityReceived:

                Number(

                  item.quantity_received || 0

                ),



              quantityRemaining:

                Number(

                  item.quantity_remaining || 0

                ),



              variance:

                Number(

                  item.variance || 0

                ),

            })

          ),

      }));



    setPurchaseOrders(formattedPurchases);

  }



  // =========================================================

  // CATEGORIES

  // =========================================================



  const categories = useMemo(() => {

    return [

      ...new Set(

        ingredients

          .map(

            (item) => item.category

          )

          .filter(Boolean)

      ),

    ];

  }, [ingredients]);



  // =========================================================

  // FILTER PURCHASE ORDERS

  // =========================================================



  const filteredOrders = useMemo(() => {

    const query =

      search.trim().toLowerCase();



    return purchaseOrders.filter(

      (order) => {

        const searchable = [

          order.id,

          order.supplier,

          order.status,



          ...(order.items || []).map(

            (item) =>

              item.ingredientName

          ),

        ]

          .join(" ")

          .toLowerCase();



        const matchesSearch =

          !query ||

          searchable.includes(query);



        const matchesCategory =

          categoryFilter === "ALL" ||

          (order.items || []).some(

            (item) =>

              item.category ===

              categoryFilter

          );



        return (

          matchesSearch &&

          matchesCategory

        );

      }

    );

  }, [

    purchaseOrders,

    search,

    categoryFilter,

  ]);



  // =========================================================

  // CURRENT INGREDIENT

  // =========================================================



  const currentIngredient =

    ingredients.find(

      (item) =>

        String(item.id) ===

        String(selectedIngredient)

    );



  const enteredTotalCost = Number(totalCost || 0);

  const calculatedUnitCost =
    Number(quantity || 0) > 0
      ? enteredTotalCost / Number(quantity)
      : 0;

  const lineTotal = enteredTotalCost;

  const orderTotal =
    orderItems.reduce(
      (total, item) =>
        total + Number(item.totalCost || 0),
      0
    );

  // ADD INGREDIENT TO PURCHASE

  // =========================================================



  function addIngredient() {

    setError("");

    setSuccess("");



    if (!selectedIngredient) {

      alert("Please select an ingredient.");

      return;

    }



    if (

      !quantity ||

      Number(quantity) <= 0

    ) {

      alert(

        "Please enter a valid quantity."

      );

      return;

    }



    if (totalCost === "" || Number(totalCost) < 0) {
      alert(
        "Please enter a valid total cost."
      );
      return;
    }



    const ingredient =

      ingredients.find(

        (item) =>

          String(item.id) ===

          String(selectedIngredient)

      );



    if (!ingredient) {

      alert(

        "Selected ingredient was not found."

      );

      return;

    }



    const existing =

      orderItems.find(

        (item) =>

          Number(item.ingredientId) ===

          Number(

            ingredient.ingredientId

          )

      );



    if (existing) {

      setOrderItems(

        orderItems.map((item) =>

          Number(item.ingredientId) ===

          Number(

            ingredient.ingredientId

          )

            ? {

                ...item,



                quantity:

                  Number(item.quantity) +

                  Number(quantity),



                unitCost:
                  (Number(item.totalCost || 0) + Number(totalCost)) /
                  (Number(item.quantity) + Number(quantity)),

                totalCost:
                  Number(item.totalCost || 0) + Number(totalCost),

              }

            : item

        )

      );

    } else {

      setOrderItems([

        ...orderItems,



        {

          id:

            `${ingredient.ingredientId}-${Date.now()}`,



          ingredientId:

            ingredient.ingredientId,



          ingredientName:

            ingredient.name,



          ingredientCode:

            ingredient.code,



          category:

            ingredient.category ||

            "Other",



          unit:

            ingredient.unit ||

            "unit",



          quantity:

            Number(quantity),



          unitCost:
            Number(totalCost) / Number(quantity),

          totalCost:
            Number(totalCost),

        },

      ]);

    }



    setQuantity("");

    setTotalCost("");

  }



  // =========================================================

  // REMOVE INGREDIENT

  // =========================================================



  function removeIngredient(id) {

    setOrderItems(

      orderItems.filter(

        (item) => item.id !== id

      )

    );

  }



  // =========================================================

  // GET CURRENT USER ID

  // =========================================================



  function getCurrentUserId() {

    if (

      user &&

      typeof user === "object"

    ) {

      return (

        user.user_id ??

        user.userId ??

        user.id ??

        null

      );

    }



    if (

      store?.user &&

      typeof store.user === "object"

    ) {

      return (

        store.user.user_id ??

        store.user.userId ??

        store.user.id ??

        null

      );

    }



    return null;

  }



  // =========================================================

  // CREATE PURCHASE ORDER

  // =========================================================



  async function createPurchaseOrder() {

    setError("");

    setSuccess("");



    if (!selectedSupplier) {

      alert("Please select a supplier.");

      return;

    }



    if (!expectedDelivery) {

      alert(

        "Please select an expected delivery date."

      );

      return;

    }



    if (orderItems.length === 0) {

      alert(

        "Please add at least one ingredient."

      );

      return;

    }



    /*

     * IMPORTANT FIX:

     *

     * The <select> stores the actual database

     * supplier_id as its value.

     *

     * Do not depend only on a local object lookup

     * to determine the ID.

     */



    const supplierId =

      Number(selectedSupplier);



    if (

      !Number.isInteger(supplierId) ||

      supplierId <= 0

    ) {

      alert(

        "Invalid supplier selected. Please select the supplier again."

      );

      return;

    }



    /*

     * Confirm that the selected supplier exists

     * in the currently loaded supplier list.

     *

     * We support both supplierId and id so the

     * frontend remains safe even if another part

     * of the UI uses the generic id property.

     */



    const supplier =

      suppliers.find(

        (item) =>

          Number(

            item.supplierId ??

              item.id ??

              item.supplier_id

          ) === supplierId

      );



    /*

     * If the list has not loaded the supplier,

     * stop here rather than sending an incorrect

     * supplier ID to PHP.

     */



    if (!supplier) {

      alert(

        "Selected supplier was not found in the loaded supplier list. Please refresh the page and try again."

      );

      return;

    }



    try {

      setSaving(true);



      const currentUserId =

        getCurrentUserId();



      const requestBody = {

        supplier_id:

          supplierId,



        created_by:

          currentUserId !== null

            ? Number(currentUserId)

            : null,



        items:

          orderItems.map((item) => ({

            ingredient_id:

              Number(

                item.ingredientId

              ),



            quantity_ordered:

              Number(item.quantity),



            unit_cost:

              Number(item.unitCost),

          })),

      };



      console.log(

        "Creating purchase order:",

        requestBody

      );



      const response = await fetch(

        `${API_BASE}/Api/Purchases/Create.php`,

        {

          method: "POST",



          headers: {

            "Content-Type":

              "application/json",



            Accept:

              "application/json",

          },



          body:

            JSON.stringify(

              requestBody

            ),

        }

      );



      const result =

        await response.json();



      if (

        !response.ok ||

        !result.success

      ) {

        throw new Error(

          result.message ||

            "Failed to create purchase order."

        );

      }



      /*

       * Reload directly from MySQL.

       *

       * The database is the source of truth.

       */



      await loadPurchases();



      /*

       * Optional parent-store update.

       *

       * This does not replace the database.

       */



      if (

        typeof update === "function"

      ) {

        try {

          update((state) => {

            state.purchases =

              state.purchases || [];

          });

        } catch {

          // Database operation already succeeded.

        }

      }



      setOrderItems([]);

      setSelectedSupplier("");

      setExpectedDelivery("");

      setNotes("");

      setQuantity("");

      setTotalCost("");



      setSuccess(

        result.message ||

          "Purchase order created successfully."

      );



      setActiveTab("orders");

    } catch (err) {

      console.error(

        "Create purchase error:",

        err

      );



      setError(

        err.message ||

          "Failed to create purchase order."

      );

    } finally {

      setSaving(false);

    }

  }



  // =========================================================

  // SAVE SUPPLIER

  // =========================================================



  async function saveSupplier() {

    setError("");

    setSuccess("");



    if (

      !supplierForm.name.trim()

    ) {

      alert(

        "Supplier name is required."

      );

      return;

    }



    try {

      setSavingSupplier(true);



      const response = await fetch(

        `${API_BASE}/Api/Suppliers/Create.php`,

        {

          method: "POST",



          headers: {

            "Content-Type":

              "application/json",



            Accept:

              "application/json",

          },



          body: JSON.stringify({

            supplier_name:

              supplierForm.name.trim(),



            contact_person:

              supplierForm.contact.trim(),



            contact_number:

              supplierForm.phone.trim(),



            address:

              supplierForm.address.trim(),

          }),

        }

      );



      const result =

        await response.json();



      if (

        !response.ok ||

        !result.success

      ) {

        throw new Error(

          result.message ||

            "Failed to create supplier."

        );

      }



      await loadSuppliers();



      setSupplierForm({

        name: "",

        contact: "",

        phone: "",

        email: "",

        address: "",

      });



      setSuccess(

        result.message ||

          "Supplier created successfully."

      );

    } catch (err) {

      console.error(

        "Create supplier error:",

        err

      );



      setError(

        err.message ||

          "Failed to create supplier."

      );

    } finally {

      setSavingSupplier(false);

    }

  }



  // =========================================================

  // LOADING

  // =========================================================



  if (loading) {

    return (

      <div className="purchasing-page">

        <div className="purchasing-header">

          <div>

            <div className="purchasing-eyebrow">

              PROCUREMENT

            </div>



            <h1>Purchasing</h1>



            <p>

              Create and manage

              ingredient-level purchase

              orders.

            </p>

          </div>

        </div>



        <div className="purchasing-card">

          <div className="empty-state">

            <div className="empty-icon">

              ◌

            </div>



            <strong>

              Loading purchasing data...

            </strong>



            <span>

              Connecting to the BigBrew

              backend.

            </span>

          </div>

        </div>

      </div>

    );

  }



  // =========================================================

  // PAGE

  // =========================================================



  return (

    <div className="purchasing-page">



      {/* =====================================================

          PAGE HEADER

      ===================================================== */}



      <div className="purchasing-header">



        <div>



          <div className="purchasing-eyebrow">

            PROCUREMENT

          </div>



          <h1>

            Purchasing

          </h1>



          <p>

            Create and manage

            ingredient-level purchase

            orders. Stock only changes

            when goods are actually

            received.

          </p>



        </div>



        <div className="purchase-count">

          {purchaseOrders.length} PURCHASE ORDERS

        </div>



      </div>



      {/* =====================================================

          ERROR

      ===================================================== */}



      {error && (

        <div

          className="error-message"

          role="alert"

        >

          {error}

        </div>

      )}



      {/* =====================================================

          SUCCESS

      ===================================================== */}



      {success && (

        <div

          className="success-message"

          role="status"

        >

          {success}

        </div>

      )}



      {/* =====================================================

          MAIN CARD

      ===================================================== */}



      <div className="purchasing-card">



        {/* ===================================================

            TABS

        =================================================== */}



        <div className="purchasing-tabs">



          <button

            type="button"

            className={

              activeTab === "orders"

                ? "purchasing-tab active"

                : "purchasing-tab"

            }

            onClick={() =>

              setActiveTab("orders")

            }

          >

            Purchase orders

          </button>



          <button

            type="button"

            className={

              activeTab === "create"

                ? "purchasing-tab active"

                : "purchasing-tab"

            }

            onClick={() =>

              setActiveTab("create")

            }

          >

            Create purchase order

          </button>



          <button

            type="button"

            className={

              activeTab === "suppliers"

                ? "purchasing-tab active"

                : "purchasing-tab"

            }

            onClick={() =>

              setActiveTab("suppliers")

            }

          >

            Suppliers

          </button>



        </div>



        {/* ===================================================

            PURCHASE ORDERS

        =================================================== */}



        {activeTab === "orders" && (

          <div className="purchasing-content">



            <div className="purchase-toolbar">



              <div className="search-box">



                <span>

                  ⌕

                </span>



                <input

                  type="text"

                  placeholder="Search supplier or ingredient"

                  value={search}

                  onChange={(e) =>

                    setSearch(

                      e.target.value

                    )

                  }

                />



              </div>



              <select

                value={categoryFilter}

                onChange={(e) =>

                  setCategoryFilter(

                    e.target.value

                  )

                }

              >



                <option value="ALL">

                  All categories

                </option>



                {categories.map(

                  (category) => (

                    <option

                      key={category}

                      value={category}

                    >

                      {category}

                    </option>

                  )

                )}



              </select>



            </div>



            {filteredOrders.length > 0 ? (



              <div className="purchase-list">



                {filteredOrders.map(

                  (order) => (



                    <div

                      className="purchase-order"

                      key={order.purchaseId}

                    >



                      <div className="purchase-order-top">



                        <div>



                          <strong>

                            {order.id}

                          </strong>



                          <span>

                            {order.supplier}

                          </span>



                        </div>



                        <span

                          className={`status ${order.status

                            .toLowerCase()

                            .replaceAll(

                              " ",

                              "-"

                            )}`}

                        >

                          {order.status}

                        </span>



                      </div>



                      <div className="purchase-order-info">



                        <div>



                          <small>

                            PURCHASE DATE

                          </small>



                          <strong>

                            {order.purchaseDate

                              ? new Date(

                                  order.purchaseDate

                                ).toLocaleDateString(

                                  "en-PH"

                                )

                              : "—"}

                          </strong>



                        </div>



                        <div>



                          <small>

                            ITEMS

                          </small>



                          <strong>

                            {order.items?.length ||

                              0}

                          </strong>



                        </div>



                        <div>



                          <small>

                            TOTAL

                          </small>



                          <strong>

                            {formatPeso(

                              order.total

                            )}

                          </strong>



                        </div>



                      </div>



                      {order.items?.length >

                        0 && (



                        <div className="purchase-items">



                          {order.items.map(

                            (item) => (



                              <div

                                className="purchase-item-row"

                                key={

                                  item.purchaseItemId

                                }

                              >



                                <span>

                                  {

                                    item.ingredientName

                                  }

                                </span>



                                <span>

                                  {

                                    item.quantity

                                  }{" "}

                                  {

                                    item.unit

                                  }

                                </span>



                                <span>

                                  {formatPeso(

                                    item.unitCost

                                  )}

                                </span>



                                <span>

                                  {formatPeso(

                                    item.totalCost

                                  )}

                                </span>



                              </div>



                            )

                          )}



                        </div>



                      )}



                      {/*



                        IMPORTANT:



                        There is intentionally NO

                        "Approve" button here.



                        The actual database uses:



                        PENDING

                        COMPLETED

                        CANCELLED



                        Receiving is responsible for

                        completing the purchase after

                        actual goods are received.



                      */}



                    </div>



                  )

                )}



              </div>



            ) : (



              <div className="empty-state">



                <div className="empty-icon">

                  □

                </div>



                <strong>

                  No purchase orders yet

                </strong>



                <span>

                  Create a purchase order

                  using an active supplier

                  and ingredients.

                </span>



                <button

                  type="button"

                  className="primary-button"

                  onClick={() =>

                    setActiveTab("create")

                  }

                >

                  Create purchase order

                </button>



              </div>



            )}



          </div>

        )}



        {/* ===================================================

            CREATE PURCHASE ORDER

        =================================================== */}



        {activeTab === "create" && (



          <div className="purchasing-content">



            <div className="form-section">



              <div className="section-title">

                PURCHASE ORDER DETAILS

              </div>



              <div className="form-grid">



                <div className="form-field">



                  <label>

                    Supplier

                  </label>



                  <select

                    value={selectedSupplier}

                    onChange={(e) =>

                      setSelectedSupplier(

                        e.target.value

                      )

                    }

                  >



                    <option value="">

                      Select supplier

                    </option>



                    {suppliers

                      .filter(

                        (supplier) =>

                          supplier.active

                      )

                      .map(

                        (supplier) => (



                          <option

                            key={

                              supplier.supplierId

                            }

                            value={

                              supplier.supplierId

                            }

                          >

                            {supplier.code

                              ? `${supplier.code} — `

                              : ""}

                            {supplier.name}

                          </option>



                        )

                      )}



                  </select>



                </div>



                <div className="form-field">



                  <label>

                    Expected delivery

                  </label>



                  <input

                    type="date"

                    value={

                      expectedDelivery

                    }

                    onChange={(e) =>

                      setExpectedDelivery(

                        e.target.value

                      )

                    }

                  />



                </div>



              </div>



              <div className="form-field full-width">



                <label>

                  Notes

                </label>



                <textarea

                  placeholder="Optional order notes"

                  value={notes}

                  onChange={(e) =>

                    setNotes(

                      e.target.value

                    )

                  }

                />



              </div>



            </div>



            <div className="form-section">



              <div className="section-title">

                PURCHASE DETAILS

              </div>



              <h2>

                Add ingredients

              </h2>



              <div
                className="ingredient-entry"
                style={{
                  gridTemplateColumns: "minmax(0, 1fr) 210px 240px auto",
                  alignItems: "start",
                }}
              >



                <div className="form-field">



                  <label>

                    Ingredient

                  </label>



                  <select

                    value={

                      selectedIngredient

                    }

                    onChange={(e) =>

                      setSelectedIngredient(

                        e.target.value

                      )

                    }

                  >



                    <option value="">

                      Select ingredient

                    </option>



                    {ingredients.map(

                      (ingredient) => (



                        <option

                          key={

                            ingredient.id

                          }

                          value={

                            ingredient.id

                          }

                        >

                          {ingredient.code

                            ? `${ingredient.code} — `

                            : ""}

                          {

                            ingredient.name

                          }

                        </option>



                      )

                    )}



                  </select>



                </div>



                <div className="form-field">



                  <label>

                    Quantity

                  </label>



                  <input

                    type="number"

                    min="0"

                    step="0.001"

                    placeholder="0"

                    value={quantity}

                    onChange={(e) =>

                      setQuantity(

                        e.target.value

                      )

                    }

                  />



                  {currentIngredient && (

                    <small>

                      Unit:{" "}

                      {

                        currentIngredient.unit

                      }

                    </small>

                  )}



                </div>



                <div className="form-field">



                  <label>

                    Total Cost

                  </label>

                  <input

                    type="number"

                    min="0"

                    step="0.01"

                    placeholder="0.00"

                    value={totalCost}

                    onChange={(e) =>

                      setTotalCost(

                        e.target.value

                      )

                    }

                  />



                </div>



                <button

                  type="button"

                  className="secondary-button add-item-button"

                  onClick={

                    addIngredient

                  }

                >

                  + Add item

                </button>



              </div>



              {orderItems.length > 0 && (



                <div className="items-table">



                  <div className="items-header">



                    <span>

                      INGREDIENT

                    </span>



                    <span>

                      CATEGORY

                    </span>



                    <span>

                      QTY

                    </span>



                    <span>

                      UNIT COST

                    </span>



                    <span>

                      TOTAL COST

                    </span>



                    <span>

                    </span>



                  </div>



                  {orderItems.map(

                    (item) => (



                      <div

                        className="items-row"

                        key={item.id}

                      >



                        <span>

                          {

                            item.ingredientName

                          }

                        </span>



                        <span>

                          {item.category}

                        </span>



                        <span>

                          {item.quantity}{" "}

                          {item.unit}

                        </span>



                        <span>

                          {formatPeso(

                            item.unitCost

                          )}

                        </span>



                        <span>

                          {formatPeso(

                          item.totalCost

                        )}

                        </span>



                        <button

                          type="button"

                          className="remove-button"

                          onClick={() =>

                            removeIngredient(

                              item.id

                            )

                          }

                        >

                          Remove

                        </button>



                      </div>



                    )

                  )}



                </div>



              )}



            </div>



            <div className="purchase-summary">



              <div>



                <span>

                  Estimated purchase total

                </span>



                <strong>

                  {formatPeso(

                    orderTotal

                  )}

                </strong>



              </div>



              <button

                type="button"

                className="primary-button"

                onClick={

                  createPurchaseOrder

                }

                disabled={saving}

              >

                {saving

                  ? "Saving..."

                  : "Create purchase order →"}

              </button>



            </div>



          </div>



        )}



        {/* ===================================================

            SUPPLIERS

        =================================================== */}



        {activeTab === "suppliers" && (



          <div className="purchasing-content">



            <div className="form-section">



              <div className="section-title">

                SUPPLIER MASTER

              </div>



              <h2>

                Add supplier

              </h2>



              <div className="form-grid">



                <div className="form-field">



                  <label>

                    Supplier name

                  </label>



                  <input

                    type="text"

                    maxLength="100"

                    placeholder="Supplier name"

                    value={

                      supplierForm.name

                    }

                    onChange={(e) =>

                      setSupplierForm({

                        ...supplierForm,

                        name:

                          e.target.value,

                      })

                    }

                  />



                </div>



                <div className="form-field">



                  <label>

                    Contact person

                  </label>



                  <input

                    type="text"

                    maxLength="100"

                    placeholder="Contact person"

                    value={

                      supplierForm.contact

                    }

                    onChange={(e) =>

                      setSupplierForm({

                        ...supplierForm,

                        contact:

                          e.target.value,

                      })

                    }

                  />



                </div>



                <div className="form-field">



                  <label>

                    Contact number

                  </label>



                  <input

                    type="text"

                    maxLength="30"

                    placeholder="09XX XXX XXXX"

                    value={

                      supplierForm.phone

                    }

                    onChange={(e) =>

                      setSupplierForm({

                        ...supplierForm,

                        phone:

                          e.target.value,

                      })

                    }

                  />



                </div>



                <div className="form-field">



                  <label>

                    Email

                  </label>



                  <input

                    type="email"

                    placeholder="supplier@email.com"

                    value={

                      supplierForm.email

                    }

                    onChange={(e) =>

                      setSupplierForm({

                        ...supplierForm,

                        email:

                          e.target.value,

                      })

                    }

                  />



                  <small>

                    Email is currently

                    display-only because

                    the suppliers table

                    does not have an email

                    column.

                  </small>



                </div>



                <div className="form-field full-width">



                  <label>

                    Address

                  </label>



                  <input

                    type="text"

                    maxLength="255"

                    placeholder="Supplier address"

                    value={

                      supplierForm.address

                    }

                    onChange={(e) =>

                      setSupplierForm({

                        ...supplierForm,

                        address:

                          e.target.value,

                      })

                    }

                  />



                </div>



              </div>



              <button

                type="button"

                className="primary-button"

                onClick={saveSupplier}

                disabled={

                  savingSupplier

                }

              >

                {savingSupplier

                  ? "Saving..."

                  : "Save supplier"}

              </button>



            </div>



            <div className="supplier-list">



              <div className="supplier-list-header">



                <span>

                  SUPPLIER

                </span>



                <span>

                  CONTACT

                </span>



                <span>

                  PHONE

                </span>



                <span>

                  ADDRESS

                </span>



                <span>

                  STATUS

                </span>



              </div>



              {suppliers.length > 0 ? (



                suppliers.map(

                  (supplier) => (



                    <div

                      className="supplier-row"

                      key={

                        supplier.supplierId

                      }

                    >



                      <strong>

                        {supplier.code

                          ? `${supplier.code} — `

                          : ""}

                        {supplier.name}

                      </strong>



                      <span>

                        {

                          supplier.contact ||

                          "—"

                        }

                      </span>



                      <span>

                        {

                          supplier.phone ||

                          "—"

                        }

                      </span>



                      <span>

                        {

                          supplier.address ||

                          "—"

                        }

                      </span>



                      <span>



                        <span

                          className={

                            supplier.active

                              ? "supplier-active"

                              : "supplier-inactive"

                          }

                        >

                          {supplier.active

                            ? "ACTIVE"

                            : "INACTIVE"}

                        </span>



                      </span>



                    </div>



                  )

                )



              ) : (



                <div className="empty-state">



                  <strong>

                    No active suppliers

                  </strong>



                  <span>

                    Add a supplier above

                    before creating a

                    purchase order.

                  </span>



                </div>



              )}



            </div>



          </div>



        )}



      </div>



    </div>

  );

}
