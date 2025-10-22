import axios from 'axios';
import Constants from 'expo-constants';
import { getItemAsync } from 'expo-secure-store';
import { STORE_API_TOKEN_KEY } from './constants';


const api = axios.create({
    baseURL: (Constants.expoConfig?.extra?.apiBaseURL ?? 'https://foms.djcayz.xyz') + '/api',
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await getItemAsync(STORE_API_TOKEN_KEY);
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;

// class ApiClient {
//     private static instance: ApiClient;
//     private token: string | null = null;

//     private constructor() {}

//     static getInstance(): ApiClient {
//         if (!ApiClient.instance) {
//             ApiClient.instance = new ApiClient();
//         }
//         return ApiClient.instance;
//     }

//     async init() {
//         this.token = await SecureStore.getItemAsync(STORE_API_TOKEN_KEY);
//     }

//     async login(email: string, password: string, deviceName: string) {
//         const response = await fetch(`${API_URL}/api/login`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password, device_name: deviceName }),
//         });

//         if (response.ok) {
//             const token = await response.text();
//             await SecureStore.setItemAsync(STORE_API_TOKEN_KEY, token);
//             this.token = token;
//             return true;
//         }

//         if (response.status === 422) {
//             throw await response.json();
//         }

//         throw new Error('Authentication failed');
//     }

//     async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
//         if (!this.token) {
//             throw new Error('No authentication token');
//         }

//         const response = await fetch(`${API_URL}${endpoint}`, {
//             ...options,
//             headers: {
//                 ...options.headers,
//                 'Authorization': `Bearer ${this.token}`,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (response.status === 401) {
//             // Token expired or invalid
//             await this.logout();
//             throw new Error('Session expired');
//         }

//         return response;
//     }

//     async logout() {
//         try {
//             await this.fetchWithAuth('/api/logout', { method: 'DELETE' });
//         } finally {
//             await SecureStore.deleteItemAsync(STORE_API_TOKEN_KEY);
//             this.token = null;
//         }
//     }

//     // Example of a protected API call
//     async getProfile() {
//         const response = await this.fetchWithAuth('/api/user');
//         if (!response.ok) {
//             throw new Error('Failed to fetch profile');
//         }
//         return response.json();
//     }

//     async validateToken(): Promise<boolean> {
//         if (!this.token) {
//             return false;
//         }

//         try {
//             const response = await this.fetchWithAuth('/api/verify-token', {
//                 method: 'POST'
//             });

//             if (!response.ok) {
//                 return false;
//             }

//             const data = await response.json();
//             return data.valid;
//         } catch (error) {
//             console.error('Token validation failed:', error);
//             return false;
//         }
//     }

//     async sendExpoPushToken(token: string): Promise<boolean> {
//         const response = await this.fetchWithAuth('/api/expo-push-token', {
//             method: 'POST',
//             body: JSON.stringify({ token }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to send expo push token');
//         }
//         return true;
//     }
// }

// export const api = ApiClient.getInstance();