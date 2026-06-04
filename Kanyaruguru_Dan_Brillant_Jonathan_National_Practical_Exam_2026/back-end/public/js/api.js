const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const api = {
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  // Customers
  getCustomers: () => request('/customers'),
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (body) => request('/customers', { method: 'POST', body }),
  updateCustomer: (id, body) => request(`/customers/${id}`, { method: 'PUT', body }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Vehicles
  getVehicles: () => request('/vehicles'),
  getVehicle: (id) => request(`/vehicles/${id}`),
  createVehicle: (body) => request('/vehicles', { method: 'POST', body }),
  updateVehicle: (id, body) => request(`/vehicles/${id}`, { method: 'PUT', body }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  // Reservations
  getReservations: () => request('/reservations'),
  getReservation: (id) => request(`/reservations/${id}`),
  createReservation: (body) => request('/reservations', { method: 'POST', body }),
  updateReservation: (id, body) => request(`/reservations/${id}`, { method: 'PUT', body }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
};
