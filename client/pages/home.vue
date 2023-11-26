<template>
    <main class="home">
        <div class="welcome-container">
            <div class="welcome">
                <div class="welcome-text">
                    <h1>Üdvözöllek, {{ currentUser.profile.username }}!</h1>
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
                        <span class="username-roles-custom">WoBo</span>
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
                        <span :class="'username-roles-custom ' + post._id">{{ post.author ? post.author.profile.username : 'Törölt fiók' }}</span>
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
                                <li v-if="isOwner(post.author._id)" class="more-option">Szerkesztés</li>
                                <li v-if="isOwner(post.author._id)" @click.prevent="deletePost(post._id)" class="more-option">Törlés</li>
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
                        <form @submit.prevent="createComment(post._id)" class="textarea-container">
                            <textarea type="text" class="create-comment" placeholder="Szólj hozzá..." v-model="comment" name="create-comment" maxlength="200" required></textarea>
                            <button type="submit" title="sendbutton"><i class="fa-solid fa-paper-plane send-button"></i></button>
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
                                    <span :class="'username-roles-custom ' + comment._id">{{ comment.author ? comment.author.profile.username : 'Törölt fiók' }}</span>
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
                                            <li v-if="isOwner(comment.author._id)" class="more-option">Szerkesztés</li>
                                            <li v-if="isOwner(comment.author._id)" @click.prevent="deleteComment(post._id, comment._id)" class="more-option">Törlés</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="card-comments-body">
                                <p class="comment-description">{{ comment.description }}</p>
                                <img v-if="(comment.file != 'none') && functions.getFileType(comment.file) == 'image'" :src="comment.file" alt="commentimg" class="comment-image">
                                <video v-if="comment.file != 'none' && functions.getFileType(comment.file) == 'video'" :src="comment.file" class="comment-image" controls></video>
                                <div class="card-comments-footer">
                                    <button @click="editComment(post._id, comment._id, 'like')" class="like-button comment-button">
                                    <i class="fa-solid fa-heart" :style="{ color: comment.likes.includes(currentUser._id) ? 'red' : 'black' }"></i> {{ comment.likes.length }} kedvelés</button>
                                    <button class="comment-button" @click="showReplies(comment._id)"><i class="fa-solid fa-comment"></i> {{ comment.replies.length }} válasz</button>
                                    <div :class="'reply-modal-overlay ' + comment._id">
                                        <div class="modal">
                                            <div class="modal-header">
                                                <h2>Válaszok <span :class="'username-roles-custom ' + comment._id">{{ comment.author.profile.username }}</span> részére</h2>
                                                <button @click="showReplies(comment._id)" class="modal-close-button" aria-label="Close modal">&times;</button>
                                            </div>
                                            <div class="modal-body">
                                                <div v-if="comment.replies.length == 0" class="reply">
                                                    <div class="left-side">
                                                        <img src="https://i.imgur.com/ceDUpKL.png" class="user-picture" alt="userpfp">
                                                        <span class="username-roles-custom">WoBo</span>
                                                        <p>Egyelőre üres itt, tégy ellene!</p>
                                                    </div>
                                                </div>
                                                <div v-else class="reply" v-for="reply in comment.replies" :key="reply._id">
                                                    <div class="left-side">
                                                        <img :src="reply.author ? reply.author.profile.profilePicture : 'https://i.imgur.com/ceDUpKL.png'" class="user-picture" alt="userpfp">
                                                        <span :class="'username-roles-custom ' + reply._id">{{ reply.author ? reply.author.profile.username : 'Törölt fiók' }}</span>
                                                        <p>{{ reply.description }}</p>
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
                                                                <li v-if="isOwner(reply.author._id)" class="more-option">Szerkesztés</li>
                                                                <li v-if="isOwner(reply.author._id)" @click.prevent="deleteReply(post._id, comment._id, reply._id)" class="more-option">Törlés</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <form @submit.prevent="createReply(currentUser._id, post._id, comment._id)" class="reply-textarea-container">
                                                    <textarea type="text" class="create-reply" placeholder="Válaszolj rá..." v-model="reply" name="create-reply" maxlength="200" required></textarea>
                                                    <button type="submit" title="sendbutton"><i class="fa-solid fa-paper-plane send-button"></i></button>
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
import axios from 'axios';
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

function createComment(postId: string) {
    const commentElement = document.getElementsByClassName('create-comment')[0] as HTMLTextAreaElement;
    const commentToCreate = {
        author: currentUser.value._id,
        postId: postId,
        description: comment.value,
    }

    commentStore.createComment(commentToCreate).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();
            commentElement.value = '';

            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres hozzászólás.',
                type: 'success'
            });
        }
    });
}

function createReply(userId: string, postId: string, commentId: string) {
    const replyElement = document.getElementsByClassName('create-reply')[0] as HTMLTextAreaElement;

    const replyToCreate = {
        author: userId,
        postId: postId,
        commentId: commentId,
        description: reply.value,
    }

    replyStore.createReply(replyToCreate).then(async (res: any) => {
        if(res.data.success) {
            await postStore.getAllPost();
            replyElement.value = '';

            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres válasz.',
                type: 'success'
            });
        }
    });
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

function editComment(postId: string, commentId: number, patching: string) {
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

function editReply(postId: string, commentId: number, replyId: number, patching: string) {
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
    postStore.deletePost(postId).then(async (res: any) => {
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

function deleteComment(postId: string, commentId: number) {
    commentStore.deleteComment(postId, commentId).then(async (res: any) => {
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

function deleteReply(postId: string, commentId: number, replyId: number) {
    replyStore.deleteReply(postId, commentId, replyId).then(async (res: any) => {
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
