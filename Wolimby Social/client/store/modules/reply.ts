import { defineStore } from 'pinia';
import axios from 'axios';

export const useReplyStore = defineStore('reply', {
    state: () => ({
        error: '' || 'Ismeretlen'
    }),
    
    getters: {
    },

    actions: {
        async createReply(reply: object) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/posts/comments/replies/create`, reply);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async editReply(postId: string, commentId: string, replyId: string, patching: string, body: object) {
            try {
                const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/posts/comments/replies/edit?postId=${postId}&commentId=${commentId}&replyId=${replyId}&editing=${patching}`, body);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async deleteReply(postId: string, commentId: string, replyId: string, userId: string) {
            try {
                const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/posts/comments/replies/delete?postId=${postId}&commentId=${commentId}&replyId=${replyId}`, { data: { userId } });
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        }
    }
});