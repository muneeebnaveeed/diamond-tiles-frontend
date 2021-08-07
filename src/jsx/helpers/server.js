import axios from 'axios';

export const api = axios.create({ baseURL: 'https://diamond-tiles-backend.herokuapp.com' });

export const getError = (err) => err.response?.data?.data ?? err.message;

export const get = (path, page, limit, field, order, search = '') =>
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
