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

        async editComment(postId: string, commentId: string, patching: string, body: object) {
            try {
                const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/posts/comments/edit?postId=${postId}&commentId=${commentId}&editing=${patching}`, body);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async deleteComment(postId: string, commentId: string, userId: string) {
            try {
                const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/posts/comments/delete?postId=${postId}&commentId=${commentId}`, { data: { userId } });
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        }
    }
});