import apiClient from "./ApiClient";


export default {
    login(credentials: {email: string, senha: string}) {
        return apiClient.post('/auth/login', credentials);
    },

    registrar(data: any){
        return apiClient.post('/auth/registrar', data);
    }
};