import { defineStore } from 'pinia';
import axios from 'axios';

export const useChatStore = defineStore('chat', {
    state: () => ({
        chats: [] as any[],
        firstChat: {} as any,
        error: '' || 'Ismeretlen'
    }),

    actions: {
        async createChat(chat: object) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/chats/create`, chat);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async getChats(userId: string) {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/chats?userId=${userId}`);
                this.$state.chats = res.data.chats;
                this.$state.firstChat = res.data.chats[0];
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async sendMessage(chatId: string, message: object) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/chats/messages/send`, { chatId, message});
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async deleteMessage(chatId: string, messageId: string) {
            try {
                const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/chats/messages/delete`, { data: { chatId, messageId } });
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        }
    }
});   