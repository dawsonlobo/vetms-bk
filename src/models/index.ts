export async function initializeModels() {
  await import("./users");
  await import("./patients");
  await import("./inventories");
  await import("./appointments");
  await import("./followUps");
  await import("./billings");
  await import("./payments");
}
