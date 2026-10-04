import { useMemo, useState } from "react";
import "./Recipes.css";

const MILK_TEA_FLAVORS = [
  "Dark Choco",
  "Cookies & Cream",
  "Okinawa",
  "Wintermelon",
  "Cheesecake",
  "Matcha",
  "Chocolate",
  "Red Velvet",
  "Salted Caramel",
  "Choco Kisses",
  "Taro",
  "Strawberry",
];

const COFFEE_FLAVORS = [
  "Brusko",
  "Mocha",
  "Macchiato",
  "Vanilla",
  "Caramel",
  "Matcha",
  "Fudge",
  "Spanish Latte",
];

const FRUIT_TEA_FLAVORS = [
  "Lychee",
  "Green Apple",
  "Blueberry",
  "Lemon",
  "Strawberry",
  "Kiwi",
  "Mango",
  "Honey Peach",
];

const PRAF_FLAVORS = [
  "Coffee Jelly",
  "Caramel Macchiato",
  "Mocha",
  "Vanilla Coffee",
  "Java Chip",
  "Cheesecake",
  "Cookies & Cream",
  "Creamy Avocado",
  "Chocolate",
  "Matcha",
  "Strawberry",
  "Taro",
];

const ADD_ONS = [
  "Pearl",
  "Crystal",
  "Cream Cheese",
  "Cream Puff",
  "Cheesecake",
  "Crushed Oreo",
  "Coffee Jelly",
  "Whipped Cream",
];

const PRODUCTS = [
  ...MILK_TEA_FLAVORS.map((flavor) => ({
    id: `milk-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `Milk Tea — ${flavor}`,
    category: "Milk Tea",
    type: "Milk Tea",
    regular: 29,
    large: 39,
  })),

  ...COFFEE_FLAVORS.flatMap((flavor) => [
    {
      id: `iced-coffee-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: `Iced Coffee — ${flavor}`,
      category: "Coffee",
      type: "Iced Coffee",
      regular: 39,
      large: 49,
    },
    {
      id: `hot-coffee-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: `Hot Coffee — ${flavor}`,
      category: "Coffee",
      type: "Hot Coffee",
      regular: 39,
      large: 49,
    },
  ]),

  ...FRUIT_TEA_FLAVORS.map((flavor) => ({
    id: `fruit-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `Fruit Tea — ${flavor}`,
    category: "Fruit Tea",
    type: "Fruit Tea",
    regular: 29,
    large: 39,
  })),

  ...FRUIT_TEA_FLAVORS.map((flavor) => ({
    id: `brosty-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `Brosty — ${flavor}`,
    category: "Brosty",
    type: "Brosty",
    regular: 49,
    large: 59,
  })),

  ...PRAF_FLAVORS.map((flavor) => ({
    id: `praf-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `Praf — ${flavor}`,
    category: "Praf",
    type: "Praf",
    regular: 49,
    large: 59,
  })),
];

const BASE_INGREDIENTS = [
  {
    name: "Milk Tea Base",
    category: "Milk Tea Bases",
    unit: "g",
    cost: 0.04,
    quantity: 10,
  },
  {
    name: "Tea Component",
    category: "Tea Components",
    unit: "g",
    cost: 0.03,
    quantity: 10,
  },
  {
    name: "Milk / Cream Component",
    category: "Milk / Cream Components",
    unit: "ml",
    cost: 0.05,
    quantity: 10,
  },
  {
    name: "Sugar / Sweetener",
    category: "Sweeteners",
    unit: "g",
    cost: 0.02,
    quantity: 10,
  },
  {
    name: "Ice",
    category: "Ice",
    unit: "g",
    cost: 0.01,
    quantity: 40,
  },
  {
    name: "Small Cup",
    category: "Cups",
    unit: "pcs",
    cost: 0.30,
    quantity: 1,
  },
  {
    name: "Large Cup",
    category: "Cups",
    unit: "pcs",
    cost: 0.35,
    quantity: 1,
  },
  {
    name: "Lid",
    category: "Lids",
    unit: "pcs",
    cost: 0.30,
    quantity: 1,
  },
  {
    name: "Straw",
    category: "Straws",
    unit: "pcs",
    cost: 0.20,
    quantity: 1,
  },
];

const CATEGORY_INGREDIENTS = {
  "Milk Tea": {
    base: {
      name: "Milk Tea Base",
      category: "Milk Tea Bases",
      unit: "g",
      cost: 0.04,
      quantity: 10,
    },
    flavorCategory: "Milk Tea Flavors / Syrups",
  },

  Coffee: {
    base: {
      name: "Coffee Component",
      category: "Coffee Bases",
      unit: "g",
      cost: 0.08,
      quantity: 10,
    },
    flavorCategory: "Coffee Flavors / Syrups",
  },

  "Fruit Tea": {
    base: {
      name: "Fruit Tea Base",
      category: "Fruit Tea Bases",
      unit: "ml",
      cost: 0.05,
      quantity: 20,
    },
    flavorCategory: "Fruit Tea Flavors / Syrups",
  },

  Brosty: {
    base: {
      name: "Brosty Base",
      category: "Brosty Components",
      unit: "ml",
      cost: 0.06,
      quantity: 40,
    },
    flavorCategory: "Fruit Tea Flavors / Syrups",
  },

  Praf: {
    base: {
      name: "Praf Base",
      category: "Praf Components",
      unit: "g",
      cost: 0.08,
      quantity: 30,
    },
    flavorCategory: "Praf Components",
  },
};

function createInitialRecipe(product) {
  const categoryData = CATEGORY_INGREDIENTS[product.category];

  const flavorName = product.name.split(" — ")[1] || product.name;

  const rows = [
    categoryData.base,
    {
      name: `${flavorName} Flavor`,
      category: categoryData.flavorCategory,
      unit: product.category === "Coffee" ? "ml" : "ml",
      cost: product.category === "Praf" ? 0.15 : 0.12,
      quantity: 10,
    },
    {
      name: "Sugar / Sweetener",
      category: "Sweeteners",
      unit: "g",
      cost: 0.02,
      quantity: 10,
    },
  ];

  if (product.category === "Coffee") {
    rows.push({
      name: "Coffee Component",
      category: "Coffee Bases",
      unit: "g",
      cost: 0.08,
      quantity: 10,
    });
  }

  if (product.type !== "Hot Coffee") {
    rows.push({
      name: "Ice",
      category: "Ice",
      unit: "g",
      cost: 0.01,
      quantity: 40,
    });
  }

  return [
    ...rows,
    {
      name: product.type === "Hot Coffee" ? "Hot Coffee Cup" : "Small Cup",
      category: "Cups",
      unit: "pcs",
      cost: product.type === "Hot Coffee" ? 0.35 : 0.30,
      quantity: 1,
    },
    {
      name: "Lid",
      category: "Lids",
      unit: "pcs",
      cost: 0.30,
      quantity: 1,
    },
    {
      name: "Straw",
      category: "Straws",
      unit: "pcs",
      cost: 0.20,
      quantity: 1,
    },
  ];
}

function formatMoney(value) {
  return `₱${value.toFixed(2)}`;
}

function Recipes() {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [recipes, setRecipes] = useState({});
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  const selectedProduct =
    PRODUCTS.find((product) => product.id === selectedProductId) ||
    PRODUCTS[0];

  const currentRows = recipes[selectedProductId] || createInitialRecipe(selectedProduct);

  const recipeCost = useMemo(() => {
    return currentRows.reduce(
      (total, item) => total + item.quantity * item.cost,
      0
    );
  }, [currentRows]);

  const grossMargin = selectedProduct.regular - recipeCost;

  const updateRows = (rows) => {
    setRecipes((previous) => ({
      ...previous,
      [selectedProductId]: rows,
    }));
  };

  const updateQuantity = (index, value) => {
    const parsed = Number(value);

    const rows = currentRows.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            quantity:
              Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
          }
        : item
    );

    updateRows(rows);
  };

  const removeIngredient = (index) => {
    updateRows(currentRows.filter((_, itemIndex) => itemIndex !== index));
  };

  const addIngredient = (event) => {
    event.preventDefault();

    if (!ingredientName.trim()) return;

    const existing = BASE_INGREDIENTS.find(
      (item) => item.name.toLowerCase() === ingredientName.toLowerCase()
    );

    const newIngredient = existing
      ? {
          ...existing,
          quantity: Number(quantity) || 1,
        }
      : {
          name: ingredientName.trim(),
          category: "Other Ingredients",
          unit: "pcs",
          cost: 0,
          quantity: Number(quantity) || 1,
        };

    updateRows([...currentRows, newIngredient]);

    setIngredientName("");
    setQuantity("1");
    setNotes("");
  };

  const deactivateRecipe = () => {
    alert(
      `${selectedProduct.name} recipe can be deactivated here once backend recipe status is connected.`
    );
  };

  return (
    <div className="recipes-page">
      <div className="recipes-eyebrow">RECIPE MANAGEMENT</div>

      <div className="recipes-header">
        <div>
          <h1>Recipes</h1>
          <p>
            Configure product-specific ingredients, quantities, and recipe
            costs.
          </p>
        </div>

        <div className="recipes-header-badge">
          OWNER CONTROL
        </div>
      </div>

      <div className="recipes-notice">
        <strong>Recipe-driven inventory</strong>
        <span>
          Ingredients listed here are used to calculate product cost and will
          be used for automatic inventory deduction when completed sales are
          connected.
        </span>
      </div>

      <section className="recipe-card">
        <div className="recipe-product-header">
          <div className="recipe-product-selector">
            <label>Select a product</label>

            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
            >
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="recipe-summary">
            <div>
              <span>REGULAR / HOT PRICE</span>
              <strong>{formatMoney(selectedProduct.regular)}</strong>
            </div>

            <div>
              <span>LARGE PRICE</span>
              <strong>{formatMoney(selectedProduct.large)}</strong>
            </div>

            <div>
              <span>EST. RECIPE COST</span>
              <strong>{formatMoney(recipeCost)}</strong>
            </div>

            <div>
              <span>EST. GROSS MARGIN</span>
              <strong>{formatMoney(grossMargin)}</strong>
            </div>
          </div>
        </div>

        <div className="recipe-meta">
          <div>
            <span>Recipe ID</span>
            <strong>
              {selectedProduct.id}-v1
            </strong>
          </div>

          <div>
            <span>Effective</span>
            <strong>Current</strong>
          </div>

          <div className="recipe-status">
            <span className="status-dot-small" />
            ACTIVE
          </div>

          <button
            type="button"
            className="recipe-deactivate"
            onClick={deactivateRecipe}
          >
            Deactivate recipe
          </button>
        </div>

        <div className="recipe-table-wrap">
          <table className="recipe-table">
            <thead>
              <tr>
                <th>INGREDIENT</th>
                <th>CATEGORY</th>
                <th>QUANTITY REQUIRED</th>
                <th>UNIT</th>
                <th>UNIT COST</th>
                <th>EST. COST</th>
                <th>NOTES</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {currentRows.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>

                  <td>{item.category}</td>

                  <td>
                    <input
                      className="quantity-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(index, event.target.value)
                      }
                    />
                  </td>

                  <td>{item.unit}</td>

                  <td>{formatMoney(item.cost)}</td>

                  <td>
                    <strong>
                      {formatMoney(item.quantity * item.cost)}
                    </strong>
                  </td>

                  <td>
                    <span className="recipe-note">
                      {notes || "Configured"}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="remove-ingredient"
                      onClick={() => removeIngredient(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="add-recipe-row" onSubmit={addIngredient}>
          <div>
            <label>Ingredient</label>

            <input
              list="recipe-ingredients"
              value={ingredientName}
              onChange={(event) => setIngredientName(event.target.value)}
              placeholder="Select or enter ingredient"
            />

            <datalist id="recipe-ingredients">
              {BASE_INGREDIENTS.map((ingredient) => (
                <option key={ingredient.name} value={ingredient.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label>Quantity per drink</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          <div>
            <label>Notes</label>

            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional"
            />
          </div>

          <button type="submit" className="add-recipe-button">
            + Add
          </button>
        </form>

        <div className="recipe-packaging">
          <h3>Size-specific packaging</h3>

          <div className="packaging-grid">
            <div>
              <strong>Regular</strong>
              <span>Small Cup + Lid + Straw</span>
            </div>

            <div>
              <strong>Large</strong>
              <span>Large Cup + Lid + Straw</span>
            </div>

            <div>
              <strong>Hot Coffee</strong>
              <span>Hot Coffee Cup + Lid + Sleeve</span>
            </div>
          </div>
        </div>

        <div className="recipe-footer-note">
          Add-ons such as Pearl, Crystal, Cream Cheese, Cream Puff, Cheesecake,
          Crushed Oreo, Coffee Jelly, and Whipped Cream are maintained
          separately and deducted according to their own configured quantities.
        </div>
      </section>
    </div>
  );
}

export default Recipes;
