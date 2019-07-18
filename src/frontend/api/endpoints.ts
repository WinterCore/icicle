import { AxiosRequestConfig } from "axios";

export const UPDATE_SETTINGS           = () => ({ method : "POST", url : "/settings" });
export const GET_GOOGLE_AUTH_URL       = (): AxiosRequestConfig => ({ method : "POST", url : "/auth/google" });
export const CONFIRM_GOOGLE_LOGIN      = (): AxiosRequestConfig => ({ method : "GET", url : "/auth/google/callback" });
export const SEARCH                    = (): AxiosRequestConfig => ({ method : "GET", url : "/search" });
export const GET_PEOPLE                = (): AxiosRequestConfig => ({ method : "GET", url : "/people" });
export const ADD_TO_QUEUE              = (): AxiosRequestConfig => ({ method : "POST", url : "/queue" });
export const GET_QUEUE_ITEMS           = (id: string): AxiosRequestConfig => ({ method : "GET", url : `/queue/${id}` });
export const DELETE_QUEUE_ITEM         = (id: string): AxiosRequestConfig => ({ method : "DELETE", url : `/queue/${id}` });
export const GET_PLAYLISTS             = (): AxiosRequestConfig => ({ method : "GET", url : "/playlist" });
export const DELETE_PLAYLIST           = (id: string): AxiosRequestConfig => ({ method : "DELETE", url : `/playlist/${id}` });
export const QUEUE_PLAYLIST            = (id: string): AxiosRequestConfig => ({ method : "POST", url : `/playlist/${id}/queue` });
export const GET_PLAYLISTS_ITEMS       = (id: string): AxiosRequestConfig => ({ method : "GET", url : `/playlist/${id}/songs` });
export const DELETE_PLAYLIST_ITEM      = (id: string, videoId: string): AxiosRequestConfig => ({ method : "DELETE", url : `/playlist/${id}/song/${videoId}` });
export const CREATE_PLAYLIST           = (): AxiosRequestConfig => ({ method : "POST", url : "/playlist" });
export const GET_SONG_PLAYLISTS        = (videoId: string): AxiosRequestConfig => ({ method : "GET", url : `/playlist/song/${videoId}/playlists` });
export const ADD_SONG_TO_PLAYLIST      = (playlistId: string): AxiosRequestConfig => ({ method : "POST", url : `/playlist/${playlistId}/song` });
export const REMOVE_SONG_FROM_PLAYLIST = (playlistId: string, videoId: string): AxiosRequestConfig => ({ method : "DELETE", url : `/playlist/${playlistId}/song/${videoId}` });