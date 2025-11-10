import api from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: Omit<Category, '_id' | 'slug'>): Promise<Category> => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, '_id' | 'slug'>>): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
