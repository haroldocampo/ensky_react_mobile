import axios from 'axios';

const BASE_URL = 'https://ensky-api-0ddf0570d128.herokuapp.com';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Auth endpoints
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Investment endpoints
export const fetchInvestments = async () => {
  try {
    const response = await api.get('/investments');
    return response.data;
  } catch (error) {
    throw error;
  }
};