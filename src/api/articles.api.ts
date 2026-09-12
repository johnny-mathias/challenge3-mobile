import { apiClient } from './client';

import type { Article } from '../types/article';

export async function getArticles(): Promise<Article[]> {
  const { data } = await apiClient.get<Article[]>('/articles');
  return data;
}
