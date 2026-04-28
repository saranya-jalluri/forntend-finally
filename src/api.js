const localApiBase = "http://localhost:8081/api";
const productionApiBase = "https://backend-finally.onrender.com/api";

const defaultApiBase =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? localApiBase
    : productionApiBase;

const API_BASE = (process.env.REACT_APP_API_BASE_URL || defaultApiBase).replace(/\/$/, "");

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function roleHome(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "GUIDE") return "/guide-dashboard";
  if (role === "CREATOR") return "/creator-dashboard";
  return "/home";
}
