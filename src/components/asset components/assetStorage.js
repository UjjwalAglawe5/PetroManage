const KEY = "petromanage_assets";

export const getAssets = () =>
  JSON.parse(localStorage.getItem(KEY)) || [];

export const saveAssets = (assets) =>
  localStorage.setItem(KEY, JSON.stringify(assets));
