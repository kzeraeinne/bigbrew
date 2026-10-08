const INVENTORY_KEY = "bigbrew_inventory";
const MOVEMENTS_KEY = "bigbrew_inventory_movements";

export function getInventory() {
  try {
    const saved = localStorage.getItem(INVENTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveInventory(inventory) {
  localStorage.setItem(
    INVENTORY_KEY,
    JSON.stringify(inventory)
  );
}

export function getInventoryMovements() {
  try {
    const saved = localStorage.getItem(MOVEMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveInventoryMovements(movements) {
  localStorage.setItem(
    MOVEMENTS_KEY,
    JSON.stringify(movements)
  );
}

export function setInitialInventory(initialInventory) {
  const existing = getInventory();

  if (existing.length === 0) {
    saveInventory(initialInventory);
    return initialInventory;
  }

  return existing;
}

export function deductInventory({
  ingredientName,
  quantity,
  unit,
  reference,
  user = "Owner",
}) {
  const inventory = getInventory();

  const index = inventory.findIndex(
    (item) =>
      item.name.toLowerCase().trim() ===
      ingredientName.toLowerCase().trim()
  );

  if (index === -1) {
    return {
      success: false,
      message: `Inventory item "${ingredientName}" was not found.`,
    };
  }

  const item = inventory[index];

  if (item.unit !== unit) {
    return {
      success: false,
      message: `Unit mismatch for "${ingredientName}".`,
    };
  }

  const newStock = Math.max(
    0,
    Number(item.available) - Number(quantity)
  );

  let newStatus = "IN STOCK";

  if (newStock <= 0) {
    newStatus = "OUT OF STOCK";
  } else if (newStock <= Number(item.reorder)) {
    newStatus = "LOW STOCK";
  }

  const updatedItem = {
    ...item,
    available: newStock,
    status: newStatus,
  };

  const updatedInventory = [...inventory];
  updatedInventory[index] = updatedItem;

  saveInventory(updatedInventory);

  const movements = getInventoryMovements();

  const movement = {
    id: `MOV-${Date.now()}`,
    date: new Date().toLocaleString(),
    item: item.name,
    type: "WASTE",
    quantity: `-${quantity} ${unit}`,
    reference,
    user,
  };

  saveInventoryMovements([
    movement,
    ...movements,
  ]);

  return {
    success: true,
    item: updatedItem,
    movement,
  };
}
