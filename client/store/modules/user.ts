import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '@/assets/ts/functions';

interface UserProfile {
  profile: {
    username: string,
    email: string,
    name: string,
    password: string,
    profilePicture: string,
    biography: string,
    // birthday: Date,
    roles: string,
    notificationList: [{
        title: string,
        profilePicture: string,
        message: string,
        createdAt: Date
    }],
    ipList: [{
        ip: string,
        loggedAt: Date
    }],
    createdAt: Date
  },
  privacy: {
    showName: boolean,
    showEmail: boolean
  },
  appearance: {
    backgroundImage: string,
    theme: string
  }
}

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
