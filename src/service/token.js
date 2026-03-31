// Computar a URL base da API
const getApiBase = () => {
  try {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  } catch (e) {
    
    return 'http://localhost:8000';
  }
};

const REFRESH_TOKEN_URL = () => `${getApiBase()}/auth/token/refresh/`;

/**
 * Decodifica o payload de um token JWT.
 * @param {string} token - O token JWT.
 * @returns {object|null} O payload decodificado ou null se inválido.
 */

const decodeTokenPayload = (token) => {
  try {
    const b64 = token.split('.')[1] || '';
    // Preferir o `atob` do navegador, mas fallback para o Buffer do Node se não estiver presente.
    let payloadStr;
    if (typeof atob === 'function') {
      payloadStr = atob(b64);
    } else if (typeof Buffer !== 'undefined') {
      payloadStr = Buffer.from(b64, 'base64').toString('utf-8');
    } else {
      console.error('decodeTokenPayload: No base64 decoder available.');
      return null;
    }
    return JSON.parse(payloadStr);
  } catch (err) {
    console.error("decodeTokenPayload: Token inválido ou malformado.", err);
    return null;
  }
};

const cleanLocalStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isAuthenticated');
};

/**
 * Obtém o token de acesso do localStorage e verifica se está expirado.
 * Se estiver expirado, tenta renovar utilizando o refreshToken.
 * @returns {Promise<string|null>} O token de acesso ou null se falhar.
 */
export const getAccessToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  // Validate token format before decoding
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    console.error('getAccessToken: Invalid token format in localStorage');
    cleanLocalStorage();
    return null;
  }

  const tokenPayload = decodeTokenPayload(token);
  
  // If token payload is invalid, clear storage and return null
  if (!tokenPayload) {
    cleanLocalStorage();
    return null;
  }

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
    const response = await fetch(REFRESH_TOKEN_URL(), {
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
      cleanLocalStorage();
      // Redirecionar para a página de login ou exibir uma mensagem
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/'; // ou o caminho da sua página de login
      }
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
  if (typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key === 'accessToken' || event.key === 'refreshToken') {
      // no-op placeholder for cross-tab sync actions (kept intentionally minimal)
    }
  });
};

// Inicializa a sincronização de tokens apenas em ambientes de navegador.
if (typeof window !== 'undefined') {
  synchronizeTokensAcrossTabs();
}
