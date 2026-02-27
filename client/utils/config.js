export const requestConfig = (method, data = null, token = null) => {
  const config = { method, headers: {} };

  if (data instanceof FormData) {
    config.body = data;
  } else if (data) {
    config.body = JSON.stringify(data);
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
export const getToLocalStorage = (value) => {
  const item = localStorage.getItem(value);

  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return item;
  }
};

export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeToLocalStorage = (value) => {
  localStorage.removeItem(value);
};
