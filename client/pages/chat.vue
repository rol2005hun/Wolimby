<template>
    <div class="modal-overlay" v-if="isVisible" @click="isVisible =  false"></div>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
            <button @click="closeUsers" class="close-btn">&times;</button>
            <div class="header">
                <h3>Új chat</h3>
            </div>
            <div class="search">
                <input type="text" placeholder="Keresés..." v-on:input="filter($event, 'users')"/>
            </div>
            <div class="user-list">
                <div v-for="user in filteredUsers" :key="user._id" @click="newChat(user)">
                    <img :src="user.profile.profilePicture" alt="pfp" />
                    <div class="user-info">
                        <h3>{{ user.profile.username }}</h3>
                        <p>{{ user.profile.biography }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="chat-app">
        <div class="sidebar">
            <div class="user-list">
                <div class="search">
                    <input type="text" placeholder="Keresés..." v-on:input="filter($event, 'chats')"/>
                </div>
                <div v-if="chats.chats.value.length == 0" class="no-chats-message">
                    <p>Jelenleg nincsenek chatjeid.</p>
                </div>
                <div v-else v-for="chat in filteredChats" :key="chat.id" @click="switchChat(chat)">
                    <img :src="other(chat.users).user.profile.profilePicture" alt="pfp"/>
                    <div class="user-info">
                        <h3>{{ chat.type == 'group' ? chat.name : ( other(chat.users).nickname ? other(chat.users).nickname : other(chat.users).user.profile.username ) }}</h3>
                        <p>{{ onlineChats.includes(chat._id) ? 'Online' : 'Offline' }}</p>
                    </div>
                </div>
            </div>
            <div class="new-chat">
                <button @click="isVisible = true"><i class="fa-solid fa-plus"></i> Új chat</button>
            </div>
        </div>
        <div v-if="activeChat == undefined" class="chat-window">
            <div class="video">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/gbshdqKVWvY?si=KxL4nuQUiUwNvI9L&amp;start=43" title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
        <div v-else class="chat-window">
            <div class="header">
                <img :src="other(activeChat.users).user.profile.profilePicture" alt="pfp"/>
                <div class="user-info">
                    <h3>{{ activeChat.type == 'group' ? activeChat.name : ( other(activeChat.users).nickname ? other(activeChat.users).nickname : other(activeChat.users).user.profile.username ) }}</h3>
                    <p>{{ onlineChats.includes(activeChat._id) ? 'Online' : 'Offline' }}</p>
                </div>
                <div class="buttons">
                    <button><i class="fa-solid fa-phone"></i></button>
                    <button><i class="fa-solid fa-video"></i></button>
                    <button><i class="fa-solid fa-gear"></i></button>
                </div>
            </div>
            <div class="messages">
                <div :class="'message ' + whoSent(message)" v-for="message in activeChat.messages" :key="message.id" :title="formatDateToText(message.createdAt)">
                    <p v-html="filterMessage(message.message)"></p>
                </div>
            </div>
            <p v-if="isTyping">{{ typingText }}</p>
            <form class="input" @submit.prevent="sendMessage" v-on:keyup.enter="sendMessage">
                <div class="file-list">
                    <div class="file" v-for="(file, index) in fileList" :key="index">
                        <div class="preview"><img :src="file.url" alt="File Thumbnail" /></div>
                        <i class="fa-solid fa-trash" @click="removeFile(index)"></i>
                    </div>
                </div>
                <div class="bottom">
                    <label>
                        <input type="file" ref="fileInput" @change="uploadFile" style="display: none;"/>
                        <span><i class="fa-solid fa-upload"></i></span>
                    </label>
                    <input class="textarea" type="text" v-model="newMessageText" placeholder="Írd ide az üzeneted..." @focus="typing(true)" @blur="typing(false)" required/>
                    <button type="submit" title="sendbutton" :disabled="newMessageText.length < 1"><i class="fa-solid fa-paper-plane send-button"></i></button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'chat',
});

import { ref } from 'vue';
import { userStore, postStore, chatStore, notificationStore } from '@/store';
import { storeToRefs } from 'pinia';
import functions from '@/assets/ts/functions';

const { currentUser } = storeToRefs(userStore);
const { users } = storeToRefs(userStore);
const { firstChat } = storeToRefs(chatStore);
const chats = storeToRefs(chatStore) as any;
const filteredChats = ref(chats.chats.value);
const onlineChats = ref([]) as any;
const filteredUsers = ref(users.value.filter(user => user._id !== currentUser.value._id));
const activeChat = ref(firstChat);
const newMessageText = ref('');
const isVisible = ref(false);
const isTyping = ref(false);
const typingText = ref('Épp ír...');
const fileList = ref([] as any);
let socket: any;

function switchChat(chat: object) {
    activeChat.value = chat;
    scrollToBottom();
}

function other(users: any) {
    return users.filter((user: any) => user.user._id != currentUser.value._id)[0];
}

function whoSent(message: any) {
    return (message.sentBy._id || message.sentBy) == currentUser.value._id ? 'sent' : 'received';
}

function formatDateToText(date: any): string {
    return functions.formatDate(date);
}

function scrollToBottom() {
    const messages = document.querySelector('.messages') as HTMLElement;
    messages.scrollTop = messages.scrollHeight;
}

function closeUsers() {
    isVisible.value = false;
    filteredUsers.value = users.value.filter(user => user._id !== currentUser.value._id);
}

function switchText() {
    if(typingText.value == 'Épp ír...') {
        typingText.value = 'Épp ír';
    } else if(typingText.value == 'Épp ír') {
        typingText.value = 'Épp ír.';
    } else if(typingText.value == 'Épp ír.') {
        typingText.value = 'Épp ír..';
    } else if(typingText.value == 'Épp ír..') {
        typingText.value = 'Épp ír...';
    }
}

function filter(event: any, type: string) {
    switch(type) {
        case 'chats':
            filteredChats.value = chats.chats.value.filter((chat: any) => {
                if(chat.type == 'private') {
                    chat.name = other(chat.users).nickname ? other(chat.users).nickname : other(chat.users).user.profile.username;
                }
                return chat.name.toLowerCase().includes(event.target.value.toLowerCase());
            });
            break;
        case 'users':
            filteredUsers.value = users.value.filter(user => user._id !== currentUser.value._id).filter((user: any) => {
                return user.profile.username.toLowerCase().includes(event.target.value.toLowerCase());
            });
            break;
    }
}

function uploadFile(event: any) {
    const filetype = functions.getFileType(event.target.files[0].name);

    if(filetype == 'unknown') {
        return notificationStore.addNotification({
            id: 0,
            type: 'error',
            message: 'Nem támogatott fájlformátum!',
        });
    }

    if(event.target.files[0].size > 209000000) {
        return notificationStore.addNotification({
            id: 0,
            type: 'error',
            message: 'A fájl túl nagy! >200mb',
        });
    }

    const newFile = {
        file: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
    }

    fileList.value = [];
    const inputElement = document.getElementsByClassName('input')[0] as HTMLInputElement;
    inputElement.style.height = '110vh';
    fileList.value.push(newFile);
    scrollToBottom();
}

function removeFile(index: number) {
    fileList.value.splice(index, 1);

    if(fileList.value.length == 0) {
        const inputElement = document.getElementsByClassName('input')[0] as HTMLInputElement;
        inputElement.style.height = '0';
    }
}

function filterMessage(message: any) {
    const imageRegex = /\.(png|jpg|jpeg|gif)$/i;
    const videoRegex = /\.(mp4|mov|avi)$/i;
    const audioRegex = /\.(mp3|ogg|wav)$/i;

    let result = message;

    const fileMatches = message.match(/\bhttps?:\/\/\S+\b/g);
    
    if (fileMatches) {
        fileMatches.forEach((fileUrl: any) => {
            let mediaElement = '';

            if (imageRegex.test(fileUrl)) {
                mediaElement = `<img src="${fileUrl}" style="max-width: 40vh; max-height: 40vh;" alt="Image"/>`;
            } else if (videoRegex.test(fileUrl)) {
                mediaElement = `<video controls style="max-width: 40vh; max-height: 40vh;"><source src="${fileUrl}" type="video/mp4"></video>`;
            } else if (audioRegex.test(fileUrl)) {
                mediaElement = `<audio controls style="max-width: 40vh; max-height: 40vh;"><source src="${fileUrl}" type="audio/mpeg"></audio>`;
            }

            const isFileAlone = result.trim() === fileUrl.trim();

            result = isFileAlone ? result.replace(fileUrl, mediaElement) : result.replace(fileUrl, `<br/>&nbsp;${mediaElement}`);
        });
    }

    return result;
}

function connection() {
    socket.emit('connection', currentUser.value._id);
    socket.on('connection', (onlineUsers: Array<null>) => {
        chats.chats.value.forEach((chat: any) => {
            chat.users.forEach((user: any) => {
                if(onlineUsers.includes(user.user._id) && !onlineChats.value.includes(chat._id) && user.user._id != currentUser.value._id) {
                    onlineChats.value.push(chat._id);
                }
            });
        });
    });
}

function newChat(user: any) {
    const newChat = {
        type: 'private',
        name: '',
        users: [currentUser.value._id, user._id],
    }
    chatStore.createChat(newChat).then((res) => {
        if(res.data.success) {
            notificationStore.addNotification({
                id: 0,
                message: `Új chatet kezdtél ${user.profile.username} felhasználóval.`,
                type: 'success',
            });
            socket.emit('newChat', res.data.chat);
            socket.emit('connection', currentUser.value._id);
            isVisible.value = false;
            chatStore.getChats(currentUser.value._id).then((res) => {
                if(res.data.success) {
                    filteredChats.value = res.data.chats;
                }
            });
        }
    });
}

function receiveChat() {
    socket.on('receiveChat', (chat: any) => {
        socket.emit('connection', currentUser.value._id);
        if(chat.users.some((user: any) => user.user._id == currentUser.value._id)) {
            filteredChats.value.push(chat);
            notificationStore.addNotification({
                id: 0,
                message: `Új chatet kezdett veled ${other(chat.users).user.profile.username} felhasználó.`,
                type: 'success',
            });
            if(chats.chats.value.length == 1) {
                switchChat(chat);
            }
        }
    });
}

async function sendMessage() {
    if (newMessageText.value.length < 1 && fileList.value.length < 1) return;

    if (activeChat.value) {
        if (fileList.value.length > 0) {
            const file = fileList.value[0].file;
            const formData = new FormData();

            if (file.type.includes('image')) {
                formData.append('image', file);
            } else if (file.type.includes('video')) {
                formData.append('video', file);
            }

            try {
                const res = await postStore.uploadImage(formData);
                if (res.data.success) {
                    const newImageMessage = {
                        message: res.data.data.url,
                        sentBy: currentUser.value._id,
                        createdAt: new Date(),
                    };

                    chatStore.sendMessage(activeChat.value._id, newImageMessage);
                    socket.emit('sendMessage', newImageMessage, activeChat.value._id);
                    activeChat.value.messages.push(newImageMessage);
                    fileList.value = [];
                    newMessageText.value = '';
                    scrollToBottom();
                    return;
                }
            } catch (error) {
                notificationStore.addNotification({
                    id: 0,
                    type: 'error',
                    message: 'Hiba történt a fájl feltöltése közben!',
                });
            }
        }

        const newTextMessage = {
            message: newMessageText.value,
            sentBy: currentUser.value._id,
            createdAt: new Date(),
        };

        chatStore.sendMessage(activeChat.value._id, newTextMessage);
        socket.emit('sendMessage', newTextMessage, activeChat.value._id);
        activeChat.value.messages.push(newTextMessage);
        newMessageText.value = '';
        const inputElement = document.getElementsByClassName('input')[0] as HTMLInputElement;
        inputElement.style.height = '0';
        scrollToBottom();
    }
}

function receiveMessage() {
    socket.on('receiveMessage', (message: any, id: string) => {
        chats.chats.value.forEach((chat: any) => {
            if(chat._id == id) {
                chat.messages.push(message);
            }
        });

        if(activeChat.value._id != id) {
            notificationStore.addNotification({
                id: 0,
                message: `Új üzenetet kaptál ${other(chats.chats.value.filter((chat: any) => chat._id == id)[0].users).user.profile.username} felhasználótól.`,
                type: 'success',
            });
        }

        nextTick(() => {
            scrollToBottom();
        });
    });
}

function typing(typing: boolean) {
    socket.emit('typing', currentUser.value._id, activeChat.value._id, typing);
}

function receiveTyping() {
    let interval: any;
    socket.on('typing', (who: string, where: string, typing: boolean) => {
        if(typing) {
            if(activeChat.value._id == where) {
                isTyping.value = true;
                interval = setInterval(switchText, 500);
            }
        } else {
            if(activeChat.value._id == where) {
                isTyping.value = false;
                interval = clearInterval(interval);
            }
        }
    });
}

function disconnection() {
    socket.on('disconnection', (id: string) => {
        chats.chats.value.forEach((chat: any) => {
            chat.users.filter((user: any) => {
                if(user.user._id == id) {
                    onlineChats.value.splice(onlineChats.value.indexOf(chat._id), 1);
                }
            });
        });
    });
}

onMounted(() => {
    socket = useNuxtApp().$nuxtSocket({ name: 'main' });
    connection();
    receiveMessage();
    receiveChat();
    disconnection();
    receiveTyping();
    scrollToBottom();
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/chat.scss';
</style>
