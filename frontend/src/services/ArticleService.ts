import api from './api';

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string; // Category ID
  author: string; // User ID
  status: 'draft' | 'published';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const getArticles = async (): Promise<Article[]> => {
  const response = await api.get('/articles');
  return response.data;
};

export const getArticle = async (id: string): Promise<Article> => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

export const createArticle = async (articleData: Omit<Article, '_id' | 'slug' | 'author' | 'createdAt' | 'updatedAt'>): Promise<Article> => {
  const response = await api.post('/articles', articleData);
  return response.data;
};

export const updateArticle = async (id: string, articleData: Partial<Omit<Article, '_id' | 'slug' | 'author' | 'createdAt' | 'updatedAt'>>): Promise<Article> => {
  const response = await api.put(`/articles/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/articles/${id}`);
};
