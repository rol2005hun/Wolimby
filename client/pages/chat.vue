<template>
    <div class="modal-overlay" v-if="isVisible.users || isVisible.settings"></div>
    <div class="modal users" v-if="isVisible.users">
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
    <div class="modal settings" v-if="isVisible.settings">
        <div class="modal-content">
            <button @click="isVisible.settings = false" class="close-btn">&times;</button>
            <form @submit.prevent="editChat(activeChat)">
                <div class="header">
                    <img :src="returnChatDetails(activeChat, 'icon')" alt="chaticon" :disabled="activeChat.type != 'group'">
                    <input type="text" :value="returnChatDetails(activeChat, 'name')" placeholder="Chat neve" required :disabled="activeChat.type != 'group'">
                </div>
                <div class="users">
                    <details>
                        <summary>Tagok</summary>
                        <div :class="'user ' + user.user._id" v-for="user in activeChat.users" :key="user._id">
                            <img :src="user.user.profile.profilePicture" alt="pfp"/>
                            <div class="user-info">
                                <h3>{{ user.user.profile.username }}</h3>
                                <input type="text" v-model="user.nickname" placeholder="Becenév">
                            </div>
                        </div>
                    </details>
                </div>
                <button class="save-chat" type="submit">Mentés</button>
            </form>
            <div class="delete-chat">
                <p>Chat törlése - Visszfordíthatatlan</p>
                <button class="delete-chat-btn" @click="deleteChat(activeChat._id, activeChat.users)"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    </div>
    <div class="chat-app">
        <div class="sidebar">
            <div class="chat-list">
                <div class="search">
                    <input type="text" placeholder="Keresés..." v-on:input="filter($event, 'chats')"/>
                </div>
                <div v-if="chats.chats.value.length == 0" class="no-chats-message">
                    <p>Jelenleg nincsenek chatjeid.</p>
                </div>
                <div v-else v-for="chat in filteredChats" :key="chat._id" @click="switchChat(chat)">
                    <img :src="returnChatDetails(chat, 'icon')" alt="pfp"/>
                    <div class="chat-info">
                        <h3>{{ returnChatDetails(chat, 'name') }}</h3>
                        <p>{{ onlineChats.includes(chat._id) ? 'Online' : 'Offline' }}</p>
                    </div>
                </div>
            </div>
            <div class="new-chat">
                <button @click="isVisible.users = true"><i class="fa-solid fa-plus"></i> Új chat</button>
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
                <img :src="returnChatDetails(activeChat, 'icon')" alt="pfp"/>
                <div class="chat-info">
                    <h3>{{ returnChatDetails(activeChat, 'name') }}</h3>
                    <p>{{ onlineChats.includes(activeChat._id) ? 'Online' : 'Offline' }}</p>
                </div>
                <div class="buttons">
                    <button><i class="fa-solid fa-phone"></i></button>
                    <button><i class="fa-solid fa-video"></i></button>
                    <button @click="isVisible.settings = true"><i class="fa-solid fa-gear"></i></button>
                </div>
            </div>
            <div class="messages">
                <div :class="'message ' + sentReceived(message) + ' ' + message._id" v-for="message in activeChat.messages" :key="message._id" :title="formatDateToText(message.createdAt)">
                    <p v-html="filterMessage(message.message)"></p>
                </div>
            </div>
            <p v-if="activeChat.typing && activeChat.typing.length > 0" id="typing">{{ generateTypingMessage(activeChat.typing) }}</p>
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
                    <input class="textarea" type="text" v-model="newMessageText" placeholder="Írd ide az üzeneted..." @focus="typing(true)" @blur="typing(false)"/>
                    <button type="submit" title="sendbutton"><i class="fa-solid fa-paper-plane send-button"></i></button>
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
const isVisible = ref({} as any);
const isTyping = ref([] as string[]);
const fileList = ref([] as any);
let typingInterval: any;
let socket: any;

function switchChat(chat: any) {
    if(activeChat.value) {
        activeChat.value.users.forEach((user: any) => {
            if (isTyping.value.includes(user.user._id)) {
                setTyping(true, user.user._id, false);
            }
        });

        activeChat.value = chat;

        activeChat.value.users.forEach((user: any) => {
            if (isTyping.value.includes(user.user._id)) {
                setTyping(true, user.user._id, true);
            }
        });
    } else {
        activeChat.value = chat;
    }
}

function setTyping(typing: boolean, userId: string, isActive: boolean) {
    scrollToBottom();

    if (typing) {
        if (!isTyping.value.includes(userId)) {
            isTyping.value.push(userId);
        }
        if (isActive) {
            activeChat.value.typing = [...isTyping.value];
            typingInterval = setInterval(() => {
                const typingElement = document.getElementById('typing') as HTMLParagraphElement;
                typingElement.innerHTML = switchText(typingElement.innerHTML) as string;
            }, 500) as any;
        } else {
            clearInterval(typingInterval);
        }
    } else {
        const index = isTyping.value.indexOf(userId);
        if (index !== -1) {
            isTyping.value.splice(index, 1);
        }
        if (isActive) {
            activeChat.value.typing = [...isTyping.value];
            clearInterval(typingInterval);
        }
    }
}

function other(users: any) {
    return users.filter((user: any) => user.user._id != currentUser.value._id)[0];
}

function sentReceived(message: any) {
    return (message.sentBy._id || message.sentBy) == currentUser.value._id ? 'sent' : 'received';
}

function whoSent(user: any) {
    return user.nickname ? user.nickname : user.user.profile.username;
}

function formatDateToText(date: any): string {
    return functions.formatDate(date);
}

function scrollToBottom() {
    const messages = document.querySelector('.messages') as HTMLElement;
    if(messages != null) {
        nextTick(() => {
            messages.scrollTop = messages.scrollHeight;
        });
    }
}

function closeUsers() {
    isVisible.value.users = false;
    filteredUsers.value = users.value.filter(user => user._id !== currentUser.value._id);
}

function switchText(text: string) {
    const onlyText = text.replaceAll('.', '');

    if(text == `${onlyText}...`) {
        return `${onlyText}`;
    } else if(text == `${onlyText}`) {
        return `${onlyText}.`;
    } else if(text == `${onlyText}.`) {
        return `${onlyText}..`;
    } else if(text == `${onlyText}..`) {
       return `${onlyText}...`;
    }
}

function generateTypingMessage(typingUsers: string[]) {
    if (typingUsers.length === 1) {
        return `${typingUsers[0]} épp gépel`;
    } else if (typingUsers.length === 2) {
        return `${typingUsers[0]} és ${typingUsers[1]} épp gépelnek`;
    } else if (typingUsers.length > 2) {
        return 'Többen épp gépelnek';
    }
}

function returnChatDetails(chat: any, detail: string) {
    switch(detail) {
        case 'name':
            return chat.type == 'group' ? chat.name : ( other(chat.users).nickname ? other(chat.users).nickname : other(chat.users).user.profile.username );
        case 'icon':
            return other(chat.users).user.profile.profilePicture;
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

function updateChatSorting() {
    filteredChats.value.sort((a: any, b: any) => {
        const lastMessageA = a.messages[a.messages.length - 1];
        const lastMessageB = b.messages[b.messages.length - 1];
        if (lastMessageA && lastMessageB) {
            return new Date(lastMessageB.createdAt).getTime() - new Date(lastMessageA.createdAt).getTime();
        } else {
            return 0;
        }
    });
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
    inputElement.style.minHeight = '21.5vh';
    fileList.value.push(newFile);
    scrollToBottom();
}

function removeFile(index: number) {
    fileList.value.splice(index, 1);

    if(fileList.value.length == 0) {
        const inputElement = document.getElementsByClassName('input')[0] as HTMLInputElement;
        inputElement.style.minHeight = '45px';
    }
}

function filterMessage(message: any) {
    let result = message;
    const mentionedUsers = activeChat.value.users.map((user: any) => user.user.profile.username);
    const mentionRegex = new RegExp(`@(${mentionedUsers.join('|')})\\b`, 'g');
    result = result.replace(mentionRegex, '<span class="mention" style="color: red;">$&</span>');

    const fileMatches = message.match(/\bhttps?:\/\/\S+\b/g);
    const imageRegex = /\.(png|jpg|jpeg|gif)$/i;
    const videoRegex = /\.(mp4|mov|avi)$/i;
    const audioRegex = /\.(mp3|ogg|wav)$/i;
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
        filteredChats.value.forEach((chat: any) => {
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
                message: `Új chatet kezdtél vele: ${user.profile.username}`,
                type: 'success',
            });
            socket.emit('newChat', res.data.chat, currentUser.value._id);
            socket.emit('connection', currentUser.value._id);
            filteredChats.value.push(res.data.chat);
            chats.chats.value = [...filteredChats.value];
            if(chats.chats.value.length == 1) {
                switchChat(res.data.chat);
            }
            isVisible.value.users = false;
        }
    });
}

function receiveChat() {
    socket.on('receiveChat', (chat: any, uid: string) => {
        socket.emit('connection', currentUser.value._id);
        if(chat.users.some((user: any) => user.user._id == currentUser.value._id)) {
            filteredChats.value.push(chat);
            chats.chats.value = [...filteredChats.value];
            const username =  whoSent(chat.users.find((user: any) => user.user._id == uid));
            notificationStore.addNotification({
                id: 0,
                message: `Új chatet kezdett veled ${username}.`,
                type: 'success',
            });
            if(chats.chats.value.length == 1) {
                switchChat(chat);
            }
        }
    });
}

function editChat(chat: any) {
    chatStore.editChat(chat._id, chat).then((res: any) => {
        if(res.data.success) {
            notificationStore.addNotification({
                id: 0,
                message: 'A chat sikeresen módosítva lett.',
                type: 'success',
            });
            socket.emit('editChat', activeChat.value._id, chat);
            chatStore.getUserChats(currentUser.value._id).then((res) => {
                if(res.data.success) {
                    filteredChats.value = res.data.chats;
                }
            });
        }
    });
}

function receiveEditChat() {
    socket.on('editChat', (chatid: string, editedChat: any) => {
        filteredChats.value.forEach((chat: any, index: number) => {
            if (chat._id === chatid) {
                filteredChats.value[index] = editedChat;
                chats.chats.value[index] = editedChat;

                if(activeChat.value._id == chatid) {
                    activeChat.value = editedChat;
                }

                notificationStore.addNotification({
                    id: 0,
                    message: `${returnChatDetails(chat, 'name')} chat módosítva lett valaki által.`,
                    type: 'success',
                });
            }
        });
    });
}

async function sendMessage() {
    if (newMessageText.value.length < 1 && fileList.value.length < 1) return;

    if(newMessageText.value.length > 0) {
        const newTextMessage = {
            message: newMessageText.value,
            sentBy: currentUser.value._id,
        }

        chatStore.sendMessage(activeChat.value, newTextMessage).then((res: any) => {
            if(res.data.success) {
                socket.emit('sendMessage', newTextMessage, activeChat.value._id, currentUser.value._id);
                activeChat.value.messages.push(newTextMessage);
                newMessageText.value = '';
                const inputElement = document.getElementsByClassName('input')[0] as HTMLInputElement;
                inputElement.style.height = '0';
                updateChatSorting();
                scrollToBottom();
            }
        });
    }

    if (fileList.value.length > 0) {
        const waitingMessage = {
            _id: 'tempid',
            message: 'Fájl feltöltése folyamatban',
            sentBy: currentUser.value._id,
        }

        activeChat.value.messages.push(waitingMessage);
        const interval = setInterval(() => {
            const typingElement = document.querySelector('.tempid p') as HTMLDivElement;
            typingElement.innerHTML = switchText(typingElement.innerHTML) as string;
        }, 500) as any;
        scrollToBottom();
        const file = fileList.value[0].file;
        const formData = new FormData();

        if (file.type.includes('image')) {
            formData.append('image', file);
        } else if (file.type.includes('video')) {
            formData.append('video', file);
        }

        removeFile(0);

        try {
            let res: any;
            await postStore.uploadImage(formData).then((response) => { res = response });
            if (res.data.success) {
                const newImageMessage = {
                    message: res.data.data.link,
                    sentBy: currentUser.value._id,
                }

                chatStore.sendMessage(activeChat.value, newImageMessage).then((res: any) => {
                    if(res.data.success) {
                        clearInterval(interval);
                        socket.emit('sendMessage', newImageMessage, activeChat.value._id, currentUser.value._id);
                        activeChat.value.messages.splice(activeChat.value.messages.indexOf(waitingMessage), 1);
                        activeChat.value.messages.push(newImageMessage);
                        fileList.value = [];
                        newMessageText.value = '';
                        updateChatSorting();
                        scrollToBottom();
                    }
                });
            }
        } catch (error: any) {
            notificationStore.addNotification({
                id: 0,
                type: 'error',
                message: 'Hiba történt a fájl feltöltése közben: ' + error.message || 'Ismeretlen hiba!',
            });
        }
    }
}

function receiveMessage() {
    socket.on('receiveMessage', (message: any, id: string, uid: string) => {
        chats.chats.value.forEach((chat: any) => {
            if(chat._id == id) {
                const mentionedUsers = chat.users.map((user: any) => user.user.profile.username);
                const mentionRegex = new RegExp(`@(${mentionedUsers.join('|')})\\b`, 'g');
                const isMentioned = mentionRegex.test(message.message);

                chat.messages.push(message);
                if (activeChat.value._id != id) {
                    const username =  whoSent(chat.users.find((user: any) => user.user._id == uid));
                    if(isMentioned) {
                        notificationStore.addNotification({
                            id: 0,
                            message: `${username} megemlített téged a(z) ${returnChatDetails(chat, 'name')} chatben.`,
                            type: 'success',
                        });
                    } else {
                        notificationStore.addNotification({
                            id: 0,
                            message: `${username} üzenetet küldött a(z) ${returnChatDetails(chat, 'name')} chatbe.`,
                            type: 'success',
                        });
                    }
                }
            }
        });

        updateChatSorting();
        scrollToBottom();
    });
}

function typing(typing: boolean) {
    socket.emit('typing', currentUser.value._id, activeChat.value._id, typing);
}

function receiveTyping() {
    socket.on('typing', (who: string, where: string, typing: boolean) => {
        if(typing) {
            if(activeChat.value._id == where) {
                setTyping(true, who, true);
            } else {
                setTyping(true, who, false);
            }
        } else {
            if(activeChat.value._id == where) {
                setTyping(false, who, true);
            } else {
                setTyping(false, who, false);
            }
        }
    });
}

function deleteChat(chatId: string, users: object) {
    chatStore.deleteChat(chatId, users).then((res: any) => {
        if(res.data.success) {
            notificationStore.addNotification({
                id: 0,
                message: 'A chat sikeresen törölve lett.',
                type: 'success',
            });
            socket.emit('deleteChat', activeChat.value._id);
            activeChat.value = null;
            isVisible.value.settings = false;
            chatStore.getUserChats(currentUser.value._id).then((res) => {
                if(res.data.success) {
                    filteredChats.value = res.data.chats;
                }
            });
        }
    });
}

function receiveDeleteChat() {
    socket.on('deleteChat', (chatid: string) => {
        filteredChats.value.forEach((chat: any) => {
            if(chat._id == chatid) {
                filteredChats.value.splice(filteredChats.value.indexOf(chat), 1);
                chats.chats.value.splice(chats.chats.value.indexOf(chat), 1);
                if(activeChat.value._id == chatid) {
                    activeChat.value = chats.chats.value[0];
                    isVisible.value.settings = false;
                }
                notificationStore.addNotification({
                    id: 0,
                    message: `${returnChatDetails(chat, 'name')} chat törölve lett valaki által.`,
                    type: 'success',
                });
            }
        });
    });
}

function disconnection() {
    socket.on('disconnection', (id: string) => {
        filteredChats.value.forEach((chat: any) => {
            chat.users.filter((user: any) => {
                if(user.user._id == id) {
                    onlineChats.value.splice(onlineChats.value.indexOf(chat._id), 1);
                    if(isTyping.value.includes(id)) {
                        if(activeChat.value._id == chat._id) {
                            setTyping(false, id, true);
                        } else {
                            setTyping(false, id, false);
                        }
                    }
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
    receiveEditChat();
    receiveDeleteChat();
    scrollToBottom();
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/chat.scss';
</style>
