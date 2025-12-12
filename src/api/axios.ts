import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Axios configuration
const axiosInstance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
});

axiosInstance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  req.headers = req.headers || {};
  req.headers.common = req.headers.common || {};
  req.headers.common["Accept"] = "application/json";
  req.headers.common["Content-Type"] = "application/json";
  return req;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (
      err.response &&
      err.response.status === 401 &&
      err.response.data &&
      (err.response.data as { message?: string }).message !== "login-failed"
    ) {
      localStorage.removeItem("user");
      window.location.reload();
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
