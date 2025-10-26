import localforage from "localforage";

// For saving and getting local data easily
export const saveData = async (key, data) => {
  await localforage.setItem(key, data);
};

export const getData = async (key) => {
  const data = await localforage.getItem(key);
  return data || [];
};
