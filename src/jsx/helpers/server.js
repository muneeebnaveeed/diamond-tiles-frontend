import axios from 'axios';

export const api = axios.create({ baseURL: 'https://diamond-tiles-backend.herokuapp.com' });

export const get = (path, page, limit) => api.get(path, { params: { page, limit } }).then((res) => res.data);
