const API_BASE = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid credentials");
  }
  return res.json(); // { access_token }
}

export async function register(email, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function fetchExpenses(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/expenses?${qs}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}

export async function createExpense(payload) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteExpense(id) {
  await fetch(`${API_BASE}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/summary`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.json();
}
