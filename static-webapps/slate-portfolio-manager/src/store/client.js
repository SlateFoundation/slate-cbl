import axios from 'axios';

export const getClient = (options = {}) => {
  const handleError = (e) => {
    throw e;
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
