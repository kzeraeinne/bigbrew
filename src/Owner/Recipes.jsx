import React, { useEffect, useMemo, useState } from "react";
import "./Recipes.css";

const API_BASE = "https://kzeraeinne.infinityfreeapp.com/bigbrew_api";

const EMPTY_FORM = {
  ingredient_id: "",
  quantity_required: "",
};

function Recipes() {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSize, setSelectedSize] = useState("Regular");

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState("");

  /* =========================================================
     LOAD ALL DATA
     ========================================================= */

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        productsResponse,
        recipesResponse,
        ingredientsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE}/Api/Products/List.php`),
        fetch(`${API_BASE}/Api/Recipes/List.php`),
        fetch(`${API_BASE}/Api/Ingredients/List.php`),
      ]);

      const productsJson = await productsResponse.json();
      const recipesJson = await recipesResponse.json();
      const ingredientsJson = await ingredientsResponse.json();

      if (!productsJson.success) {
        throw new Error(
          productsJson.message || "Failed to load products."
        );
      }

      if (!recipesJson.success) {
        throw new Error(
          recipesJson.message || "Failed to load recipes."
        );
      }

      if (!ingredientsJson.success) {
        throw new Error(
          ingredientsJson.message || "Failed to load ingredients."
        );
      }

      const loadedProducts =
        productsJson.data?.products || [];

      const loadedRecipes =
        recipesJson.data?.recipes || [];

      const loadedIngredients =
        ingredientsJson.data?.ingredients || [];

      setProducts(loadedProducts);
      setRecipes(loadedRecipes);
      setIngredients(loadedIngredients);

      /*
       * Automatically select first product.
       */
      if (
        loadedProducts.length > 0 &&
        !selectedProductId
      ) {
        setSelectedProductId(
          String(loadedProducts[0].product_id)
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to load recipe data."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     SELECTED PRODUCT
     ========================================================= */

  const selectedProduct = useMemo(() => {
    return products.find(
      (product) =>
        String(product.product_id) ===
        String(selectedProductId)
    );
  }, [products, selectedProductId]);


  /* =========================================================
     PRODUCT SIZE INFORMATION
     ========================================================= */
const selectedSizeInfo = useMemo(() => {
  if (!selectedProduct) {
    return null;
  }

  const sizes = Array.isArray(selectedProduct.sizes)
    ? selectedProduct.sizes
    : [];

  const wantedSize = selectedSize.toLowerCase();

  const sizeInfo = sizes.find((size) => {
    const sizeName = String(
      size.sizeName ||
      size.size_name ||
      ""
    ).toLowerCase();

    // Database/API uses Regular and Large.
    // Small is treated as Regular just in case.
    if (
      wantedSize === "regular" &&
      (sizeName === "regular" || sizeName === "small")
    ) {
      return true;
    }

    return sizeName === wantedSize;
  });

  if (!sizeInfo) {
    return {
      size: selectedSize,
      productSizeId: null,
      productSizeCode: "",
      price: 0,
      available: false,
    };
  }

  return {
    size: selectedSize,

    productSizeId:
      sizeInfo.productSizeId ??
      sizeInfo.product_size_id ??
      null,

    productSizeCode:
      sizeInfo.productSizeCode ??
      sizeInfo.product_size_code ??
      "",

    price: Number(
      sizeInfo.price ?? 0
    ),

    available:
      sizeInfo.available === true ||
      Number(sizeInfo.available) === 1,
  };
}, [selectedProduct, selectedSize]);

  /* =========================================================
     FIND RECIPE FOR SELECTED PRODUCT + SIZE
     ========================================================= */

  const selectedRecipe = useMemo(() => {
    if (!selectedSizeInfo?.productSizeId) {
      return null;
    }

    return recipes.find(
      (recipe) =>
        Number(recipe.product_size?.product_size_id) ===
        Number(selectedSizeInfo.productSizeId)
    ) || null;
  }, [recipes, selectedSizeInfo]);


  /* =========================================================
     LOAD INGREDIENT ROWS WHEN SELECTION CHANGES
     ========================================================= */

  useEffect(() => {
    if (selectedRecipe) {
      setRows(
        (selectedRecipe.ingredients || []).map(
          (ingredient) => ({
            ingredient_id:
              Number(ingredient.ingredient_id),

            ingredient_name:
              ingredient.ingredient_name,

            unit_of_measure:
              ingredient.unit_of_measure || "",

            quantity_required:
              Number(
                ingredient.quantity_required || 0
              ),

            recipe_ingredient_id:
              ingredient.recipe_ingredient_id,

            recipe_ingredient_code:
              ingredient.recipe_ingredient_code,
          })
        )
      );
    } else {
      setRows([]);
    }

    setIngredientId("");
    setQuantity("");
  }, [selectedRecipe]);


  /* =========================================================
     SIZE CHANGE
     ========================================================= */

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setError("");
    setSuccess("");
  };


  /* =========================================================
     PRODUCT CHANGE
     ========================================================= */

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);

    setSelectedSize("Regular");

    setRows([]);

    setIngredientId("");
    setQuantity("");

    setError("");
    setSuccess("");
  };


  /* =========================================================
     ADD INGREDIENT
     ========================================================= */

  const addIngredient = () => {
    setError("");
    setSuccess("");

    if (!ingredientId) {
      setError("Please select an ingredient.");
      return;
    }

    if (
      quantity === "" ||
      Number(quantity) <= 0
    ) {
      setError(
        "Please enter a quantity greater than zero."
      );
      return;
    }

    const selectedIngredient =
      ingredients.find(
        (ingredient) =>
          Number(ingredient.ingredient_id) ===
          Number(ingredientId)
      );

    if (!selectedIngredient) {
      setError("Ingredient not found.");
      return;
    }

    const alreadyExists = rows.some(
      (row) =>
        Number(row.ingredient_id) ===
        Number(ingredientId)
    );

    if (alreadyExists) {
      setError(
        "This ingredient is already in the recipe."
      );
      return;
    }

    const newRow = {
      ingredient_id:
        Number(selectedIngredient.ingredient_id),

      ingredient_name:
        selectedIngredient.ingredient_name,

      unit_of_measure:
        selectedIngredient.unit_of_measure || "",

      quantity_required:
        Number(quantity),
    };

    setRows((currentRows) => [
      ...currentRows,
      newRow,
    ]);

    setIngredientId("");
    setQuantity("");
  };


  /* =========================================================
     UPDATE INGREDIENT QUANTITY
     ========================================================= */

  const updateQuantity = (
    ingredientIdToUpdate,
    value
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (
          Number(row.ingredient_id) !==
          Number(ingredientIdToUpdate)
        ) {
          return row;
        }

        return {
          ...row,
          quantity_required:
            value === ""
              ? ""
              : Number(value),
        };
      })
    );
  };


  /* =========================================================
     REMOVE INGREDIENT
     ========================================================= */

  const removeIngredient = (ingredientIdToRemove) => {
    setRows((currentRows) =>
      currentRows.filter(
        (row) =>
          Number(row.ingredient_id) !==
          Number(ingredientIdToRemove)
      )
    );

    setError("");
    setSuccess("");
  };


  /* =========================================================
     VALIDATE ROWS
     ========================================================= */

  const validateRows = () => {
    if (rows.length === 0) {
      setError(
        "A recipe must contain at least one ingredient."
      );

      return false;
    }

    for (const row of rows) {
      if (
        !row.ingredient_id ||
        row.quantity_required === "" ||
        Number(row.quantity_required) <= 0
      ) {
        setError(
          "Every ingredient must have a valid quantity."
        );

        return false;
      }
    }

    return true;
  };


  /* =========================================================
     SAVE RECIPE
     ========================================================= */

  const saveRecipe = async () => {
    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    if (!selectedSizeInfo?.productSizeId) {
      setError(
        `The ${selectedSize} product size does not exist.`
      );

      return;
    }

    if (!validateRows()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        product_size_id:
          Number(selectedSizeInfo.productSizeId),

        ingredients: rows.map((row) => ({
          ingredient_id:
            Number(row.ingredient_id),

          quantity_required:
            Number(row.quantity_required),
        })),
      };

      let url = `${API_BASE}/Api/Recipes/Create.php`;
      let method = "POST";

      /*
       * If a recipe already exists, update it.
       * Otherwise create a new one.
       */

      if (selectedRecipe) {
        url =
          `${API_BASE}/Api/Recipes/Update.php`;

        method = "PUT";

        payload.recipe_id =
          Number(selectedRecipe.recipe_id);
      }

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
          "Failed to save recipe."
        );
      }

      setSuccess(
        selectedRecipe
          ? "Recipe updated successfully."
          : "Recipe created successfully."
      );

      /*
       * Reload everything so the UI reflects
       * the actual database state.
       */

      await loadPage();

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to save recipe."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     DELETE RECIPE
     ========================================================= */

  const deleteRecipe = async () => {
    if (!selectedRecipe) {
      setError(
        "There is no recipe to delete."
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete the ${selectedSize} recipe for ${selectedProduct?.product_name}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE}/Api/Recipes/Delete.php`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            recipe_id:
              Number(selectedRecipe.recipe_id),
          }),
        }
      );

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
          "Failed to delete recipe."
        );
      }

      setRows([]);

      setSuccess(
        "Recipe deleted successfully."
      );

      await loadPage();

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to delete recipe."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     RECIPE COST
     ========================================================= */

  const recipeCost = useMemo(() => {
    return rows.reduce((total, row) => {
      const ingredient =
        ingredients.find(
          (item) =>
            Number(item.ingredient_id) ===
            Number(row.ingredient_id)
        );

      if (!ingredient) {
        return total;
      }

      const unitCost =
        Number(
          ingredient.unit_cost ??
          ingredient.cost ??
          ingredient.ingredient_cost ??
          0
        );

      const quantity =
        Number(row.quantity_required || 0);

      return (
        total +
        unitCost * quantity
      );
    }, 0);
  }, [rows, ingredients]);


  /* =========================================================
     MARGIN
     ========================================================= */

  const estimatedMargin = useMemo(() => {
    const price =
      Number(
        selectedSizeInfo?.price || 0
      );

    return price - recipeCost;
  }, [selectedSizeInfo, recipeCost]);


  /* =========================================================
     INGREDIENT OPTIONS
     ========================================================= */

  const availableIngredients =
    useMemo(() => {
      return ingredients.filter(
        (ingredient) => {
          const active =
            ingredient.is_active === undefined ||
            Number(ingredient.is_active) === 1;

          const alreadyUsed =
            rows.some(
              (row) =>
                Number(row.ingredient_id) ===
                Number(
                  ingredient.ingredient_id
                )
            );

          return active && !alreadyUsed;
        }
      );
    }, [ingredients, rows]);


  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="recipes-page">
        <div className="recipe-empty-state">
          <p>Loading recipes...</p>
        </div>
      </div>
    );
  }


  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="recipes-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="recipe-page-header">

        <div>
          <div className="recipe-eyebrow">
            SMART OPERATIONS
          </div>

          <h1>Recipes</h1>

          <p>
            Manage ingredient requirements for
            every product size.
          </p>
        </div>

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="recipe-error-message">
          {error}
        </div>
      )}


      {/* =====================================================
          SUCCESS
          ===================================================== */}

      {success && (
        <div className="recipe-success-message">
          {success}
        </div>
      )}


      {/* =====================================================
          PRODUCT SELECTION
          ===================================================== */}

      <div className="recipe-card">

        <div className="recipe-card-header">

          <div>
            <h2>Recipe Setup</h2>

            <p>
              Select a product and size to manage
              its recipe.
            </p>
          </div>

        </div>


        <div className="recipe-form-grid">

          {/* PRODUCT */}

          <div className="recipe-form-group">

            <label>
              Product
            </label>

            <select
              value={selectedProductId}
              onChange={handleProductChange}
            >

              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.product_id}
                  value={product.product_id}
                >
                  {product.product_code} —{" "}
                  {product.product_name}
                </option>
              ))}

            </select>

          </div>


          {/* SIZE */}

          <div className="recipe-form-group">

            <label>
              Size
            </label>

            <div className="recipe-size-buttons">

              <button
                type="button"
                className={
                  selectedSize === "Regular"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleSizeChange("Regular")
                }
              >
                Regular
              </button>

              <button
                type="button"
                className={
                  selectedSize === "Large"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleSizeChange("Large")
                }
              >
                Large
              </button>

            </div>

          </div>

        </div>


        {/* ===================================================
            SELECTED PRODUCT INFORMATION
            =================================================== */}

        {selectedProduct && (
          <div className="recipe-product-summary">

            <div>

              <span className="recipe-summary-label">
                PRODUCT
              </span>

              <strong>
                {selectedProduct.product_name}
              </strong>

              <small>
                {selectedProduct.product_code}
              </small>

            </div>


            <div>

              <span className="recipe-summary-label">
                SIZE
              </span>

              <strong>
                {selectedSize}
              </strong>

              <small>
                {selectedSizeInfo?.productSizeCode ||
                  "No size code"}
              </small>

            </div>


            <div>

              <span className="recipe-summary-label">
                SELLING PRICE
              </span>

              <strong>
                ₱
                {Number(
                  selectedSizeInfo?.price || 0
                ).toFixed(2)}
              </strong>

            </div>


            <div>

              <span className="recipe-summary-label">
                AVAILABILITY
              </span>

              <strong
                className={
                  selectedSizeInfo?.available
                    ? "recipe-available"
                    : "recipe-unavailable"
                }
              >
                {selectedSizeInfo?.available
                  ? "Available"
                  : "Unavailable"}
              </strong>

            </div>

          </div>
        )}

      </div>


      {/* =====================================================
          RECIPE INFORMATION
          ===================================================== */}

      {selectedProduct && (
        <div className="recipe-card">

          <div className="recipe-card-header">

            <div>

              <h2>
                {selectedProduct.product_name}{" "}
                — {selectedSize}
              </h2>

              <p>
                {selectedRecipe
                  ? `Recipe ${selectedRecipe.recipe_code}`
                  : "No recipe created yet."}
              </p>

            </div>


            {selectedRecipe && (
              <div className="recipe-actions">

                <button
                  type="button"
                  className="recipe-delete-button"
                  onClick={deleteRecipe}
                  disabled={saving}
                >
                  Delete Recipe
                </button>

              </div>
            )}

          </div>


          {/* =================================================
              ADD INGREDIENT
              ================================================= */}

          <div className="recipe-add-row">

            <div className="recipe-form-group">

              <label>
                Ingredient
              </label>

              <select
                value={ingredientId}
                onChange={(event) =>
                  setIngredientId(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select ingredient
                </option>

                {availableIngredients.map(
                  (ingredient) => (
                    <option
                      key={
                        ingredient.ingredient_id
                      }
                      value={
                        ingredient.ingredient_id
                      }
                    >
                      {ingredient.ingredient_code
                        ? `${ingredient.ingredient_code} — `
                        : ""}
                      {ingredient.ingredient_name}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="recipe-form-group">

              <label>
                Quantity
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    event.target.value
                  )
                }
                placeholder="0"
              />

            </div>


            <div className="recipe-form-group">

              <label>
                Unit
              </label>

              <div className="recipe-unit-display">

                {ingredientId
                  ? (
                      ingredients.find(
                        (ingredient) =>
                          Number(
                            ingredient.ingredient_id
                          ) ===
                          Number(ingredientId)
                      )?.unit_of_measure ||
                      "—"
                    )
                  : "—"}

              </div>

            </div>


            <button
              type="button"
              className="recipe-add-button"
              onClick={addIngredient}
            >
              + Add Ingredient
            </button>

          </div>


          {/* =================================================
              INGREDIENT TABLE
              ================================================= */}

          <div className="recipe-table-wrapper">

            <table className="recipe-table">

              <thead>

                <tr>

                  <th>
                    Ingredient
                  </th>

                  <th>
                    Unit
                  </th>

                  <th>
                    Quantity Required
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {rows.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="recipe-empty-cell"
                    >
                      <div>
                        <strong>
                          No ingredients yet
                        </strong>

                        <small>
                          Add the ingredients
                          required to prepare
                          this product size.
                        </small>
                      </div>
                    </td>

                  </tr>

                ) : (

                  rows.map((row) => (

                    <tr
                      key={
                        row.ingredient_id
                      }
                    >

                      <td>

                        <div className="recipe-ingredient-name">

                          <strong>
                            {row.ingredient_name}
                          </strong>

                          {row.ingredient_code && (
                            <small>
                              {row.ingredient_code}
                            </small>
                          )}

                        </div>

                      </td>


                      <td>
                        {row.unit_of_measure ||
                          "—"}
                      </td>


                      <td>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            row.quantity_required
                          }
                          onChange={(event) =>
                            updateQuantity(
                              row.ingredient_id,
                              event.target.value
                            )
                          }
                          className="recipe-quantity-input"
                        />

                      </td>


                      <td>

                        <button
                          type="button"
                          className="recipe-remove-button"
                          onClick={() =>
                            removeIngredient(
                              row.ingredient_id
                            )
                          }
                        >
                          Remove
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              RECIPE SUMMARY
              ================================================= */}

          <div className="recipe-summary">

            <div>

              <span>
                Recipe Status
              </span>

              <strong>
                {selectedRecipe
                  ? "Configured"
                  : "Not Configured"}
              </strong>

            </div>


            <div>

              <span>
                Ingredients
              </span>

              <strong>
                {rows.length}
              </strong>

            </div>


            <div>

              <span>
                Estimated Cost
              </span>

              <strong>
                ₱
                {recipeCost.toFixed(2)}
              </strong>

            </div>


            <div>

              <span>
                Estimated Margin
              </span>

              <strong
                className={
                  estimatedMargin >= 0
                    ? "recipe-margin-positive"
                    : "recipe-margin-negative"
                }
              >
                ₱
                {estimatedMargin.toFixed(2)}
              </strong>

            </div>

          </div>


          {/* =================================================
              SAVE
              ================================================= */}

          <div className="recipe-footer">

            <div className="recipe-footer-note">

              {selectedRecipe
                ? "Changes will update the existing recipe."
                : "This will create a new recipe for this product size."}

            </div>


            <button
              type="button"
              className="recipe-save-button"
              onClick={saveRecipe}
              disabled={
                saving ||
                !selectedProduct ||
                !selectedSizeInfo?.productSizeId ||
                rows.length === 0
              }
            >
              {saving
                ? "Saving..."
                : selectedRecipe
                  ? "Save Changes"
                  : "Create Recipe"}
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          NO PRODUCTS
          ===================================================== */}

      {!selectedProduct &&
        products.length === 0 && (
          <div className="recipe-empty-state">

            <h3>
              No products available
            </h3>

            <p>
              Create a product first before
              creating a recipe.
            </p>

          </div>
        )}

    </div>
  );
}

export default Recipes;