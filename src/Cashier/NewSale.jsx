import React, { useEffect, useMemo, useState } from "react";

import "./NewSale.css";



/* =========================================================

   BIGBREW SMART OPERATIONS

   NEW SALE / POS



   Connected to:



   GET

   /Api/Products/List.php



   POST

   /Api/Orders/Create.php



   POST

   /Api/Payments/Create.php

   ========================================================= */



const API_BASE = "https://kzeraeinne.infinityfreeapp.com/bigbrew_api";



/*

|--------------------------------------------------------------------------

| CURRENT CASHIER USER

|--------------------------------------------------------------------------

|

| Your current working cashier demo account is USER002 / user_id 2.

|

| Later, when the login context is connected, replace this with the

| logged-in user's actual user_id.

|

*/



const CURRENT_USER_ID = 2;





/* =========================================================

   HELPERS

   ========================================================= */



const money = (value) =>

  `₱${Number(value || 0).toLocaleString("en-PH", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  })}`;





const getFirstPrice = (product) => {

  if (!product?.sizes?.length) {

    return 0;

  }



  return Number(product.sizes[0]?.price || 0);

};





const paymentMethodForApi = (method) => {

  switch (method) {

    case "CASH":

      return "Cash";



    case "GCASH":

      return "GCash";



    case "MAYA":

      return "Maya";



    default:

      return "Cash";

  }

};





const createLineId = () => {

  return `${Date.now()}-${Math.random()

    .toString(36)

    .slice(2, 8)}`;

};

/* =========================================================
   OFFLINE POS HELPERS
   ========================================================= */

const OFFLINE_ORDERS_KEY = "bigbrew-offline-orders";

const createOfflineReference = () => {
  return `OFFLINE-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const saveOfflineOrder = (offlineOrder) => {
  try {
    const saved = localStorage.getItem(OFFLINE_ORDERS_KEY);
    const existing = saved ? JSON.parse(saved) : [];
    const orders = Array.isArray(existing) ? existing : [];
    if (!orders.some((item) => item.offline_reference === offlineOrder.offline_reference)) {
      orders.push(offlineOrder);
    }
    localStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error("Unable to save offline order:", error);
    return false;
  }
};






/* =========================================================

   COMPONENT

   ========================================================= */



function NewSale() {



  /* -------------------------------------------------------

     MENU

  ------------------------------------------------------- */



  const [menuData, setMenuData] = useState({

    categories: [],

    products: [],

    addons: [],

  });



  const [menuLoading, setMenuLoading] = useState(true);

  const [menuError, setMenuError] = useState("");





  /* -------------------------------------------------------

     POS STATE

  ------------------------------------------------------- */



  const [activeCategory, setActiveCategory] = useState("");

  const [search, setSearch] = useState("");



  const [customerName, setCustomerName] = useState("");



  const [order, setOrder] = useState([]);





  /* -------------------------------------------------------

     PRODUCT MODAL

  ------------------------------------------------------- */



  const [selectedProduct, setSelectedProduct] =

    useState(null);



  const [selectedSizeId, setSelectedSizeId] =

    useState(null);



  const [sugarLevel, setSugarLevel] =

    useState("100%");



  const [selectedAddons, setSelectedAddons] =

    useState([]);





  /* -------------------------------------------------------

     PAYMENT

  ------------------------------------------------------- */



  const [paymentMethod, setPaymentMethod] =

    useState("CASH");



  const [amountReceived, setAmountReceived] =

    useState("");





  /* -------------------------------------------------------

     COMPLETED SALE

  ------------------------------------------------------- */



  const [completedSale, setCompletedSale] =

    useState(null);



  const [submitting, setSubmitting] =

    useState(false);





  /* =======================================================

     LOAD MENU

     ======================================================= */



  useEffect(() => {



    let cancelled = false;





    const loadMenu = async () => {



      try {



        setMenuLoading(true);

        setMenuError("");





        const response = await fetch(

          `${API_BASE}/Api/Products/List.php`,

          {

            method: "GET",

            headers: {

              Accept: "application/json",

            },

          }

        );





        /*

        |--------------------------------------------------------------------------

        | HTTP ERROR

        |--------------------------------------------------------------------------

        */



        if (!response.ok) {



          throw new Error(

            `Menu API returned HTTP ${response.status}.`

          );



        }





        const data =

          await response.json();





        /*

        |--------------------------------------------------------------------------

        | API ERROR

        |--------------------------------------------------------------------------

        */



        if (!data.success) {



          throw new Error(

            data.message ||

              "Unable to load products."

          );



        }





        if (cancelled) {

          return;

        }





        const categories =

          Array.isArray(data.data?.categories)

            ? data.data.categories

            : Array.isArray(data.categories)

              ? data.categories

              : [];





        const products =

          Array.isArray(data.data?.products)

            ? data.data.products

            : Array.isArray(data.products)

              ? data.products

              : [];





        const addons =

          Array.isArray(data.data?.addons)

            ? data.data.addons

            : Array.isArray(data.addons)

              ? data.addons

              : [];





        setMenuData({

          categories,

          products,

          addons,

        });





        /*

        |--------------------------------------------------------------------------

        | FIRST CATEGORY

        |--------------------------------------------------------------------------

        */



        if (categories.length > 0) {



          const firstCategory =

            categories[0];



          setActiveCategory(

            firstCategory.categoryName ||

              firstCategory.category_name ||

              firstCategory.name ||

              ""

          );



        }





      } catch (error) {



        console.error(

          "NewSale menu loading error:",

          error

        );





        if (!cancelled) {



          setMenuError(

            error?.message ||

              "Unable to load the BigBrew menu."

          );



        }



      } finally {



        if (!cancelled) {

          setMenuLoading(false);

        }



      }



    };





    loadMenu();





    return () => {

      cancelled = true;

    };



  }, []);





  /* =======================================================

     NORMALIZE CATEGORIES

     ======================================================= */



  const categories = useMemo(() => {



    return menuData.categories.map(

      (category) => ({



        id:

          Number(

            category.categoryId ??

              category.category_id ??

              category.id ??

              0

          ),



        code:

          category.categoryCode ??

            category.category_code ??

            category.code ??

            "",



        name:

          category.categoryName ??

            category.category_name ??

            category.name ??

            "",



      })

    );



  }, [menuData.categories]);





  /* =======================================================

     NORMALIZE PRODUCTS

     ======================================================= */



  const products = useMemo(() => {



    return menuData.products.map(

      (product) => {



        const rawSizes =

          Array.isArray(product.sizes)

            ? product.sizes

            : [];





        const sizes =

          rawSizes.map((size) => ({



            productSizeId:

              Number(

                size.productSizeId ??

                  size.product_size_id ??

                  size.id ??

                  0

              ),



            productSizeCode:

              size.productSizeCode ??

                size.product_size_code ??

                size.code ??

                "",



            sizeName:

              size.sizeName ??

                size.size_name ??

                size.name ??

                "",



            price:

              Number(

                size.price || 0

              ),



            available:

              size.available !== false,



          }));





        return {



          id:

            Number(

              product.productId ??

                product.product_id ??

                product.id ??

                0

            ),



          productId:

            Number(

              product.productId ??

                product.product_id ??

                product.id ??

                0

            ),



          productCode:

            product.productCode ??

              product.product_code ??

              "",



          name:

            product.productName ??

              product.product_name ??

              product.name ??

              "",



          description:

            product.description || "",



          categoryId:

            Number(

              product.categoryId ??

                product.category_id ??

                0

            ),



          categoryCode:

            product.categoryCode ??

              product.category_code ??

              "",



          category:

            product.categoryName ??

              product.category_name ??

              product.category ??

              "",



          available:

            product.available !== false,



          sizes,



        };



      }

    );



  }, [menuData.products]);





  /* =======================================================

     NORMALIZE ADDONS

     ======================================================= */



  const addons = useMemo(() => {



    return menuData.addons.map(

      (addon) => ({



        id:

          Number(

            addon.addonId ??

              addon.addon_id ??

              addon.id ??

              0

          ),



        addonId:

          Number(

            addon.addonId ??

              addon.addon_id ??

              addon.id ??

              0

          ),



        addonCode:

          addon.addonCode ??

            addon.addon_code ??

            addon.code ??

            "",



        name:

          addon.addonName ??

            addon.addon_name ??

            addon.name ??

            "",



        price:

          Number(

            addon.price ??

              addon.addonPrice ??

              addon.addon_price ??

              0

          ),



      })

    );



  }, [menuData.addons]);





  /* =======================================================

     FILTERED PRODUCTS

     ======================================================= */



  const filteredProducts = useMemo(() => {



    const keyword =

      search.trim().toLowerCase();





    return products.filter(

      (product) => {



        const categoryMatch =

          !activeCategory ||

          product.category ===

            activeCategory;





        const searchMatch =

          !keyword ||

          product.name

            .toLowerCase()

            .includes(keyword);





        return (

          categoryMatch &&

          searchMatch &&

          product.sizes.length > 0

        );



      }

    );



  }, [

    products,

    activeCategory,

    search,

  ]);





  /* =======================================================

     TOTALS

     ======================================================= */



  const subtotal = useMemo(() => {



    return order.reduce(

      (sum, item) =>

        sum + Number(item.total || 0),

      0

    );



  }, [order]);





  const total = subtotal;





  const received =

    Number(amountReceived) || 0;





  const change =

    paymentMethod === "CASH"

      ? Math.max(

          received - total,

          0

        )

      : 0;





  const canComplete =

    order.length > 0 &&

    !submitting &&

    (

      paymentMethod !== "CASH" ||

      received >= total

    );





  /* =======================================================

     OPEN PRODUCT

     ======================================================= */



  const openProduct = (product) => {



    const availableSizes =

      (product.sizes || []).filter(

        (size) =>

          size.available !== false

      );





    if (!availableSizes.length) {



      alert(

        "This product currently has no available size."

      );



      return;



    }





    setSelectedProduct(product);





    /*

    |--------------------------------------------------------------------------

    | IMPORTANT

    |--------------------------------------------------------------------------

    |

    | Store the REAL product_size_id.

    |

    */



    setSelectedSizeId(

      availableSizes[0].productSizeId

    );





    setSugarLevel("100%");



    setSelectedAddons([]);



  };





  /* =======================================================

     SELECTED SIZE

     ======================================================= */



  const selectedSize = useMemo(() => {



    if (!selectedProduct) {

      return null;

    }





    return (

      selectedProduct.sizes.find(

        (size) =>

          Number(size.productSizeId) ===

          Number(selectedSizeId)

      ) || null

    );



  }, [

    selectedProduct,

    selectedSizeId,

  ]);





  /* =======================================================

     TOGGLE ADDON

     ======================================================= */



  const toggleAddon = (addonId) => {



    setSelectedAddons(

      (current) => {



        const exists =

          current.includes(addonId);





        if (exists) {



          return current.filter(

            (id) =>

              id !== addonId

          );



        }





        return [

          ...current,

          addonId,

        ];



      }

    );



  };





  /* =======================================================

     ADD PRODUCT TO CART

     ======================================================= */



  const addProductToOrder = () => {



    if (!selectedProduct) {

      return;

    }





    if (!selectedSize) {



      alert(

        "Please select a size."

      );



      return;



    }





    const selectedAddonObjects =

      addons.filter(

        (addon) =>

          selectedAddons.includes(

            addon.id

          )

      );





    const addonTotal =

      selectedAddonObjects.reduce(

        (sum, addon) =>

          sum + Number(addon.price || 0),

        0

      );





    const unitPrice =

      Number(selectedSize.price || 0);





    const itemTotal =

      unitPrice +

      addonTotal;





    const newItem = {



      lineId:

        createLineId(),



      productId:

        Number(

          selectedProduct.productId

        ),



      productCode:

        selectedProduct.productCode,



      productSizeId:

        Number(

          selectedSize.productSizeId

        ),



      productSizeCode:

        selectedSize.productSizeCode,



      name:

        selectedProduct.name,



      category:

        selectedProduct.category,



      size:

        selectedSize.sizeName,



      sugar:

        sugarLevel,



      addons:

        selectedAddonObjects.map(

          (addon) => ({



            addonId:

              Number(addon.addonId),



            addonCode:

              addon.addonCode,



            name:

              addon.name,



            price:

              Number(addon.price || 0),



          })

        ),



      unitPrice,



      addonTotal,



      total:

        itemTotal,



      quantity: 1,



    };





    setOrder(

      (current) => [

        ...current,

        newItem,

      ]

    );





    setSelectedProduct(null);

    setSelectedSizeId(null);

    setSelectedAddons([]);

    setSugarLevel("100%");



  };





  /* =======================================================

     UPDATE QUANTITY

     ======================================================= */



  const updateQuantity = (

    lineId,

    amount

  ) => {



    setOrder(

      (current) =>



        current



          .map((item) => {



            if (

              item.lineId !== lineId

            ) {



              return item;



            }





            const quantity =

              Math.max(

                0,

                item.quantity +

                  amount

              );





            const unitTotal =

              Number(

                item.unitPrice || 0

              ) +

              Number(

                item.addonTotal || 0

              );





            return {



              ...item,



              quantity,



              total:

                unitTotal *

                quantity,



            };



          })



          .filter(

            (item) =>

              item.quantity > 0

          )



    );



  };





  /* =======================================================

     REMOVE ITEM

     ======================================================= */



  const removeItem = (lineId) => {



    setOrder(

      (current) =>

        current.filter(

          (item) =>

            item.lineId !== lineId

        )

    );



  };





  /* =======================================================

     COMPLETE SALE

     ======================================================= */



  const completeSale = async () => {

    if (!order.length) {
      alert("Please add at least one item.");
      return;
    }

    if (paymentMethod === "CASH" && received < total) {
      alert(`Insufficient payment. Remaining balance: ${money(total - received)}`);
      return;
    }

    if (submitting) return;

    const isBrowserOffline = !navigator.onLine;

    if (isBrowserOffline && paymentMethod !== "CASH") {
      alert("GCash and Maya payments require an online backend. Please connect to the backend before completing this payment.");
      return;
    }

    const orderItems = order.map((item) => ({
      product_size_id: Number(item.productSizeId),
      quantity: Number(item.quantity || 1),
      sugar_level: item.sugar || "100%",
      addons: (item.addons || []).map((addon) => ({
        addon_id: Number(addon.addonId),
        quantity: 1,
      })),
    }));

    const baseOrderData = {
      customer_name: customerName.trim() || "Walk-in Customer",
      items: orderItems,
      created_by: CURRENT_USER_ID,
    };

    const saveAsOffline = () => {
      if (paymentMethod !== "CASH") return false;

      const offlineReference = createOfflineReference();

      const offlineOrder = {
        id: offlineReference,
        offline_reference: offlineReference,
        number: offlineReference,
        name: customerName.trim() || "Walk-in Customer",
        customer_name: customerName.trim() || "Walk-in Customer",
        items: orderItems,
        original_items: [...order],
        created_by: CURRENT_USER_ID,
        payment_method: "Cash",
        amount: Number(total),
        amount_received: Number(received),
        change: Number(change),
        total: Number(total),
        created: new Date().toISOString(),
        status: "PENDING_SYNC",
      };

      if (!saveOfflineOrder(offlineOrder)) {
        alert("The sale could not be saved locally. Please try again.");
        return false;
      }

      setCompletedSale({
        saleNumber: offlineReference,
        saleCode: null,
        orderId: null,
        orderNumber: offlineReference,
        orderCode: null,
        paymentCode: null,
        customerName: customerName.trim() || "Walk-in Customer",
        items: [...order],
        subtotal: Number(total),
        total: Number(total),
        paymentMethod: "CASH",
        amountReceived: Number(received),
        change: Number(change),
        paymentStatus: "PENDING SYNC",
        orderStatus: "PENDING SYNC",
        offlineReference,
        createdAt: new Date().toLocaleString("en-PH"),
        offline: true,
      });

      setOrder([]);
      setCustomerName("");
      setAmountReceived("");
      return true;
    };

    if (isBrowserOffline) {
      saveAsOffline();
      return;
    }

    try {
      setSubmitting(true);

      const orderResponse = await fetch(`${API_BASE}/Api/Orders/Create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(baseOrderData),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || "Unable to create the order.");
      }

      const createdOrder = orderData.data || {};
      const orderId = Number(createdOrder.order_id);

      if (!orderId) {
        throw new Error("The server did not return a valid order ID.");
      }

      const orderTotal = Number(createdOrder.total_amount ?? total);

      const paymentPayload = {
        order_id: orderId,
        payment_method: paymentMethodForApi(paymentMethod),
        amount: orderTotal,
        transaction_reference: null,
        created_by: CURRENT_USER_ID,
      };

      const paymentResponse = await fetch(`${API_BASE}/Api/Payments/Create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(paymentData.message || "Unable to process the payment.");
      }

      const payment = paymentData.data?.payment || {};
      const sale = paymentData.data?.sale || null;
      const finalOrder = paymentData.data?.order || createdOrder;

      setCompletedSale({
        saleNumber: sale?.sale_code || `SALE-${orderId}`,
        saleCode: sale?.sale_code || null,
        orderId,
        orderNumber: finalOrder?.order_number || createdOrder?.order_number || "",
        orderCode: finalOrder?.order_code || createdOrder?.order_code || "",
        paymentCode: payment?.payment_code || null,
        customerName: customerName.trim() || "Walk-in Customer",
        items: [...order],
        subtotal: orderTotal,
        total: orderTotal,
        paymentMethod,
        amountReceived: paymentMethod === "CASH" ? received : orderTotal,
        change: paymentMethod === "CASH" ? Math.max(received - orderTotal, 0) : 0,
        paymentStatus: payment?.payment_status || "PAID",
        orderStatus: finalOrder?.order_status || "CONFIRMED",
        createdAt: new Date().toLocaleString("en-PH"),
      });

    } catch (error) {
      console.error("BIGBREW SALE ERROR:", error);

      const isNetworkError = error instanceof TypeError || !navigator.onLine;

      if (isNetworkError && paymentMethod === "CASH") {
        const saved = saveAsOffline();
        if (saved) {
          alert("Backend connection was lost. The CASH sale was saved locally and is pending synchronization.");
        }
      } else {
        alert(error?.message || "Unable to complete the sale.");
      }
    } finally {
      setSubmitting(false);
    }
  };


const startNewSale = () => {



    setOrder([]);



    setCustomerName("");



    setAmountReceived("");



    setPaymentMethod("CASH");



    setCompletedSale(null);



    setSelectedProduct(null);



    setSelectedSizeId(null);



    setSelectedAddons([]);



    setSugarLevel("100%");



    setSearch("");



  };





  /* =======================================================

     PRINT RECEIPT

     ======================================================= */



  const printReceipt = () => {



    if (!completedSale) {

      return;

    }





    const receiptWindow =

      window.open(

        "",

        "_blank",

        "width=420,height=700"

      );





    if (!receiptWindow) {



      alert(

        "Please allow pop-ups to print the receipt."

      );



      return;



    }





    const itemRows =

      completedSale.items

        .map(

          (item) => {



            const addonText =

              (item.addons || [])

                .map(

                  (addon) =>

                    addon.name

                )

                .join(", ");





            const itemUnitTotal =

              Number(

                item.unitPrice || 0

              ) +

              Number(

                item.addonTotal || 0

              );





            return `

              <div class="item">

                <div>

                  <strong>

                    ${item.name}

                  </strong>



                  <small>

                    ${item.size || ""}

                    ${

                      item.sugar

                        ? ` • Sugar ${item.sugar}`

                        : ""

                    }

                  </small>



                  ${

                    addonText

                      ? `<small>+ ${addonText}</small>`

                      : ""

                  }

                </div>



                <div>

                  ${

                    item.quantity

                  } × ${money(

                    itemUnitTotal

                  )}

                </div>

              </div>

            `;



          }

        )

        .join("");





    receiptWindow.document.write(`



      <!DOCTYPE html>



      <html>



        <head>



          <title>

            ${completedSale.saleNumber}

          </title>



          <style>



            * {

              box-sizing: border-box;

            }



            body {

              margin: 0;

              padding: 24px;

              font-family: Arial, sans-serif;

              color: #3d2b20;

              background: white;

            }



            .receipt {

              width: 100%;

              max-width: 360px;

              margin: 0 auto;

            }



            .brand {

              text-align: center;

              margin-bottom: 18px;

            }



            .brand h1 {

              margin: 0;

              font-size: 25px;

              letter-spacing: 2px;

            }



            .brand p {

              margin: 4px 0;

              font-size: 11px;

              letter-spacing: 2px;

            }



            .line {

              border-top: 1px dashed #9b8067;

              margin: 14px 0;

            }



            .meta {

              font-size: 12px;

              line-height: 1.6;

            }



            .item {

              display: flex;

              justify-content: space-between;

              gap: 12px;

              padding: 8px 0;

              font-size: 13px;

            }



            .item small {

              display: block;

              color: #7d6a5b;

              margin-top: 2px;

            }



            .summary {

              font-size: 13px;

            }



            .summary div {

              display: flex;

              justify-content: space-between;

              margin: 8px 0;

            }



            .grand {

              font-size: 18px;

              font-weight: bold;

            }



            .footer {

              text-align: center;

              margin-top: 24px;

              font-size: 11px;

              color: #806d5d;

            }



            @media print {



              body {

                padding: 0;

              }



            }



          </style>



        </head>



        <body>



          <div class="receipt">



            <div class="brand">



              <h1>

                BIGBREW

              </h1>



              <p>

                SMART OPERATIONS

              </p>



            </div>





            <div class="meta">



              <strong>

                Sale No.:

              </strong>



              ${completedSale.saleNumber}



              <br />



              <strong>

                Order No.:

              </strong>



              ${completedSale.orderNumber}



              <br />



              <strong>

                Customer:

              </strong>



              ${completedSale.customerName}



              <br />



              <strong>

                Date:

              </strong>



              ${completedSale.createdAt}



            </div>





            <div class="line"></div>





            ${itemRows}





            <div class="line"></div>





            <div class="summary">



              <div>



                <span>

                  Subtotal

                </span>



                <strong>

                  ${money(

                    completedSale.subtotal

                  )}

                </strong>



              </div>





              <div class="grand">



                <span>

                  Total

                </span>



                <strong>

                  ${money(

                    completedSale.total

                  )}

                </strong>



              </div>





              <div>



                <span>

                  Payment

                </span>



                <strong>

                  ${

                    completedSale.paymentMethod

                  }

                </strong>



              </div>





              <div>



                <span>

                  Amount Received

                </span>



                <strong>

                  ${money(

                    completedSale.amountReceived

                  )}

                </strong>



              </div>





              <div>



                <span>

                  Change

                </span>



                <strong>

                  ${money(

                    completedSale.change

                  )}

                </strong>



              </div>



            </div>





            <div class="line"></div>





            <div class="footer">



              Thank you for choosing BigBrew!



              <br />



              Putatan, Muntinlupa City



            </div>



          </div>



        </body>



      </html>



    `);





    receiptWindow.document.close();



    receiptWindow.focus();





    setTimeout(() => {



      receiptWindow.print();



    }, 250);



  };





  /* =======================================================

     RENDER

     ======================================================= */



  return (



    <div className="new-sale-page">





      {/* ===================================================

          HEADER

      =================================================== */}



      <div className="sale-header">



        <div>



          <div className="sale-eyebrow">

            POINT OF SALE

          </div>



          <h1>

            Create a new sale

          </h1>



          <p>

            Build an order, collect payment,

            and send it to the central queue.

          </p>



        </div>



      </div>





      {/* ===================================================

          MAIN POS AREA

      =================================================== */}



      <div className="sale-layout">





        {/* =================================================

            PRODUCTS

        ================================================= */}



        <section className="products-panel">



          <div className="products-toolbar">





            {/* SEARCH */}



            <div className="search-box">



              <span className="search-icon">

                ⌕

              </span>



              <input

                type="text"

                placeholder="Search the menu..."

                value={search}

                onChange={(e) =>

                  setSearch(e.target.value)

                }

              />



            </div>





            {/* CATEGORIES */}



            <div className="category-tabs">



              {categories.map(

                (category) => (



                  <button

                    type="button"

                    key={category.id}

                    className={

                      activeCategory ===

                      category.name

                        ? "category-tab active"

                        : "category-tab"

                    }

                    onClick={() => {



                      setActiveCategory(

                        category.name

                      );



                      setSearch("");



                    }}

                  >



                    {category.name}



                  </button>



                )

              )}



            </div>



          </div>





          {/* PRODUCT SCROLL */}



          <div className="product-scroll">





            {menuLoading && (



              <div className="menu-loading">



                Loading menu from database...



              </div>



            )}





            {menuError && (



              <div className="menu-error">



                <strong>

                  Database connection error

                </strong>



                <p>

                  {menuError}

                </p>



                <button

                  type="button"

                  onClick={() =>

                    window.location.reload()

                  }

                >

                  Retry

                </button>



              </div>



            )}





            {!menuLoading &&

              !menuError && (



                <div className="product-grid">



                  {filteredProducts.map(

                    (product) => (



                      <button

                        type="button"

                        className="product-card"

                        key={product.id}

                        onClick={() =>

                          openProduct(product)

                        }

                      >



                        <div className="product-image">



                          <div className="drink-placeholder">



                            <div className="drink-cup">

                              ☕

                            </div>



                          </div>



                        </div>





                        <div className="product-info">



                          <h3>

                            {product.name}

                          </h3>



                          <p>

                            {product.category}

                          </p>



                          <strong>

                            From{" "}

                            {money(

                              getFirstPrice(

                                product

                              )

                            )}

                          </strong>



                        </div>



                      </button>



                    )

                  )}



                </div>



              )

            }





            {!menuLoading &&

              !menuError &&

              filteredProducts.length === 0 && (



                <div className="no-products">



                  <div>

                    ⌕

                  </div>



                  <h3>

                    No products found

                  </h3>



                  <p>

                    Try another search or category.

                  </p>



                </div>



              )}



          </div>



        </section>





        {/* =================================================

            CURRENT ORDER

        ================================================= */}



        <aside className="order-panel">





          {/* ORDER HEADER */}



          <div className="order-header">



            <div>



              <h2>

                Current order

              </h2>



              <span className="order-count">



                {order.reduce(

                  (sum, item) =>

                    sum +

                    Number(

                      item.quantity || 0

                    ),

                  0

                )}



              </span>



            </div>



          </div>





          {/* CUSTOMER */}



          <div className="customer-section">



            <label>

              Customer / Order name

            </label>



            <input

              type="text"

              placeholder="e.g. Maria"

              value={customerName}

              onChange={(e) =>

                setCustomerName(

                  e.target.value

                )

              }

            />



          </div>





          {/* ORDER ITEMS */}



          <div

            className={

              order.length === 0

                ? "order-items empty"

                : "order-items"

            }

          >



            {order.length === 0 ? (



              <div className="empty-order">



                <div className="empty-icon">

                  🛒

                </div>



                <h3>

                  Your order is empty

                </h3>



                <p>

                  Select a drink from the

                  menu to get started.

                </p>



              </div>



            ) : (



              order.map((item) => (



                <div

                  className="order-item"

                  key={item.lineId}

                >



                  <div className="order-item-info">



                    <strong>

                      {item.name}

                    </strong>



                    <small>



                      {item.size}



                      {item.sugar &&

                        ` • ${item.sugar}`}



                    </small>





                    {item.addons.length > 0 && (



                      <small>



                        +

                        {item.addons

                          .map(

                            (addon) =>

                              addon.name

                          )

                          .join(", ")}



                      </small>



                    )}





                    <span>

                      {money(item.total)}

                    </span>



                  </div>





                  {/* QUANTITY */}



                  <div className="quantity-control">



                    <button

                      type="button"

                      onClick={() =>

                        updateQuantity(

                          item.lineId,

                          -1

                        )

                      }

                    >

                      −

                    </button>



                    <span>

                      {item.quantity}

                    </span>



                    <button

                      type="button"

                      onClick={() =>

                        updateQuantity(

                          item.lineId,

                          1

                        )

                      }

                    >

                      +

                    </button>



                  </div>





                  {/* REMOVE */}



                  <button

                    type="button"

                    className="remove-item"

                    onClick={() =>

                      removeItem(

                        item.lineId

                      )

                    }

                    title="Remove"

                  >

                    ×

                  </button>



                </div>



              ))



            )}



          </div>





          {/* =================================================

              PAYMENT

          ================================================= */}



          <div className="payment-section">





            <div className="summary-row">



              <span>

                Subtotal

              </span>



              <strong>

                {money(subtotal)}

              </strong>



            </div>





            <div className="summary-total">



              <span>

                Total due

              </span>



              <strong>

                {money(total)}

              </strong>



            </div>





            <label>

              Payment method

            </label>





            <select

              value={paymentMethod}

              onChange={(e) =>

                setPaymentMethod(

                  e.target.value

                )

              }

            >



              <option value="CASH">

                CASH

              </option>



              <option value="GCASH">

                GCASH

              </option>



              <option value="MAYA">

                MAYA

              </option>



            </select>





            {paymentMethod === "CASH" && (



              <>



                <label>

                  Amount received

                </label>



                <input

                  type="number"

                  min="0"

                  step="0.01"

                  placeholder="0.00"

                  value={amountReceived}

                  onChange={(e) =>

                    setAmountReceived(

                      e.target.value

                    )

                  }

                />





                <div className="change-box">



                  <span>

                    Change

                  </span>



                  <strong>

                    {money(change)}

                  </strong>



                </div>



              </>



            )}





            {/* ONLINE PAYMENT NOTICE */}



            {paymentMethod !== "CASH" && (



              <div

                className="payment-notice"

              >



                <strong>

                  {paymentMethod === "GCASH"

                    ? "GCash"

                    : "Maya"}{" "}

                  payment

                </strong>



                <span>

                  Payment amount:

                  {" "}

                  {money(total)}

                </span>



              </div>



            )}





            {/* COMPLETE */}



            <button

              type="button"

              className="complete-sale-btn"

              disabled={!canComplete}

              onClick={completeSale}

            >



              <span>



                {submitting

                  ? "Processing..."

                  : "Proceed with sale"}



              </span>



              <span className="arrow">

                →

              </span>



            </button>



          </div>



        </aside>



      </div>





      {/* ===================================================

          PRODUCT CUSTOMIZATION MODAL

      =================================================== */}



      {selectedProduct && (



        <div

          className="modal-backdrop"

          onMouseDown={() =>

            setSelectedProduct(null)

          }

        >



          <div

            className="product-modal"

            onMouseDown={(e) =>

              e.stopPropagation()

            }

          >





            {/* MODAL HEADER */}



            <div className="modal-header">



              <div>



                <span>

                  {selectedProduct.category}

                </span>



                <h2>

                  {selectedProduct.name}

                </h2>



              </div>





              <button

                type="button"

                onClick={() =>

                  setSelectedProduct(null)

                }

              >

                ×

              </button>



            </div>





            {/* =================================================

                SIZE

            ================================================= */}



            <div className="modal-field">



              <label>

                Size

              </label>





              <div className="option-grid">



                {selectedProduct.sizes

                  .filter(

                    (size) =>

                      size.available !== false

                  )

                  .map((size) => (



                    <button

                      type="button"

                      key={

                        size.productSizeId

                      }

                      className={

                        Number(

                          selectedSizeId

                        ) ===

                        Number(

                          size.productSizeId

                        )

                          ? "option-btn selected"

                          : "option-btn"

                      }

                      onClick={() =>

                        setSelectedSizeId(

                          size.productSizeId

                        )

                      }

                    >



                      <span>

                        {size.sizeName}

                      </span>



                      <strong>

                        {money(

                          size.price

                        )}

                      </strong>



                    </button>



                  ))}



              </div>



            </div>





            {/* =================================================

                SUGAR

            ================================================= */}



            <div className="modal-field">



              <label>

                Sugar level

              </label>





              <div className="sugar-options">



                {[

                  "0%",

                  "25%",

                  "50%",

                  "75%",

                  "100%",

                ].map(

                  (level) => (



                    <button

                      type="button"

                      key={level}

                      className={

                        sugarLevel === level

                          ? "sugar-btn selected"

                          : "sugar-btn"

                      }

                      onClick={() =>

                        setSugarLevel(

                          level

                        )

                      }

                    >

                      {level}

                    </button>



                  )

                )}



              </div>



            </div>





            {/* =================================================

                ADD-ONS

            ================================================= */}



            <div className="modal-field">



              <label>

                Add-ons

              </label>





              {addons.length === 0 ? (



                <p>

                  No add-ons available.

                </p>



              ) : (



                <div className="addon-grid">



                  {addons.map(

                    (addon) => {



                      const selected =

                        selectedAddons.includes(

                          addon.id

                        );





                      return (



                        <button

                          type="button"

                          key={addon.id}

                          className={

                            selected

                              ? "addon-btn selected"

                              : "addon-btn"

                          }

                          onClick={() =>

                            toggleAddon(

                              addon.id

                            )

                          }

                        >



                          <span>

                            {addon.name}

                          </span>



                          <strong>

                            +{money(

                              addon.price

                            )}

                          </strong>



                        </button>



                      );



                    }

                  )}



                </div>



              )}



            </div>





            {/* =================================================

                ADD TO ORDER

            ================================================= */}



            <button

              type="button"

              className="add-to-order-btn"

              disabled={!selectedSize}

              onClick={

                addProductToOrder

              }

            >

              Add to order

            </button>





          </div>



        </div>



      )}





      {/* ===================================================

          RECEIPT MODAL

      =================================================== */}



      {completedSale && (



        <div className="modal-backdrop">



          <div className="receipt-modal">





            <div className="receipt-success">

              ✓

            </div>





            <h2>

              Sale completed

            </h2>





            <p>

              The transaction has been

              recorded successfully.

            </p>





            <div className="receipt-preview">





              <div className="receipt-brand">



                BIGBREW



                <span>

                  SMART OPERATIONS

                </span>



              </div>





              <div className="receipt-number">



                {completedSale.saleNumber}



              </div>





              <div className="receipt-divider" />





              {completedSale.items.map(

                (item) => (



                  <div

                    className="receipt-line"

                    key={item.lineId}

                  >



                    <span>



                      {item.quantity} ×{" "}



                      {item.name}



                      <small>



                        {item.size}



                        {item.sugar &&

                          ` • ${item.sugar}`}



                      </small>



                    </span>





                    <strong>

                      {money(

                        item.total

                      )}

                    </strong>



                  </div>



                )

              )}





              <div className="receipt-divider" />





              <div className="receipt-line">



                <span>

                  Total

                </span>



                <strong>

                  {money(

                    completedSale.total

                  )}

                </strong>



              </div>





              <div className="receipt-line">



                <span>

                  Payment

                </span>



                <strong>

                  {

                    completedSale.paymentMethod

                  }

                </strong>



              </div>





              {completedSale.paymentMethod ===

                "CASH" && (



                <div className="receipt-line">



                  <span>

                    Change

                  </span>



                  <strong>

                    {money(

                      completedSale.change

                    )}

                  </strong>



                </div>



              )}



            </div>





            <div className="receipt-actions">





              <button

                type="button"

                className="print-receipt-btn"

                onClick={

                  printReceipt

                }

              >

                🖨 Print receipt

              </button>





              <button

                type="button"

                className="new-sale-btn"

                onClick={

                  startNewSale

                }

              >

                Start new sale

              </button>





            </div>



          </div>



        </div>



      )}



    </div>



  );



}





export default NewSale;