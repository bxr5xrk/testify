import { AxiosRequestConfig } from 'axios';
import { URL } from '../config';
import { Response } from '../types/test';
import { api } from '../utils/api';

export const getTestStats = async () => {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: URL,
  };

  const { data } = await api.request<Response>(config);

  const { questions, stat: stats, category } = data;

  return { questions, stats, category };
};
