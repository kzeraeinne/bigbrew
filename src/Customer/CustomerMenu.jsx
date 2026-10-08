import React, { useState } from "react";
import "./CustomerMenu.css";

const CATEGORIES = [
  "Milk Tea",
  "Iced Coffee",
  "Hot Coffee",
  "Fruit Tea",
  "Brosty",
  "Praf",
];

const ADDONS = [
  { name: "Pearl", price: 9 },
  { name: "Crystal", price: 9 },
  { name: "Cream Cheese", price: 9 },
  { name: "Cream Puff", price: 9 },
  { name: "Cheesecake", price: 9 },
  { name: "Crushed Oreo", price: 9 },
  { name: "Coffee Jelly", price: 9 },
  { name: "Whipped Cream", price: 9 },
];

const SUGAR_LEVELS = [
  "0%",
  "25%",
  "50%",
  "75%",
  "100%",
];

const PRODUCTS = [
  // ============================================================
  // MILK TEA
  // ============================================================

  {
    name: "Dark Choco",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Cookies & Cream",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Okinawa",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Wintermelon",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Cheesecake",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Matcha",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Chocolate",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Red Velvet",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Salted Caramel",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Choco Kisses",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Taro",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Strawberry",
    category: "Milk Tea",
    small: 29,
    large: 39,
  },

  // ============================================================
  // ICED COFFEE
  // ============================================================

  {
    name: "Brusko",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Mocha",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Macchiato",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Vanilla",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Caramel",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Matcha",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Fudge",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },
  {
    name: "Spanish Latte",
    category: "Iced Coffee",
    small: 29,
    large: 39,
  },

  // ============================================================
  // HOT COFFEE
  // ============================================================

  {
    name: "Brusko",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Mocha",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Macchiato",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Vanilla",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Caramel",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Matcha",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Fudge",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },
  {
    name: "Spanish Latte",
    category: "Hot Coffee",
    small: 39,
    large: 39,
  },

  // ============================================================
  // FRUIT TEA
  // ============================================================

  {
    name: "Lychee",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Green Apple",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Blueberry",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Lemon",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Strawberry",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Kiwi",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Mango",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },
  {
    name: "Honey Peach",
    category: "Fruit Tea",
    small: 29,
    large: 39,
  },

  // ============================================================
  // BROSTY
  // ============================================================

  {
    name: "Lychee",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Green Apple",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Blueberry",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Lemon",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Strawberry",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Kiwi",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Mango",
    category: "Brosty",
    small: 49,
    large: 59,
  },
  {
    name: "Honey Peach",
    category: "Brosty",
    small: 49,
    large: 59,
  },

  // ============================================================
  // PRAF
  // ============================================================

  {
    name: "Coffee Jelly",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Caramel Macchiato",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Mocha",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Vanilla Coffee",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Java Chip",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Cheesecake",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Cookies & Cream",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Creamy Avocado",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Chocolate",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Matcha",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Strawberry",
    category: "Praf",
    small: 49,
    large: 59,
  },
  {
    name: "Taro",
    category: "Praf",
    small: 49,
    large: 59,
  },
];

function CustomerMenu({ onProceedToCheckout }) {
  const [activeCategory, setActiveCategory] =
    useState("Milk Tea");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [size, setSize] =
    useState("small");

  const [sugar, setSugar] =
    useState("50%");

  const [selectedAddons, setSelectedAddons] =
    useState([]);

  const [quantity, setQuantity] =
    useState(1);

  const [cart, setCart] =
    useState([]);

  const [showCart, setShowCart] =
    useState(false);

  const products = PRODUCTS.filter(
    (product) =>
      product.category === activeCategory
  );

  // ============================================================
  // OPEN PRODUCT
  // ============================================================

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSize("small");
    setSugar("50%");
    setSelectedAddons([]);
    setQuantity(1);
  };

  // ============================================================
  // CLOSE PRODUCT
  // ============================================================

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  // ============================================================
  // TOGGLE ADD-ON
  // ============================================================

  const toggleAddon = (addon) => {
    setSelectedAddons((current) => {
      const exists = current.some(
        (item) =>
          item.name === addon.name
      );

      if (exists) {
        return current.filter(
          (item) =>
            item.name !== addon.name
        );
      }

      return [...current, addon];
    });
  };

  // ============================================================
  // CURRENT PRICE
  // ============================================================

  const getCurrentPrice = () => {
    if (!selectedProduct) {
      return 0;
    }

    const basePrice =
      size === "large"
        ? selectedProduct.large
        : selectedProduct.small;

    const addonTotal =
      selectedAddons.reduce(
        (total, addon) =>
          total + addon.price,
        0
      );

    return basePrice + addonTotal;
  };

  // ============================================================
  // ADD TO CART
  // ============================================================

  const addToCart = () => {
    if (!selectedProduct) {
      return;
    }

    const unitPrice =
      getCurrentPrice();

    const cartItem = {
      id: Date.now(),

      product:
        selectedProduct.name,

      category:
        selectedProduct.category,

      size,

      sugar,

      addons:
        selectedAddons,

      quantity,

      unitPrice,

      total:
        unitPrice * quantity,
    };

    setCart((current) => [
      ...current,
      cartItem,
    ]);

    setSelectedProduct(null);
  };

  // ============================================================
  // REMOVE FROM CART
  // ============================================================

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // ============================================================
  // CART TOTAL
  // ============================================================

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total + item.total,
      0
    );

  const cartItemCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // ============================================================
  // PROCEED TO CHECKOUT
  // ============================================================

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    setShowCart(false);

    if (onProceedToCheckout) {
      onProceedToCheckout(cart);
    }
  };

  return (
    <div className="customer-menu-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="customer-menu-header">

        <div className="customer-brand">
          <span className="customer-brand-name">
            BIGBREW
          </span>

          <span className="customer-brand-subtitle">
            Putatan, Muntinlupa City
          </span>
        </div>

        <button
          type="button"
          className="customer-cart-button"
          onClick={() =>
            setShowCart(true)
          }
        >
          <span className="customer-cart-icon">
            🛒
          </span>

          <span>
            Cart
          </span>

          {cartItemCount > 0 && (
            <span className="customer-cart-count">
              {cartItemCount}
            </span>
          )}
        </button>

      </header>


      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="customer-menu-hero">

        <div>

          <span className="customer-hero-label">
            WELCOME TO BIGBREW
          </span>

          <h1>
            What would you like
            <br />
            to drink today?
          </h1>

          <p>
            Choose your favorite drink,
            customize it, and place your
            order.
          </p>

        </div>

      </section>


      {/* ======================================================
          CATEGORY NAVIGATION
      ====================================================== */}

      <div className="customer-category-wrapper">

        <div className="customer-category-list">

          {CATEGORIES.map(
            (category) => (

              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "customer-category active"
                    : "customer-category"
                }
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >
                {category}
              </button>

            )
          )}

        </div>

      </div>


      {/* ======================================================
          PRODUCT GRID
      ====================================================== */}

      <main className="customer-menu-content">

        <div className="customer-section-heading">

          <div>
            <span>
              OUR MENU
            </span>

            <h2>
              {activeCategory}
            </h2>
          </div>

          <p>
            {products.length} choices
          </p>

        </div>


        <div className="customer-product-grid">

          {products.map(
            (product) => (

              <button
                key={`${product.category}-${product.name}`}
                type="button"
                className="customer-product-card"
                onClick={() =>
                  openProduct(product)
                }
              >

                <div className="customer-product-image">
                  🥤
                </div>

                <div className="customer-product-info">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.category}
                  </p>

                  <div className="customer-product-price">

                    <span>
                      From
                    </span>

                    <strong>
                      ₱{product.small}
                    </strong>

                  </div>

                </div>

                <div className="customer-product-arrow">
                  →
                </div>

              </button>

            )
          )}

        </div>

      </main>


      {/* ======================================================
          PRODUCT CUSTOMIZATION MODAL
      ====================================================== */}

      {selectedProduct && (

        <div className="customer-modal-overlay">

          <div className="customer-product-modal">

            <div className="customer-modal-header">

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
                className="customer-modal-close"
                onClick={closeProduct}
              >
                ×
              </button>

            </div>


            {/* ==================================================
                SIZE
            ================================================== */}

            <div className="customer-option-section">

              <div className="customer-option-title">

                <h3>
                  Size
                </h3>

              </div>


              <div className="customer-size-options">

                <button
                  type="button"
                  className={
                    size === "small"
                      ? "customer-size-option active"
                      : "customer-size-option"
                  }
                  onClick={() =>
                    setSize("small")
                  }
                >

                  <span>
                    Small
                  </span>

                  <strong>
                    ₱{selectedProduct.small}
                  </strong>

                </button>


                <button
                  type="button"
                  className={
                    size === "large"
                      ? "customer-size-option active"
                      : "customer-size-option"
                  }
                  onClick={() =>
                    setSize("large")
                  }
                >

                  <span>
                    Large
                  </span>

                  <strong>
                    ₱{selectedProduct.large}
                  </strong>

                </button>

              </div>

            </div>


            {/* ==================================================
                SUGAR LEVEL
            ================================================== */}

            <div className="customer-option-section">

              <div className="customer-option-title">

                <h3>
                  Sugar Level
                </h3>

              </div>

              <div className="customer-sugar-row">

                {SUGAR_LEVELS.map(
                  (level) => (

                    <button
                      key={level}
                      type="button"
                      className={
                        sugar === level
                          ? "customer-sugar active"
                          : "customer-sugar"
                      }
                      onClick={() =>
                        setSugar(level)
                      }
                    >
                      {level}
                    </button>

                  )
                )}

              </div>

            </div>


            {/* ==================================================
                ADD-ONS
            ================================================== */}

            <div className="customer-option-section">

              <div className="customer-option-title">

                <h3>
                  Add-ons
                </h3>

                <span>
                  +₱9 each
                </span>

              </div>

              <div className="customer-addon-list">

                {ADDONS.map(
                  (addon) => {

                    const selected =
                      selectedAddons.some(
                        (item) =>
                          item.name ===
                          addon.name
                      );

                    return (

                      <button
                        key={addon.name}
                        type="button"
                        className={
                          selected
                            ? "customer-addon selected"
                            : "customer-addon"
                        }
                        onClick={() =>
                          toggleAddon(
                            addon
                          )
                        }
                      >

                        <span>
                          {addon.name}
                        </span>

                        <span>
                          +₱{addon.price}
                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            </div>


            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div className="customer-option-section">

              <div className="customer-option-title">

                <h3>
                  Quantity
                </h3>

              </div>

              <div className="customer-quantity">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                >
                  −
                </button>

                <strong>
                  {quantity}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        current + 1
                    )
                  }
                >
                  +
                </button>

              </div>

            </div>


            {/* ==================================================
                MODAL FOOTER
            ================================================== */}

            <div className="customer-modal-footer">

              <div className="customer-modal-total">

                <span>
                  Total
                </span>

                <strong>
                  ₱
                  {getCurrentPrice() *
                    quantity}
                </strong>

              </div>

              <button
                type="button"
                className="customer-add-cart"
                onClick={addToCart}
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          CART MODAL
      ====================================================== */}

      {showCart && (

        <div className="customer-modal-overlay">

          <div className="customer-cart-modal">

            <div className="customer-cart-header">

              <div>

                <h2>
                  Your Order
                </h2>

                <p>
                  {cartItemCount} item
                  {cartItemCount !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={() =>
                  setShowCart(false)
                }
              >
                ×
              </button>

            </div>


            {cart.length === 0 ? (

              <div className="customer-empty-cart">

                <div>
                  🛒
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add a drink from the menu
                  to get started.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowCart(false)
                  }
                >
                  Browse Menu
                </button>

              </div>

            ) : (

              <>

                <div className="customer-cart-items">

                  {cart.map(
                    (item) => (

                      <div
                        className="customer-cart-item"
                        key={item.id}
                      >

                        <div className="customer-cart-item-icon">
                          🥤
                        </div>

                        <div className="customer-cart-item-info">

                          <h3>
                            {item.product}
                          </h3>

                          <p>
                            {item.size ===
                            "large"
                              ? "Large"
                              : "Small"}
                            {" · "}
                            Sugar{" "}
                            {item.sugar}
                          </p>

                          {item.addons.length >
                            0 && (

                            <p>
                              +
                              {item.addons
                                .map(
                                  (addon) =>
                                    addon.name
                                )
                                .join(
                                  ", "
                                )}
                            </p>

                          )}

                          <strong>
                            {item.quantity}
                            {" × "}
                            ₱
                            {item.unitPrice}
                          </strong>

                        </div>

                        <div className="customer-cart-item-right">

                          <strong>
                            ₱{item.total}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>


                <div className="customer-cart-footer">

                  <div className="customer-cart-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₱{cartTotal}
                    </strong>

                  </div>

                  <button
                    type="button"
                    className="customer-checkout-button"
                    onClick={
                      proceedToCheckout
                    }
                  >
                    Proceed to Order
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default CustomerMenu;
