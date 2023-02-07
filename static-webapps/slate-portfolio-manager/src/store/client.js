import axios from 'axios';

const baseURL = process.env.VUE_APP_API_BASE || '';

export const redirectToLogin = () => {
  const next = encodeURIComponent(window.location.href);
  window.location = `${baseURL}/login?return=${next}`;
};

export const getClient = (options = {}) => {
  const handleError = (error) => {
    const { status } = error.response || {};
    if (status === 401) {
      redirectToLogin();
    }
    throw error;
  };
  const client = axios.create({
    baseURL: options.baseURL,
    withCredentials: true,
    transformRequest(data, headers) {
      Object.assign(headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
      return JSON.stringify(data);
    },
  });
  client.defaults.headers.Accept = 'application/json';
  client.interceptors.response.use((r) => r.data, handleError);
  return client;
};

export default getClient({ baseURL });
