import axios from 'axios';

import { API_BASE_URL } from '../config/env';
import { toFriendlyError } from './errors';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 45000,
});

apiClient.interceptors.response.use(undefined, toFriendlyError);
