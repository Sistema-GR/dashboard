// src/services/token.js

// URLs da API
const REFRESH_TOKEN_URL = "http://localhost:8000/auth/token/refresh/";

/**
 * Obtém o token de acesso do localStorage e verifica se ele está expirado.
 * Se estiver expirado, tenta renovar utilizando o refreshToken.
 * @returns {Promise<string|null>} O token de acesso ou null se falhar.
 */
export const getAccessToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = tokenPayload.exp < Math.floor(Date.now() / 1000);
    
    if (isExpired) {
      const refreshToken = localStorage.getItem('refreshToken');
      return await renewAccessToken(refreshToken);
    }

    return token;
  } catch (error) {
    console.error("getAccessToken: error decoding token:", error);
    return null;
  }
};

/**
 * Renova o token de acesso utilizando o refresh token.
 * @param {string} refreshToken - O token de renovação.
 * @returns {Promise<string|null>} O novo token de acesso ou null se falhar.
 */
export const renewAccessToken = async (refreshToken) => {
  if (!refreshToken) return null;

  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return data.access;
    }

    console.error("renewAccessToken: error renewing token:", response.status);
  } catch (error) {
    console.error("renewAccessToken: error:", error);
  }

  return null;
};

/**
 * Configura o Axios para usar o token de acesso e renovar o token se necessário.
 * @param {import('axios').AxiosInstance} axiosInstance - A instância do Axios.
 */
export const setupAxiosInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Verifica se o erro é por token expirado (status 401)
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        const newAccessToken = await renewAccessToken(refreshToken);
        
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};
