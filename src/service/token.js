import axios from 'axios';

// URLs da API
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://10.203.2.249:8000';  // Defina o valor diretamente
const REFRESH_TOKEN_URL = `${API_BASE_URL}/auth/token/refresh/`;


/**
 * Decodifica o payload de um token JWT.
 * @param {string} token - O token JWT.
 * @returns {object|null} O payload decodificado ou null se inválido.
 */
const decodeTokenPayload = (token) => {
  try {
    const payload = atob(token.split('.')[1]);
    return JSON.parse(payload);
  } catch {
    console.error("decodeTokenPayload: Token inválido ou malformado.");
    return null;
  }
};

/**
 * Obtém o token de acesso do localStorage e verifica se está expirado.
 * Se estiver expirado, tenta renovar utilizando o refreshToken.
 * @returns {Promise<string|null>} O token de acesso ou null se falhar.
 */
export const getAccessToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const tokenPayload = decodeTokenPayload(token);
  const isExpired = tokenPayload?.exp && tokenPayload.exp < Math.floor(Date.now() / 1000);

  if (isExpired) {
    const refreshToken = localStorage.getItem('refreshToken');
    return await renewAccessToken(refreshToken);
  }

  return token;
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
      if (data.access) {
        localStorage.setItem('accessToken', data.access);
        return data.access;
      } else {
        console.error("renewAccessToken: Token de acesso ausente na resposta.");
      }
    } else if (response.status === 401) {
      // Se o token for blacklisted ou inválido, limpar os tokens e redirecionar o usuário
      console.error("renewAccessToken: Token blacklisted ou inválido.");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      // Redirecionar para a página de login ou exibir uma mensagem
      window.location.href = '/'; // ou o caminho da sua página de login
    } else {
      console.error("renewAccessToken: Erro ao renovar o token:", response.status, await response.text());
    }
  } catch (error) {
    console.error("renewAccessToken: Erro:", error);
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        const newAccessToken = await renewAccessToken(refreshToken);

        if (newAccessToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Sincroniza tokens entre abas usando eventos de localStorage.
 */
const synchronizeTokensAcrossTabs = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'accessToken' || event.key === 'refreshToken') {
    }
  });
};

// Inicializa a sincronização de tokens.
synchronizeTokensAcrossTabs();
