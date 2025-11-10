import api from './api';

export interface Settings {
  _id: string;
  siteTitle: string;
  siteDescription?: string;
  contactEmail?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getSettings = async (): Promise<Settings> => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settingsData: Partial<Omit<Settings, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Settings> => {
  const response = await api.put('/settings', settingsData);
  return response.data;
};
