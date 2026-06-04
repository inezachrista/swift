const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      console.error(`API Error ${res.status}:`, data);
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Request Failed:`, err);
    if (err instanceof TypeError) {
      throw new Error('Network error - is the backend running?');
    }
    throw err;
  }
}

const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body }),
  customerSignup: (body) => request('/auth/customer-signup', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  customerLogin: (body) => request('/auth/customer-login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  getCustomers: (search) => request(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (body) => request('/customers', { method: 'POST', body }),
  updateCustomer: (id, body) => request(`/customers/${id}`, { method: 'PUT', body }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  getVehicles: (search) => request(`/vehicles${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getVehicle: (id) => request(`/vehicles/${id}`),
  createVehicle: (body) => request('/vehicles', { method: 'POST', body }),
  updateVehicle: (id, body) => request(`/vehicles/${id}`, { method: 'PUT', body }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  getReservations: (search) => request(`/reservations${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getReservation: (id) => request(`/reservations/${id}`),
  createReservation: (body) => request('/reservations', { method: 'POST', body }),
  updateReservation: (id, body) => request(`/reservations/${id}`, { method: 'PUT', body }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
  getMyReservations: () => request('/reservations/my'),
  getReport: () => request('/reservations/report'),

  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (body) => request('/users', { method: 'POST', body }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PUT', body }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

export default api;