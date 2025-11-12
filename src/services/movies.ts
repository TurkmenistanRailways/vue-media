import api from '@/plugins/api'
import type {
  TMovie,
  TMovieCategory,
  TMoviesBySubCatId,
  TMoviesHomePage,
} from '@/types/movie'
import type { AxiosResponse } from 'axios'

export const getMovies = async (): Promise<AxiosResponse<TMovie[]>> =>
  api.get<TMovie[]>('/movies')

export const getMovieById = async (
  id: string,
): Promise<AxiosResponse<TMovie>> => api.get<TMovie>(`/movies/${id}`)

export const getSubCatById = async (
  id: string,
): Promise<AxiosResponse<TMovieCategory>> =>
  api.get<TMovieCategory>(`/categories/sub/${id}`)

export const getMoviesByCatId = async (
  id: string,
  page: number,
  count: number,
): Promise<AxiosResponse<TMoviesBySubCatId>> =>
  api.get<TMoviesBySubCatId>(`/movies/sub/${id}`, { params: { page, count } })

export const getHomePageMovies = async (): Promise<
  AxiosResponse<TMoviesHomePage>
> => api.get<TMoviesHomePage>('/movies/main-page')

export const getMovieCategories = async (): Promise<
  AxiosResponse<TMovieCategory[]>
> => api.get<TMovieCategory[]>('/categories/1/sub')

export const getSearchedMovies = async (
  searchValue: string,
): Promise<AxiosResponse<TMovie[]>> =>
  api.get<TMovie[]>('/movies/search/' + searchValue)
