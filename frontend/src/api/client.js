/**
 * Central API Client for Adonis Frontend.
 * Supports both cookies (credentials: 'include') and Bearer tokens.
 */

const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('adonis_token');

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // sends HttpOnly cookies for Web
  });

  if (!response.ok) {
    let errorDetail = 'Wystąpił błąd podczas komunikacji z serwerem.';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (_) {
      errorDetail = `Błąd HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const authApi = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMe: () => apiRequest('/auth/me'),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getPatients: () => apiRequest('/auth/patients'),
  getDietitians: () => apiRequest('/auth/dietitians'),
  getPatientProfile: (patientId) => apiRequest(`/auth/patients/${patientId}/profile`),
  updatePatientProfile: (patientId, data) =>
    apiRequest(`/auth/patients/${patientId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateMyProfile: (data) =>
    apiRequest('/auth/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteMyAccount: () => apiRequest('/auth/me', { method: 'DELETE' }),
  getMyRecommendationsHistory: () => apiRequest('/auth/me/recommendations-history'),
  getPatientRecommendationsHistory: (patientId) => apiRequest(`/auth/patients/${patientId}/recommendations-history`),
  addPatientRecommendation: (patientId, data) =>
    apiRequest(`/auth/patients/${patientId}/recommendations`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSettings: () => apiRequest('/auth/settings'),
  updateSettings: (data) =>
    apiRequest('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (data) =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (data) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};



export const recipesApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/recipes/?${query}`);
  },
  get: (id) => apiRequest(`/recipes/${id}`),
  create: (data) =>
    apiRequest('/recipes/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id, force = false) =>
    apiRequest(`/recipes/${id}?force=${force}`, {
      method: 'DELETE',
    }),
  checkUsage: (id) => apiRequest(`/recipes/${id}/usage`),
  replace: (id, data) =>
    apiRequest(`/recipes/${id}/replace`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  scale: (id, portions) => apiRequest(`/recipes/${id}/scale?portions=${portions}`),
  products: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/recipes/products/list?${query}`);
  },
  createProduct: (data) =>
    apiRequest('/recipes/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id, data) =>
    apiRequest(`/recipes/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id) =>
    apiRequest(`/recipes/products/${id}`, {
      method: 'DELETE',
    }),
  searchOpenFoodFacts: (query, store = '') => {
    const q = new URLSearchParams({ query, ...(store ? { store } : {}) }).toString();
    return apiRequest(`/recipes/openfoodfacts/search?${q}`);
  },
  getBarcode: (barcode) => apiRequest(`/recipes/openfoodfacts/barcode/${barcode}`),
  uploadImage: async (file) => {
    const token = localStorage.getItem('adonis_token');
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/recipes/upload-image`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'include',
    });
    if (!response.ok) {
      let err = 'Błąd wgrywania zdjęcia.';
      try {
        const errorData = await response.json();
        err = errorData.detail || err;
      } catch (_) {}
      throw new Error(err);
    }
    return response.json();
  },
};

export const dietPlansApi = {
  getDaily: (targetDate, patientId) => {
    const q = new URLSearchParams();
    if (targetDate) q.append('target_date', targetDate);
    if (patientId) q.append('patient_id', patientId);
    return apiRequest(`/diet-plans/daily?${q.toString()}`);
  },
  getWeekly: (startDate, patientId) => {
    const q = new URLSearchParams();
    if (startDate) q.append('start_date', startDate);
    if (patientId) q.append('patient_id', patientId);
    return apiRequest(`/diet-plans/weekly?${q.toString()}`);
  },
  assignDaily: (data) =>
    apiRequest('/diet-plans/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggleMealComplete: (mealId) =>
    apiRequest(`/diet-plans/meals/${mealId}/toggle-complete`, { method: 'POST' }),
  substituteMeal: (mealId, data) =>
    apiRequest(`/diet-plans/meals/${mealId}/substitute`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  revertMealSubstitute: (mealId) =>
    apiRequest(`/diet-plans/meals/${mealId}/substitute`, {
      method: 'DELETE',
    }),
  getShoppingList: (startDate, endDate, mealTypes) => {
    const q = new URLSearchParams({ start_date: startDate, end_date: endDate });
    if (mealTypes) q.append('meal_types', mealTypes);
    return apiRequest(`/diet-plans/shopping-list?${q.toString()}`);
  },
  toggleShoppingItem: (itemId, data) =>
    apiRequest('/diet-plans/shopping-list/toggle', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, ...data }),
    }),
  bulkToggleShoppingItems: (isBought, itemIds = null) =>
    apiRequest('/diet-plans/shopping-list/bulk-toggle', {
      method: 'POST',
      body: JSON.stringify({ is_bought: isBought, item_ids: itemIds }),
    }),
  getTemplates: (category = '') => {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest(`/diet-plans/templates${q}`);
  },
  createTemplate: (data) =>
    apiRequest('/diet-plans/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTemplate: (id, data) =>
    apiRequest(`/diet-plans/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTemplate: (id) =>
    apiRequest(`/diet-plans/templates/${id}`, {
      method: 'DELETE',
    }),
  sendTemplateToPatient: (templateId, data) =>
    apiRequest(`/diet-plans/templates/${templateId}/send-to-patient`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loadPackageByPatient: (data) =>
    apiRequest('/diet-plans/patient/load-package', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  importDietPdf: (formData) =>
    apiRequest('/diet-plans/import-pdf', {
      method: 'POST',
      body: formData,
    }),
};

export const measurementsApi = {
  list: (patientId) => {
    const q = patientId ? `?patient_id=${patientId}` : '';
    return apiRequest(`/measurements/${q}`);
  },
  add: (data) =>
    apiRequest('/measurements/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  correctByDietitian: (id, data) =>
    apiRequest(`/measurements/${id}/correct`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/measurements/${id}`, {
      method: 'DELETE',
    }),
  getAuditLogs: (patientId) => {
    const q = patientId ? `?patient_id=${patientId}` : '';
    return apiRequest(`/measurements/audit-logs${q}`);
  },
};

export const chatApi = {
  getHistory: (otherUserId) => apiRequest(`/chat/messages?other_user_id=${otherUserId}`),
  sendMessage: (receiverId, content) =>
    apiRequest('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, content }),
    }),
  getNotifications: () => apiRequest('/chat/notifications'),
  markNotificationRead: (id) => apiRequest(`/chat/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => apiRequest('/chat/notifications/mark-all-read', { method: 'POST' }),
  getUnreadCount: () => apiRequest('/chat/unread-count'),
  getConversations: () => apiRequest('/chat/conversations'),
};

export const adminApi = {
  listUsers: (role = '') => {
    const q = role ? `?role=${role}` : '';
    return apiRequest(`/auth/admin/users${q}`);
  },
  deleteUser: (userId) => apiRequest(`/auth/admin/users/${userId}`, { method: 'DELETE' }),
  cleanUser: (userId) => apiRequest(`/auth/admin/users/${userId}/clean`, { method: 'POST' }),
  deactivateUser: (userId) => apiRequest(`/auth/admin/users/${userId}/deactivate`, { method: 'POST' }),
  createUser: (data) =>
    apiRequest('/auth/admin/create-user', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (userId, data) =>
    apiRequest(`/auth/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  assignDietitian: (patientId, dietitianId) =>
    apiRequest(`/auth/patients/${patientId}/assign-dietitian?dietitian_id=${dietitianId}`, {
      method: 'POST',
    }),
};
