import api from '@/plugins/api'
import type { TBookAll } from '@/types/book'
import type { AxiosResponse } from 'axios'

export const getBooks = async (
  page: number,
  count: number,
): Promise<AxiosResponse<TBookAll>> =>
  api.get<TBookAll>('/books', { params: { page, count } })
