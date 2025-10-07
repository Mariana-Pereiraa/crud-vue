import { createRouter, createWebHistory } from 'vue-router'
import ProdutosView from '../views/ProdutosView.vue' 
import CategoriasView from '@/views/CategoriasView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/Auth'
import RegistroView from '@/views/RegistroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'produtos', 
      component: ProdutosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: CategoriasView,
      meta: { requiresAuth: true}
    },
    {
      path: '/login', 
      name: 'login',
      component: LoginView
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegistroView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresGestor = to.meta.requiresGestor;

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (requiresGestor && !authStore.isGestor) {
    next({ name: 'produtos' });
  } else {
    next();
  }
});

export default router