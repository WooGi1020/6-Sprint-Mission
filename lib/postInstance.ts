import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const postInstance = axios.create({
  baseURL: API_URL,
});

postInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

postInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken"); // 리프레시 토큰 가져오기
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken: refreshToken });

        const newToken = response.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return postInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // 필요한 경우 로그아웃 처리 등 추가 작업 수행
      }
    }

    return Promise.reject(error);
  }
);

export default postInstance;
