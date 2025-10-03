import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base do seu Back End (AJUSTE CONFORME NECESSÁRIO)
// Use o IP da sua máquina se estiver testando no celular ou emulador
const BASE_URL = 'http://localhost:8080/api'; 

const api = axios.create({
    baseURL: BASE_URL,
});

// Chaves de armazenamento
const TOKEN_KEY = '@token';
const USER_KEY = '@user_data';

// --- FUNÇÕES DE AUTENTICAÇÃO ---

// 1. LOGIN: Envia credenciais e salva token e dados do usuário
const login = async (email, password) => {
    try {
        const response = await api.post('users/login', { email, password });
        
        // O Back End DEVE retornar o token e os dados do usuário
        const { token, user } = response.data; 

        if (token && user) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user)); // <-- SALVANDO DADOS
            return { token, user };
        }
        throw new Error("Resposta de login inválida.");

    } catch (error) {
        // Trata erros de rede ou de autenticação do Back End
        throw new Error(error.response?.data?.error || "Credenciais inválidas ou erro de conexão.");
    }
};

// 2. CADASTRO: Envia dados e salva token e dados do usuário
const register = async (name, email, password) => {
    try {
        const response = await api.post('users/register', { name, email, password });
        
        const { token, user } = response.data; 

        if (token && user) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user)); // <-- SALVANDO DADOS
            return { token, user };
        }
        throw new Error("Resposta de cadastro inválida.");

    } catch (error) {
        throw new Error(error.response?.data?.error || "Erro ao registrar ou email já cadastrado.");
    }
};


// 3. LOGOUT: Remove token e dados do usuário
const logout = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
        return true;
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        return false;
    }
};

// 4. GET LOGGED IN USER: Obtém os dados do usuário do armazenamento local
const getLoggedInUser = async () => {
    try {
        const userDataString = await AsyncStorage.getItem(USER_KEY);
        if (userDataString) {
            return JSON.parse(userDataString); // Retorna o objeto { name: '...', email: '...' }
        }
        return null; // Nenhum usuário logado
    } catch (error) {
        console.error("Erro ao obter usuário do storage:", error);
        return null;
    }
};

// 5. GET TOKEN: Obtém o token para ser usado nas requisições protegidas
const getToken = async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
};


// --- SERVIÇOS EXTRAS (Notícias) ---

// Configura o interceptor para adicionar o token nas requisições de notícias
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


const newsService = {
    list: async () => {
        const response = await api.get('/news');
        return response.data;
    },
    // Adicione outras funções de notícias se necessário (e.g., favorite)
};


// Exporta os serviços
export const authService = {
    login,
    register,
    logout,
    getLoggedInUser, // <-- ESSA FUNÇÃO AGORA EXISTE E ESTÁ CORRETA
};

export const apiService = api;
export { newsService };