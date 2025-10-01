import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '@/assets/ts/functions';
import type { UserProfile } from '@/assets/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    currentUser: {} as UserProfile,
    user: {} as UserProfile,
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

    async getUser(user: string) {
      try {
        const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/users/get?user=${user}`);
        if(res.data.success) {
          this.$state.user = res.data.user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async updateUserData(user: string, patching: string, data: object) {
      try {
        const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/users/patch?user=${user}&patching=${patching}`, data);
        if(res.data.success) {
          this.$state.currentUser = res.data.user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async updateNotificationSettings(user: string, action: string) {
      try {
        const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/users/notification?user=${user}&action=${action}`);
        if(res.data.success) {
          this.$state.currentUser = res.data.user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async uploadImage(image: object) {
      try {
          const res: any = await axios.post('https://api.imgur.com/3/upload', image, {
              headers: {
                  Authorization: 'Client-ID ' + useRuntimeConfig().public.imgurClientId,
              },
          });
          return res;
      } catch(err: any) {
          this.$state.error = err.response.data.message;
          return err;
      }
  },

    async logout() {
      try {
        functions.deleteCookie('token');
        delete axios.defaults.headers.common['Authorization'];
        return navigateTo('/auth');
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async deleteUser(user: string) {
      try {
        const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/users/delete?user=${user}`);
        if(res.data.success) {
          functions.deleteCookie('token');
          delete axios.defaults.headers.common['Authorization'];
          return navigateTo('/auth');
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    }
  },
});
