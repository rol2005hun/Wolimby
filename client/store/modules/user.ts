import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '@/assets/ts/functions';
import UserProfile from '@/assets/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    currentUser: {} as UserProfile,
    users: [] as UserProfile[],
    error: '' || 'Ismeretlen'
  }),

  getters: {
    isLoggedIn: state => !!state.token,
  },
  
  actions: {
    async getCurrentUser() {
      try {
        const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/users/currentuser`);
        if(res.data.success) {
          this.$state.currentUser = res.data.user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
        if(process.client && err.response.status != 429) {
          this.logout();
        }
      }
    },

    async getUsers() {
      try {
        const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/users`);
        if(res.data.success) {
          this.$state.users = res.data.users;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async logout() {
      try {
        functions.deleteCookie('token');
        delete axios.defaults.headers.common['Authorization'];
        this.$state.currentUser = {} as UserProfile;
        this.$state.token = '';
        return navigateTo('https://account.wolimby.hu/auth', { external: true });
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    }
  },
});
