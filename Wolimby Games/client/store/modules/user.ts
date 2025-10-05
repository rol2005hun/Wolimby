import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '@/assets/ts/functions';
import type { UserProfile } from '@/assets/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    currentUser: {} as UserProfile,
    error: 'Ismeretlen'
  }),

  getters: {
    isLoggedIn: state => !!state.token,
  },

  actions: {
    async getCurrentUser() {
      try {
        const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/users/currentuser`);
        if (res.data.success) {
          this.$state.currentUser = res.data.user;
          try {
            const bg = res.data.user.appearance?.backgroundImage;
            if (bg && bg !== 'none') {
              functions.setCookie('bgimage', bg, 365);
            } else {
              functions.deleteCookie('bgimage');
            }
          } catch (e) { }
        }
        return res;
      } catch (err: any) {
        this.$state.error = err.response.data.message;
        if (process.client && err.response.status != 429) {
          this.logout();
        }
      }
    },

    async logout() {
      try {
        useCookie('token').value = null;
        try { functions.deleteCookie('bgimage'); } catch (e) { }
        delete axios.defaults.headers.common['Authorization'];
        this.$state.currentUser = {} as UserProfile;
        this.$state.token = '';
      } catch (err: any) {
        this.$state.error = err.response.data.message;
      }
    }
  },
});
