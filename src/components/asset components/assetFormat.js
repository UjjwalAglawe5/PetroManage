export const toTitleCase = (str) =>
  str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export const normalizeAsset = (asset) => ({
  id: asset.id.toUpperCase(),
  name: toTitleCase(asset.name),
  type: asset.type.toUpperCase(),
  location: toTitleCase(asset.location),
  status: toTitleCase(asset.status),
  lastMaintenance: asset.lastMaintenance
});
