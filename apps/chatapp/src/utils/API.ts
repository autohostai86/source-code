/** @format */

import axios from 'axios';
// @ts-ignore
const isProduction = process.env.NODE_ENV === 'production';

const isHttps = Boolean(process.env['NX_ON_HTTPS']);

// no https enabled now . when https is enable then use below
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line import/no-mutable-exports
let baseURL: any;
// eslint-disable-next-line import/no-mutable-exports
let socketBaseURL: any;

if (isHttps) {
    baseURL = isProduction ? `https://${process.env['NX_API_DOMAIN']}/api` : 'http://localhost:5000/api';
    socketBaseURL = isProduction ? `https://${process.env['NX_API_DOMAIN']}` : 'http://localhost:5000';
}
if (!isHttps) {
    baseURL = isProduction ? `https://${process.env['NX_API_DOMAIN']}/api` : 'http://localhost:5000/api';
    socketBaseURL = isProduction ? `https://${process.env['NX_API_DOMAIN']}` : 'http://localhost:5000';
}

const Axios = axios.create({
    baseURL,
    withCredentials: true
});

// get token from localstorage
const tokenFromLocalStorage = localStorage.getItem('jwtToken');

// setting up token from localstorage if exists
Axios.defaults.headers.common.Authorization = tokenFromLocalStorage;

// eslint-disable-next-line no-console
console.log('baseURL, socketBaseURL: ', baseURL, socketBaseURL);

export { baseURL, socketBaseURL };

export default Axios;
