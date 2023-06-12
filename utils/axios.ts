import axios from 'axios';

export const setAxiosDefault = () => {
  if (!process.env.NEXT_PUBLIC_AXIOS_BASE_URL)
    throw new Error('Missing NEXT_PUBLIC_AXIOS_BASE_URL');
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_AXIOS_BASE_URL;
  axios.defaults.timeoutErrorMessage = 'Timed out attempting to reach server';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
};

