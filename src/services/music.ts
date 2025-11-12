import api from '@/plugins/api'
import type { TMusicAll } from '@/types/music'
import type { AxiosResponse } from 'axios'

export const getMusicAll = async (
  page: number,
  count: number,
): Promise<AxiosResponse<TMusicAll>> =>
  api.get<TMusicAll>('/musics', { params: { page, count } })
