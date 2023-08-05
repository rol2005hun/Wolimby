import { defineStore } from 'pinia';
import axios from 'axios';

interface Url {
    fullUrl: string;
    shortUrl: string;
}

export const useUrlStore = defineStore('url', {
    state: () => ({
        url: {} as Url,
        error: '' || 'Ismeretlen'
    }),
    
    getters: {
        isUrl: state => state.url,
    },

    actions: {
        async getUrl(url: string) {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/url/get?url=${url}`);
                if(res.data.success) {
                    this.$state.url = res.data.url;
                }
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async createUrl(url: Url) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/url/create`, url);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        }
    }
});