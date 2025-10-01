<template>
    <main class="home">
        <div class="welcome-container">
            <div class="welcome">
                <div class="welcome-text">
                    <h1>Üdvözöllek, <span class="username-roles" v-html="functions.renderUserRoles(currentUser)"></span>!</h1>
                    <div class="open" @click="isModalVisible = true"><i class="fa-solid fa-plus"></i></div>
                    <p>Itt láthatod a legfrissebb bejegyzéseket, hozzászólásokat és válaszokat.</p>
                </div>
            </div>
        </div>
        <div class="create-post-modal-overlay" v-if="isModalVisible" @click="isModalVisible = false"></div>
        <div class="create-post-modal" v-if="isModalVisible">
            <div class="modal-content">
                <button @click="isModalVisible = false" class="close-btn">&times;</button>
                <h2>Bejegyzés készítés</h2>
                <div class="modal-body">
                    <input type="file" @change="uploadFile" />
                    <div class="file-input-container">
                        <label for="file-input">
                            <i class="fa-solid fa-file-upload"></i>
                            <span class="file-name">{{ file ? file.name : 'Válassz fájlt...' }}</span>
                        </label>
                        <button v-if="url" @click="url = ''; file = ''" class="file-delete" aria-label="Delete file">&times;</button>
                        <img v-if="url && file.type.includes('image')" :src="url" alt="previewimg" class="preview-image">
                        <video v-if="url && file.type.includes('video')" :src="url" class="preview-image"></video>
                        <input type="file" id="file-input" @change="uploadFile" />
                    </div>
                    <textarea v-model="post" placeholder="Leírás..." minlength="1" maxlength="500"></textarea>
                </div>
                <button @click="createPost" class="save-button">Mentés</button>
            </div>
        </div>
        <div v-if="posts.length == 0" class="card-container">
            <div class="card">
                <div class="card-header">
                    <img src="https://i.imgur.com/ceDUpKL.png" class="user-picture" alt="userpfp">
                    <div class="card-header-text">
                        <span class="username-roles">WoBo</span>
                        <span class="post-time">1848.03.15 12:00</span>
                    </div>
                </div>
                <div class="card-body">
                    <p class="post-description">Egyelőre üres itt, tégy ellene!</p>
                </div>
            </div>
        </div>
        <div v-else class="card-container" v-for="post in posts" :key="post._id">
            <div class="card">
                <div class="card-header">
                    <img :src="post.author ? post.author.profile.profilePicture : 'https://i.imgur.com/ceDUpKL.png'" class="user-picture" alt="userpfp">
                    <div class="card-header-text">
                        <span class="username-roles" v-if="!post.author">Törölt fiók</span>
                        <span class="username-roles" v-else v-html="functions.renderUserRoles(post.author)"></span>
                        <span class="post-time">{{ functions.formatDate(post.createdAt) }}</span>
                    </div>
                    <div class="card-header-right">
                        <div class="more-button">
                            <div class="more-button-icon">
                                <div class="more-button-dot"></div>
                                <div class="more-button-dot"></div>
                                <div class="more-button-dot"></div>
                            </div>
                            <ul class="more-options">
                                <li class="more-option" @click="copyId(post._id)">Másolás</li>
                                <li class="more-option" @click="openPost(post._id)">Megnyitás</li>
                                <li v-if="post.author && isOwner(post.author._id)" class="more-option">Szerkesztés</li>
                                <li v-if="post.author && isOwner(post.author._id)" @click.prevent="deletePost(post._id)" class="more-option" style="color: red;">Törlés</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="post-description">{{ post.description }}</p>
                    <img v-if="(post.file != 'none') && functions.getFileType(post.file) == 'image'" :src="post.file" alt="postimg" class="post-image">
                    <video v-if="post.file != 'none' && functions.getFileType(post.file) == 'video'" :src="post.file" class="post-image" controls></video>
                    <div class="card-footer">
                        <button @click="editPost(post._id, 'like')" class="like-button footer-button">
                        <i class="fa-solid fa-heart" :style="{ color: post.likes.includes(currentUser._id) ? 'red' : 'black' }"></i> {{ post.likes.length }} kedvelés</button>
                        <button class="comment-button footer-button" @click="showComments(post._id)"><i class="fa-solid fa-comment"></i> {{ post.comments.length }} hozzászólás</button>
                        <button class="share-button footer-button" @click="copyLink(post._id)"><i class="fa-solid fa-share"></i> {{ post.shares.length }} megosztás</button>
                    </div>
                    <div :class="'card-comments ' + post._id">
                        <form @submit.prevent="createComment(post._id)" :class="'textarea-container ' + post._id">
                            <div class="file-list">
                                <div class="file" v-for="(file, index) in fileListComment" :key="index">
                                    <div class="preview"><img :src="file.url" alt="File Thumbnail" /></div>
                                    <i class="fa-solid fa-trash" @click="removeFile(index, post._id, 'comment')"></i>
                                </div>
                            </div>
                            <div class="bottom">
                                <label>
                                    <input type="file" ref="fileInput" @change="uploadFileComment($event, post._id)" style="display: none;"/>
                                    <span><i class="fa-solid fa-upload"></i></span>
                                </label>
                                <textarea type="text" class="create-comment" placeholder="Szólj hozzá..." v-model="comment" name="create-comment" maxlength="200"></textarea>
                                <button type="submit" title="sendbutton"><i class="fa-solid fa-paper-plane send-button"></i></button>
                            </div>
                        </form>
                        <div v-if="post.comments.length == 0" class="comment">
                            <div class="card-comments-header">
                                <img src="https://i.imgur.com/ceDUpKL.png" class="user-picture" alt="userpfp">
                                <div class="card-comments-header-text">
                                    <span class="username-roles">WoBo</span>
                                    <span class="comment-time">1848.03.15 12:00</span>
                                </div>
                            </div>
                            <div class="card-comments-body">
                                <p class="comment-description">Egyelőre üres itt, tégy ellene!</p>
                            </div>
                        </div>
                        <div v-else class="comment" v-for="comment in post.comments" :key="comment._id">
                            <div class="card-comments-header">
                                <img :src="comment.author ? comment.author.profile.profilePicture : 'https://i.imgur.com/ceDUpKL.png'" class="user-picture" alt="userpfp">
                                <div class="card-comments-header-text">
                                    <span class="username-roles" v-if="!comment.author">Törölt fiók</span>
                                    <span class="username-roles" v-else v-html="functions.renderUserRoles(comment.author)"></span>
                                    <span class="comment-time">{{ functions.formatDate(comment.createdAt) }}</span>
                                </div>
                                <div class="card-comments-header-right">
                                    <div class="more-button">
                                        <div class="more-button-icon">
                                            <div class="more-button-dot"></div>
                                            <div class="more-button-dot"></div>
                                            <div class="more-button-dot"></div>
                                        </div>
                                        <ul class="more-options">
                                            <li class="more-option" @click="copyId(comment._id)">Másolás</li>
                                            <li v-if="comment.author && isOwner(comment.author._id)" class="more-option">Szerkesztés</li>
                                            <li v-if="comment.author && isOwner(comment.author._id)" @click.prevent="deleteComment(post._id, comment._id)" class="more-option" style="color: red;">Törlés</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="card-comments-body">
                                <p :class="'comment-description ' + comment._id" v-html="filterText(comment.description)"></p>
                                <img v-if="(comment.file != 'none') && functions.getFileType(comment.file) == 'image'" :src="comment.file" alt="commentimg" class="comment-image">
                                <video v-if="comment.file != 'none' && functions.getFileType(comment.file) == 'video'" :src="comment.file" class="comment-image" controls></video>
                                <div class="card-comments-footer">
                                    <button @click="editComment(post._id, comment._id, 'like')" class="like-button comment-button">
                                    <i class="fa-solid fa-heart" :style="{ color: comment.likes.includes(currentUser._id) ? 'red' : 'black' }"></i> {{ comment.likes.length }} kedvelés</button>
                                    <button class="comment-button" @click="showReplies(comment._id)"><i class="fa-solid fa-comment"></i> {{ comment.replies.length }} válasz</button>
                                    <div :class="'reply-modal-overlay ' + comment._id">
                                        <div class="modal">
                                            <div class="modal-header">
                                                <h2>Válaszok <span class="username-roles">{{ comment.author.profile.username }}</span> részére</h2>
                                                <button @click="showReplies(comment._id)" class="modal-close-button" aria-label="Close modal">&times;</button>
                                            </div>
                                            <div class="modal-body">
                                                <div v-if="comment.replies.length == 0" class="reply">
                                                    <div class="left-side">
                                                        <img src="https://i.imgur.com/ceDUpKL.png" class="user-picture" alt="userpfp">
                                                        <span class="username-roles">WoBo</span>
                                                        <p>Egyelőre üres itt, tégy ellene!</p>
                                                    </div>
                                                </div>
                                                <div v-else class="reply" v-for="reply in comment.replies" :key="reply._id">
                                                    <div class="left-side">
                                                        <img :src="reply.author ? reply.author.profile.profilePicture : 'https://i.imgur.com/ceDUpKL.png'" class="user-picture" alt="userpfp">
                                                        <span class="username-roles" v-if="!reply.author">Törölt fiók</span>
                                                        <span class="username-roles" v-else v-html="functions.renderUserRoles(reply.author)"></span>
                                                        <p :class="'reply-description ' + reply._id" v-html="filterText(reply.description)"></p>
                                                    </div>
                                                    <div class="right-side">
                                                        <button @click="editReply(post._id, comment._id, reply._id, 'like')" class="like-button reply-button">
                                                        <i class="fa-solid fa-heart" :style="{ color: reply.likes.includes(currentUser._id) ? 'red' : 'black' }"></i> {{ reply.likes.length }} kedvelés</button>
                                                        <div class="more-button">
                                                            <div class="more-button-icon">
                                                                <div class="more-button-dot"></div>
                                                                <div class="more-button-dot"></div>
                                                                <div class="more-button-dot"></div>
                                                            </div>
                                                            <ul class="more-options">
                                                                <li class="more-option" @click="copyId(reply._id)">Másolás</li>
                                                                <li v-if="reply.author && isOwner(reply.author._id)" class="more-option">Szerkesztés</li>
                                                                <li v-if="reply.author && isOwner(reply.author._id)" @click.prevent="deleteReply(post._id, comment._id, reply._id)" class="more-option" style="color: red;">Törlés</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <form @submit.prevent="createReply(currentUser._id, post._id, comment._id)" :class="'reply-textarea-container ' + comment._id">
                                                    <div class="file-list">
                                                        <div class="file" v-for="(file, index) in fileListReply" :key="index">
                                                            <div class="preview"><img :src="file.url" alt="File Thumbnail" /></div>
                                                            <i class="fa-solid fa-trash" @click="removeFile(index, comment._id, 'reply')"></i>
                                                        </div>
                                                    </div>
                                                    <div class="bottom">
                                                        <label>
                                                            <input type="file" ref="fileInput" @change="uploadFileReply($event, comment._id)" style="display: none;"/>
                                                            <span><i class="fa-solid fa-upload"></i></span>
                                                        </label>
                                                        <textarea type="text" class="create-reply" placeholder="Válaszolj rá..." v-model="reply" name="create-reply" maxlength="200"></textarea>
                                                        <button type="submit" title="sendbutton"><i class="fa-solid fa-paper-plane send-button"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { userStore, postStore, commentStore, replyStore, notificationStore } from '@/store';
import functions from '@/assets/ts/functions';

const { currentUser } = storeToRefs(userStore);
const { posts } = storeToRefs(postStore);
const comment = ref('');
const reply = ref('');
const post = ref('');
const file = ref();
const uploadedFile = ref();
const url = ref('');
const fileListComment = ref([] as any);
const fileListReply = ref([] as any);
const isModalVisible = ref(false);

function isOwner(userId: string) {
    return currentUser.value._id == userId;
}

function copyId(id: string) {
    navigator.clipboard.writeText(id);

    notificationStore.addNotification({
        id: 0,
        type: 'success',
        message: 'Másolva a vágólapra!',
    });
}

function copyLink(id: string) {
    navigator.clipboard.writeText('https://social.' + functions.getDomain() + '/post/' + id);

    notificationStore.addNotification({
        id: 0,
        type: 'success',
        message: 'Másolva a vágólapra!',
    });
}

function showComments(postId: string) {
    const comments = document.getElementsByClassName('card-comments ' + postId)[0] as HTMLDivElement;
    comments.classList.toggle('active');
}

function showReplies(commentId: string) {
    const replies = document.getElementsByClassName('reply-modal-overlay ' + commentId)[0] as HTMLDivElement;
    replies.classList.toggle('active');
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

function removeFile(index: number, id: string, type: string) {
    if(type === 'comment') {
        fileListComment.value.splice(index, 1);
        if(fileListComment.value.length == 0) {
            const inputElement = document.getElementsByClassName(`textarea-container ${id}`)[0] as HTMLInputElement;
            inputElement.style.minHeight = '';
        }
    } else if(type === 'reply') {
        fileListReply.value.splice(index, 1);
        if(fileListReply.value.length == 0) {
            const inputElement = document.getElementsByClassName(`reply-textarea-container ${id}`)[0] as HTMLInputElement;
            inputElement.style.minHeight = '';
        }
    }
}

function filterText(message: any) {
    let result = message;
    // const mentionedUsers = activeChat.value.users.map((user: any) => user.user.profile.username);
    // const mentionRegex = new RegExp(`@(${mentionedUsers.join('|')})\\b`, 'g');
    // result = result.replace(mentionRegex, '<span class="mention" style="color: red;">$&</span>');

    const isUrl = message.match(/\bhttps?:\/\/\S+\b/g);
    const imageRegex = /\.(png|jpg|jpeg|gif)$/i;
    const videoRegex = /\.(mp4|mov|avi)$/i;
    const audioRegex = /\.(mp3|ogg|wav)$/i;
    if (isUrl) {
        isUrl.forEach((url: any) => {
            let mediaElement = '';

            if (imageRegex.test(url)) {
                mediaElement = `<img src="${url}" style="max-width: 100%; max-height: 100%;" alt="Image"/>`;
            } else if (videoRegex.test(url)) {
                mediaElement = `<video controls style="max-width: 100%; max-height: 100%;"><source src="${url}" type="video/mp4"></video>`;
            } else if (audioRegex.test(url)) {
                mediaElement = `<audio controls style="max-width: 100%; max-height: 100%;"><source src="${url}" type="audio/mpeg"></audio>`;
            } else {
                mediaElement = `<a href="${url}" target="_blank">${url}</a>`;
            }

            const isFileAlone = result.trim() === url.trim();

            result = isFileAlone ? result.replace(url, mediaElement) : result.replace(url, `<br/>&nbsp;${mediaElement}`);
        });
    }

    return result;
}

function uploadFile(event: any) {
    file.value = event.target.files[0];
    url.value = URL.createObjectURL(file.value);
    const filetype = functions.getFileType(event.target.files[0].name);

    if(filetype == 'unknown') {
        file.value = '';
        url.value = '';
        notificationStore.addNotification({
            id: 0,
            type: 'error',
            message: 'Nem támogatott fájlformátum!',
        });
    }

    if(event.target.files[0].size > 209000000) {
        file.value = '';
        url.value = '';
        notificationStore.addNotification({
            id: 0,
            type: 'error',
            message: 'A fájl túl nagy! >200mb',
        });
    }
}

function uploadFileComment(event: any, id: string) {
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

    fileListComment.value = [];
    const inputElement = document.getElementsByClassName(`textarea-container ${id}`)[0] as HTMLInputElement;
    inputElement.style.minHeight = '21.5vh';
    fileListComment.value.push(newFile);
}

function uploadFileReply(event: any, id: string) {
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

    fileListReply.value = [];
    const inputElement = document.getElementsByClassName(`reply-textarea-container ${id}`)[0] as HTMLInputElement;
    inputElement.style.minHeight = '21.5vh';
    fileListReply.value.push(newFile);
}

async function createPost() {
    if(!file.value) {
            file.value = 'none';
    } else {
        const formData = new FormData();
        if(file.value.type.includes('image')) {
            formData.append('image', file.value);
        } else if(file.value.type.includes('video')) {
            formData.append('video', file.value);
        }
        let res: any;
        await postStore.uploadImage(formData).then((resp: any) => res = resp);
        if(!res.data.success) {
            notificationStore.addNotification({
                id: 0,
                type: 'error',
                message: res,
            });
            return;
        }

        uploadedFile.value = res.data.data.link;
    }

    const postToCreate = {
        author: currentUser.value._id,
        description: post.value,
        file: uploadedFile.value || 'none',
    }

    postStore.createPost(postToCreate).then(async (res: any) => {
        if(res.data.success) {
            isModalVisible.value = false;
            file.value = '';
            uploadedFile.value = '';
            url.value = '';
            post.value = '';
            await postStore.getAllPost();

            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres bejegyzés készítés.',
                type: 'success'
            });
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: postStore.error || err,
            type: 'error'
        });
    })
}

function openPost(post: string) {
    navigateTo('/post/' + post);
}

async function createComment(postId: string) {
    if(comment.value.length < 1 && fileListComment.value.length < 1) return;

    let lastComment: any;
    if(comment.value.length > 1) {
        const commentToCreate = {
            author: currentUser.value._id,
            postId: postId,
            description: comment.value,
        }

        commentStore.createComment(commentToCreate).then(async (res: any) => {
            if(res.data.success) {
                await postStore.getAllPost();
                comment.value = '';
                lastComment = res.data.comment

                notificationStore.addNotification({
                    id: 0,
                    message: 'Sikeres hozzászólás.',
                    type: 'success'
                });
            }
        });
    }

    if(fileListComment.value.length > 0) {
        if(lastComment) {
            const typingElement = document.getElementsByClassName(`comment-description ${lastComment._id}`)[0] as HTMLDivElement;
            typingElement.innerHTML += ' Fájl feltöltése folyamatban...';
            var interval = setInterval(() => {
                typingElement.innerHTML = switchText(typingElement.innerHTML) as string;
            }, 500) as any;
        } else if(!lastComment && fileListComment.value.length > 0) {
            const commentCard = document.getElementsByClassName(`card-comments ${postId}`)[0] as HTMLDivElement;
            const newPTag = document.createElement('p');
            newPTag.textContent = 'Fájl feltöltése folyamatban...';
            newPTag.classList.add('tempid');
            newPTag.style.marginTop = '20px';
            const commentElement = commentCard.getElementsByClassName('comment')[0] as HTMLDivElement;
            commentCard.insertBefore(newPTag, commentElement)
            var interval = setInterval(() => {
                const typingElement = document.querySelector('p.tempid') as HTMLDivElement;
                typingElement.innerHTML = switchText(typingElement.innerHTML) as string;
            }, 500) as any;
        }

        const file = fileListComment.value[0].file;
        const formData = new FormData();

        if (file.type.includes('image')) {
            formData.append('image', file);
        } else if (file.type.includes('video')) {
            formData.append('video', file);
        }

        removeFile(0, postId, 'comment');

        try {
            let res: any;
            await postStore.uploadImage(formData).then((response) => { res = response });
            if (res.data.success) {
                const commentToCreate = {
                    author: currentUser.value._id,
                    postId: postId,
                    description: res.data.data.link,
                }

                commentStore.createComment(commentToCreate).then(async (res: any) => {
                    if(res.data.success) {
                        clearInterval(interval);
                        await postStore.getAllPost();
                        const tempPTag = document.querySelector('p.tempid');
                        tempPTag?.remove();
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

async function createReply(userId: string, postId: string, commentId: string) {
    if(reply.value.length < 1 && fileListReply.value.length < 1) return;

    let lastReply: any;
    if(reply.value.length > 1) {
        const replyToCreate = {
            author: userId,
            postId: postId,
            commentId: commentId,
            description: reply.value,
        }

        replyStore.createReply(replyToCreate).then(async (res: any) => {
            if(res.data.success) {
                await postStore.getAllPost();
                reply.value = '';
                lastReply = res.data.reply

                notificationStore.addNotification({
                    id: 0,
                    message: 'Sikeres válasz.',
                    type: 'success'
                });
            }
        });
    }

    if(fileListReply.value.length > 0) {
        if(lastReply) {
            const typingElement = document.getElementsByClassName(`reply-description ${lastReply._id}`)[0] as HTMLDivElement;
            typingElement.innerHTML += ' Fájl feltöltése folyamatban...';
            var interval = setInterval(() => {
                typingElement.innerHTML = switchText(typingElement.innerHTML) as string;
            }, 500) as any;
        } else if(!lastReply && fileListReply.value.length > 0) {
            const replyCard = document.getElementsByClassName(`modal-body`)[0] as HTMLDivElement;
            const newPTag = document.createElement('p');
            newPTag.textContent = 'Fájl feltöltése folyamatban...';
            newPTag.classList.add('tempid');
            replyCard.appendChild(newPTag);
            const formElement = replyCard.getElementsByClassName(`reply-textarea-container ${commentId}`)[0] as HTMLDivElement;
            replyCard.insertBefore(newPTag, formElement)
            var interval = setInterval(() => {
                const typingElement = document.querySelector('p.tempid') as HTMLDivElement;
                typingElement.innerHTML = switchText(typingElement.innerHTML) as string;
            }, 500) as any;
        }

        const file = fileListReply.value[0].file;
        const formData = new FormData();

        if (file.type.includes('image')) {
            formData.append('image', file);
        } else if (file.type.includes('video')) {
            formData.append('video', file);
        }

        removeFile(0, commentId, 'reply');

        try {
            let res: any;
            await postStore.uploadImage(formData).then((response) => { res = response });
            if (res.data.success) {
                const replyToCreate = {
                    author: userId,
                    postId: postId,
                    commentId: commentId,
                    description: res.data.data.link
                }

                replyStore.createReply(replyToCreate).then(async (res: any) => {
                    if(res.data.success) {
                        clearInterval(interval);
                        await postStore.getAllPost();
                        const tempPTag = document.querySelector('p.tempid');
                        tempPTag?.remove();
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

function editPost(postId: string, patching: string) {
    let body: object = {};
    switch(patching) {
        case 'like':
            body = {
                liker: currentUser.value._id,
            }
            break;
    }

    postStore.editPost(postId, patching, body).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();

            if(patching != 'like') {
                notificationStore.addNotification({
                    id: 0,
                    message: 'Sikeres bejegyzés szerkesztés.',
                    type: 'success'
                });
            }
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: postStore.error || err,
            type: 'error'
        });
    });
}

function editComment(postId: string, commentId: string, patching: string) {
    let body: object = {};
    switch(patching) {
        case 'like':
            body = {
                liker: currentUser.value._id,
            }
            break;
    }

    commentStore.editComment(postId, commentId, patching, body).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();

            if(patching != 'like') {
                notificationStore.addNotification({
                    id: 0,
                    message: 'Sikeres hozzászólás szerkesztés.',
                    type: 'success'
                });
            }
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: postStore.error || err,
            type: 'error'
        });
    });
}

function editReply(postId: string, commentId: string, replyId: string, patching: string) {
    let body: object = {};
    switch(patching) {
        case 'like':
            body = {
                liker: currentUser.value._id,
            }
            break;
    }

    replyStore.editReply(postId, commentId, replyId, patching, body).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();

            if(patching != 'like') {
                notificationStore.addNotification({
                    id: 0,
                    message: 'Sikeres válasz szerkesztés.',
                    type: 'success'
                });
            }
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: postStore.error || err,
            type: 'error'
        });
    });
}

function deletePost(postId: string) {
    postStore.deletePost(postId, currentUser.value._id).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();

            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres poszt törlés.',
                type: 'success'
            });
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: postStore.error || err,
            type: 'error'
        });
    });
}

function deleteComment(postId: string, commentId: string) {
    commentStore.deleteComment(postId, commentId, currentUser.value._id).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();

            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres hozzászólás törlés.',
                type: 'success'
            });
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: commentStore.error || err,
            type: 'error'
        });
    });
}

function deleteReply(postId: string, commentId: string, replyId: string) {
    replyStore.deleteReply(postId, commentId, replyId, currentUser.value._id).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();

            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres válasz törlés.',
                type: 'success'
            });
        }
    }).catch((err: string) => {
        notificationStore.addNotification({
            id: 0,
            message: replyStore.error || err,
            type: 'error'
        });
    });
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/home.scss';
</style>