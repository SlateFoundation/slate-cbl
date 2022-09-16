import axios from 'axios';

export const redirectToLogin = () => {
  const next = encodeURIComponent(window.location.href)
  window.location = 'http://localhost:2190/login?return=' + next
}

export const getClient = (options = {}) => {
  const handleError = (error) => {
    if (error.response?.status === 401) {
      redirectToLogin()
    }
    throw error;
  };
  const client = axios.create({
    baseURL: options.baseURL,
    withCredentials: true,
    transformRequest(data, headers) {
      return JSON.stringify(data);
    },
  });
  client.defaults.headers.Accept = 'application/json';
  client.interceptors.response.use((r) => r.data.data, handleError);
  return client;
};

export default getClient({ baseURL: 'http://localhost:2190' });
