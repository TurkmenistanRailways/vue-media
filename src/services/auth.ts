import api from '@/plugins/api'
import type { TPost, TSignInRes } from '@/types/auth'
import type { AxiosResponse } from 'axios'

export const signIn = async (body: TPost): Promise<AxiosResponse<TSignInRes>> =>
  api.post<TSignInRes>('/auth/sign-in', body)
