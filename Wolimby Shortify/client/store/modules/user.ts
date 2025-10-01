import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '@/assets/ts/functions';
import UserProfile from '@/assets/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    currentUser: {} as UserProfile,
    error: '' || 'Ismeretlen'
  }),

  getters: {
    isLoggedIn: state => !!state.token,
  },
  
  actions: {
    async login(user: any, checkbox: boolean) {
      try {
        const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/users/login`, user);
        if(res.data.success) {
          const token = res.data.token;
          if(checkbox == true) {
            functions.setCookie('token', token, 365);
          } else {
            functions.setCookie('token', token);
          }
          this.token = token;
          axios.defaults.headers.common['Authorization'] = token;
          this.$state.currentUser = user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async register(user: object) {
      try {
        const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/users/register`, user);
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

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

    async logout() {
      try {
        useCookie('token').value = null;
        delete axios.defaults.headers.common['Authorization'];
        this.$state.currentUser = {} as UserProfile;
        this.$state.token = '';
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    }
  },
});
