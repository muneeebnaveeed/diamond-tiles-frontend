import axios from 'axios';
import { isArray } from 'lodash';

export const api = axios.create({ baseURL: 'https://diamond-tiles-backend.herokuapp.com/' });

api.interceptors.request.use(
   async (config) => {
      const token = await localStorage.getItem('auth_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
   },
   (err) => Promise.reject(err)
);

export const getError = (err) => {
   const response = err.response?.data?.data;

   if (!isArray(response)) return [response];

   if (!response) return [err.message];

   return response;
};

export const get = (path, page, limit, field, order, search) =>
   api.get(path, { params: { page, limit, [`sort[${field}]`]: order, search } }).then((res) => res.data);

/**
 * Send a POST request
 * @param {string} path
 * @param {object} payload
 * @returns
 */
export const post = (path, payload) =>
   api
      .post(path, payload)
      .then((res) => (res.status === 200 || res.status === 201 ? { ...res.data, status: 'ok' } : res.data));

/**
 * Send a PATCH request
 * @param {string} path
 * @param {object} payload
 * @returns
 */
export const patch = (path, payload) =>
   api.patch(path, payload).then((res) => (res.status === 200 ? { ...res.data, status: 'ok' } : res.data));

/**
 * Send a DELETE request
 * @param {string} path
 * @returns
 */
export const del = (path) =>
   api.delete(path).then((res) => (res.status === 200 ? { ...res.data, status: 'ok' } : res.data));
