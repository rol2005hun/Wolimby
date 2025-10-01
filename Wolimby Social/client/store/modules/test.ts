import { defineStore } from 'pinia';
import axios from 'axios';

export const useTestStore = defineStore('test', {
    state: () => ({
        res: false,
        error: '' || 'Ismeretlen'
    }),
    
    getters: {
        isOnline: state => state.res,
    },

    actions: {
        async testApi() {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/test/testrequest`);
                if(res.data.success) {
                  this.$state.res = true;
                }
                return res;
            } catch(err: any) {
                this.$state.error = err.response?.data.message;
            }
        }
    }
});