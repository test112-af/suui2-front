// src/services/apiService.ts
import { api } from '../contexts/AuthContext';

// Define TypeScript interfaces for better type safety
interface Formation {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  price?: number;
  status?: string;
  dateDebut?: string;
  dateFin?: string;
}

interface Groupe {
  id?: number;
  name: string;
  capaciteMax: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  formationId: number;
  formationTitle?: string;
  learnerCount?: number;
}

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { 
    email: string; 
    password: string; 
    nom: string; 
    prenom: string; 
    role: string;
    telephone?: string;
  }) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
  logout: () => {
    localStorage.removeItem('tweadup_user');
    delete api.defaults.headers.common.Authorization;
    return Promise.resolve();
  },
};

// Admin API
export const adminAPI = {
  getAll: () => api.get('/admin'),
  getById: (id: string) => api.get(`/admin/${id}`),
  create: (data: any) => api.post('/admin', data),
  update: (id: string, data: any) => api.put(`/admin/${id}`, data),
  delete: (id: string) => api.delete(`/admin/${id}`),
};

// Trainer API
export const formateurAPI = {
  getAll: () => api.get('/formateurs'),
  getById: (id: string) => api.get(`/formateurs/${id}`),
  create: (data: any) => api.post('/formateurs', data),
  update: (id: string, data: any) => api.put(`/formateurs/${id}`, data),
  delete: (id: string) => api.delete(`/formateurs/${id}`),
};

// Formation API
export const formationAPI = {
  getAll: () => api.get('/formations'),
  getById: (id: string) => api.get(`/formations/${id}`),
  create: (data: Formation) => api.post('/formations', data),
  update: (id: string, data: Formation) => api.put(`/formations/${id}`, data),
  delete: (id: string) => api.delete(`/formations/${id}`),
};

// Group API with proper typing
export const groupeAPI = {
  getAll: () => api.get('/groupes'),
  getById: (id: string) => api.get(`/groupes/${id}`),
  create: (data: Groupe) => api.post('/groupes', data),
  update: (id: string, data: Groupe) => api.put(`/groupes/${id}`, data),
  delete: (id: string) => api.delete(`/groupes/${id}`),
  getByFormateur: (formateurId: string) => api.get(`/groupes/formateur/${formateurId}`),
  getByFormation: (formationId: string) => api.get(`/groupes/formation/${formationId}`),
};

// Apprenant API
export const apprenantAPI = {
  getAll: () => api.get('/apprenants'),
  getById: (id: string) => api.get(`/apprenants/${id}`),
  create: (data: any) => api.post('/apprenants', data),
  update: (id: string, data: any) => api.put(`/apprenants/${id}`, data),
  delete: (id: string) => api.delete(`/apprenants/${id}`),
  getByGroupe: (groupeId: string) => api.get(`/apprenants/groupe/${groupeId}`),
};

// Attendance API
export const presenceAPI = {
  getByGroupe: (groupeId: string, date: string) => 
    api.get(`/presences/groupe/${groupeId}?date=${date}`),
  getByApprenant: (apprenantId: string) => 
    api.get(`/presences/apprenant/${apprenantId}`),
  create: (data: any) => api.post('/presences', data),
  update: (id: string, data: any) => api.put(`/presences/${id}`, data),
  bulkCreate: (presences: any[]) => api.post('/presences/bulk', presences),
};

// Payment API
export const paiementAPI = {
  getAll: () => api.get('/paiements'),
  getById: (id: string) => api.get(`/paiements/${id}`),
  create: (data: any) => api.post('/paiements', data),
  update: (id: string, data: any) => api.put(`/paiements/${id}`, data),
  getByApprenant: (apprenantId: string) => api.get(`/paiements/apprenant/${apprenantId}`),
  getNonPayes: () => api.get('/paiements/non-payes'),
};

// Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getById: (id: string) => api.get(`/notifications/${id}`),
  create: (data: any) => api.post('/notifications', data),
  markAsRead: (id: string) => api.put(`/notifications/${id}/vue`, {}),
  sendPaymentReminders: () => api.post('/notifications/rappels-paiement', {}),
  getByDestinataire: (destinataireId: string) => 
    api.get(`/notifications/destinataire/${destinataireId}`),
};

// Dashboard API
export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getFormateurStats: (formateurId: string) => api.get(`/dashboard/formateur/${formateurId}`),
};

// Export interfaces for use in components
export type { Formation, Groupe };