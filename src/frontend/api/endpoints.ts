import { AxiosRequestConfig } from "axios";

export const GET_GOOGLE_AUTH_URL  = (): AxiosRequestConfig => ({ method : "POST", url : "/auth/google" });
export const CONFIRM_GOOGLE_LOGIN = (): AxiosRequestConfig => ({ method : "GET", url : "/auth/google/callback" });
export const SEARCH = (): AxiosRequestConfig => ({ method : "GET", url : "/search" });
export const GET_PEOPLE = (): AxiosRequestConfig => ({ method : "GET", url : "/people" });