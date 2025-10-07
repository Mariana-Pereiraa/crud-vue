import apiClient from "@/services/ApiClient";
import AuthService from "@/services/AuthService";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';


export const useAuthStore = defineStore("auth", () => {
    const token = ref<string | null>(null);
    const user = ref<any | null>(null);
    const router = useRouter();

    const isAuthenticated = computed(() => !!token.value);
    const isGestor = computed(() => user.value?.papel === 'GESTOR');

    async function login(credentials: {email: string, senha: string}){
        try{
            const response = await AuthService.login(credentials);
            const accessToken = response.data.accessToken;
            const userData = response.data.user;

            token.value = accessToken;
            user.value = userData;

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            router.push('/');
        }catch(error){
            console.error("Erro no login", error);
            throw error;
        }
    }




    function logout(){
        token.value = null;
        user.value = null;
        delete apiClient.defaults.headers.common['Authorization'];
        router.push('/login');
    }
    return { token, user, isAuthenticated, isGestor, login, logout };

},
{
    persist: true,
})