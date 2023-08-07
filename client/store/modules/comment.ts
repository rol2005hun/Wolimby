import { defineStore } from 'pinia';
import axios from 'axios';

export const useCommentStore = defineStore('comment', {
    state: () => ({
        error: '' || 'Ismeretlen'
    }),
    
    getters: {
        jozef: state => state.error
    },

    actions: {
        async createComment(comment: object) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/posts/comments/create`, comment);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async editComment(postId: number, commentId: number, patching: string, body: object) {
            try {
                const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/posts/comments/edit?postId=${postId}&commentId=${commentId}&editing=${patching}`, body);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async deleteComment(postId: number, commentId: number) {
            try {
                const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/posts/comments/delete?postId=${postId}&commentId=${commentId}`);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        }
    }
});