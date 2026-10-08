const STORAGE_KEY = "bigbrew_waste_records";

export function getWasteRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveWasteRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function submitWaste(wasteData) {
  const records = getWasteRecords();

  const newRecord = {
    id: `WST-${Date.now()}`,
    ...wasteData,
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  };

  saveWasteRecords([newRecord, ...records]);

  return newRecord;
}

export function confirmWaste(id) {
  const records = getWasteRecords();

  const updated = records.map((record) =>
    record.id === id
      ? {
          ...record,
          status: "CONFIRMED",
          approvedAt: new Date().toISOString(),
        }
      : record
  );

  saveWasteRecords(updated);

  return updated;
}

export function rejectWaste(id) {
  const records = getWasteRecords();

  const updated = records.map((record) =>
    record.id === id
      ? {
          ...record,
          status: "REJECTED",
          rejectedAt: new Date().toISOString(),
        }
      : record
  );

  saveWasteRecords(updated);

  return updated;
}