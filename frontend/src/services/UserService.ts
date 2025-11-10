import api from './api';

export interface User {
  _id: string;
  fullName: string;
  nickName: string;
  email: string;
  group: 'admin' | 'editor';
  createdAt: string;
}

// We don't want to send the password back, so the API won't.
// For creation/updates, we might send it.
type UserInput = Partial<Omit<User, '_id' | 'createdAt'>> & { password?: string };


export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: UserInput): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: UserInput): Promise<User> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
