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

        async getChat(chatId: string) {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/chats?chatId=${chatId}`);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async getUserChats(userId: string) {
            try {
                const res: any = await axios.get(`${useRuntimeConfig().public.apiBase}/chats?userId=${userId}`);
                this.$state.chats = res.data.chats;
                this.$state.firstChat = res.data.chats[0];
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async editChat(chatId: string, chat: object) {
            try {
                const res: any = await axios.patch(`${useRuntimeConfig().public.apiBase}/chats/edit?chatId=${chatId}`, chat);
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async sendMessage(chat: any, message: object) {
            try {
                const res: any = await axios.post(`${useRuntimeConfig().public.apiBase}/chats/messages/send?chatId=${chat._id}`, { message, chat });
                return res;
            } catch(err: any) {
                this.$state.error = err.response.data.message;
            }
        },

        async deleteChat(chatId: string, users: object) {
            try {
                const res: any = await axios.delete(`${useRuntimeConfig().public.apiBase}/chats/delete?chatId=${chatId}`, { data: { users } });
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