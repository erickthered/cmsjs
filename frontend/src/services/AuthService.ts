import api from './api';

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    fullName: string;
    nickName: string;
    group: 'admin' | 'editor';
  };
}

interface LoginCredentials {
  email: string;
  password:string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // The error will be handled by the calling component
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): AuthResponse['user'] | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
