import axiosInstance from "@/api/axios";
import type { AxiosInstance } from "axios";

export function useApi(): AxiosInstance {
  return axiosInstance;
}
