import { defineStore } from 'pinia';
import axios from 'axios';

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [] as any[],
        post: {} as any,
        error: '' || 'Ismeretlen'
    }),
    
    getters: {
    },

    actions: {
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
        
        async createPost(post: object) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/posts/create`, post);
                if(res.data.success) {
                    this.$state.posts = res.data.posts;
                }
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async getPost(postId: string) {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/posts/get?postid=${postId}`);
                this.$state.post = res.data.post;
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async getAllPost() {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/posts/getall`);
                if(res.data.success) {
                    this.$state.posts = res.data.posts;
                }
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async editPost(postId: string, patching: string, body: object) {
            try {
                const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/posts/edit?postId=${postId}&editing=${patching}`, body);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async deletePost(postId: string, userId: string) {
            try {
                const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/posts/delete?postId=${postId}`, { data: { userId } });
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        }
    }
});