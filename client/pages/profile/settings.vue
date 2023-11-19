<template>
    <div class="settings-header">
      <div class="settings-box">
        <div class="left-section">
          <div class="profile-settings-header">
            <div class="change-pfp">
              <input type="file" id="display-pfp" @change="changeImage($event, 'pfp')" accept="image/*">
              <label for="display-pfp">
                <i class="fa fa-file-image"></i>
              </label>
              <img :src="previewpfp ? previewpfp : currentUser.profile.profilePicture" alt="pfp">
            </div>
            <h3 class="username-roles notranslate">{{ currentUser.profile.username }}</h3>
          </div>
          <div class="buttons">
            <button @click="showPage(0)">Fiókom</button>
            <button @click="showPage(1)">Megjelenés</button>
            <button @click="showPage(2)">Értesítések</button>
            <button @click="showPage(3)">Napló</button>
            <button @click="showPage(4)">Biztonság</button>
          </div>
        </div>
        <div class="right-section">
          <div class="section account">
            <h2>Fiók beállítások</h2>
            <form @submit.prevent="saveUser(currentUser._id, 'profile', '')" v-if="currentUser.profile.username" class="change form">
                <div class="change-row">
                    <input type="text" v-model="currentUser.profile.username" class="change-input" id="ch-us" minlength="3" maxlength="20" required>
                    <label for="ch-us" class="change-label">Felhasználónév</label>
                </div>
                <div class="change-row">
                    <input type="text" v-model="currentUser.profile.name" class="change-input" id="ch-na" minlength="4" maxlength="20" required>
                    <label for="ch-na" class="change-label">Teljes név</label>
                </div>
                <div class="change-row">
                    <input type="email" v-model="currentUser.profile.email" class="change-input" id="ch-em" minlength="6" maxlength="30" required>
                    <label for="ch-em" class="change-label">Email cím</label>
                </div>
                <div class="change-row">
                    <input type="text" v-model="currentUser.profile.biography" class="change-input" id="ch-bg" minlength="4" maxlength="30" required>
                    <label for="ch-bg" class="change-label">Biográfia</label>
                </div>
                <!-- <div class="change-row">
                    <input type="password" v-model="password" class="change-input" id="ch-pw" minlength="6">
                    <label for="ch-pw" class="change-label">Jelszó</label>
                </div> -->
                <div class="change-row">
                    <button class="change-button" type="submit">Mentés</button>
                </div>
            </form>
          </div>
          <div class="section appearance">
            <h2>Megjelenés</h2>
            <div class="bg-image">
              <h3>Háttérkép</h3>
              <div class="upload-img">
                <input type="file" id="upload-img" @change="changeImage($event, 'bgimage.value')" accept="image/*">
                <i class="fa fa-trash" @click="saveUser(currentUser._id, 'appearance', 'deletebgimage.value')"></i>
                <label for="upload-img">
                  <i class="fa fa-file-image"></i>
                </label>
                <img :src="previewbg ? previewbg : bgimage" alt="bg-image">
              </div>
              <button type="submit" @click="saveUser(currentUser._id, 'appearance', 'setbgimage')" class="submit-btn">
                Mentés
              </button>
            </div>
            <div class="set-theme">
                <h3>Téma kiválasztása</h3>
                <a @click="saveUser(currentUser._id, 'appearance', { setting: 'theme', theme: 'theme1' })">Téma 1.</a>
                <a @click="saveUser(currentUser._id, 'appearance', { setting: 'theme', theme: 'theme2' })">Téma 2.</a>
                <a @click="saveUser(currentUser._id, 'appearance', { setting: 'theme', theme: 'theme3' })">Téma 3.</a>
                <a @click="saveUser(currentUser._id, 'appearance', { setting: 'theme', theme: 'theme4' })">Téma 4.</a>
            </div>
            <hr>
            <div class="profile-iframe">
                <h3>Profil Iframe</h3>
                <h4>A Profile Iframe a <router-link to="/profile">Profilod</router-link>-hoz hasonló kártya szerűség, 
                    amelyet felhasználhatsz más weboldalakon is.</h4>
                <button class="profile-iframe-copy" @click="copyIframe">Másolás</button>
            </div>
          </div>
          <div class="section notifications">
            <h2><i class="fa fa-refresh" @click="userStore.getCurrentUser"></i> Értesítések kezelése <i class="fa fa-trash" @click="removeNotifications(currentUser._id)"></i></h2>
            <div class="section-notifications">
              <div class="notification" v-for="notification in currentUser.profile.notificationList" :key="notification._id" :title="(formatDateToText(notification.createdAt))">
                <h2><img :src="notification.profilePicture" alt="pfp"> {{ notification.title }}</h2>
                <h3>{{ notification.message }}</h3>
              </div>
            </div>
          </div>
          <div class="section logs">
            <h2>Bejelentkezési napló</h2>
            <div class="ip-list">
              <div class="ip" v-for="ip in currentUser.profile.ipList" :key="ip._id">
                <h4>{{ ip.ip }} - {{ formatDateToText(ip.loggedAt) }}</h4>
              </div>
            </div>
          </div>
          <div class="section security">
            <h2>Biztonsági beállítások</h2>
            <div class="privacy-settings" v-if="currentUser.privacy">
              <h3>A profilomon látszódjon a Teljes nevem</h3>
              <label class="switch name">
                <input type="checkbox" v-model="currentUser.privacy.showName" @click="saveUser(currentUser._id,
                'privacy', { showName: currentUser.privacy.showName = !currentUser.privacy.showName })">
                <span class="slider round"></span>
              </label>
              <h3>A profilomon látszódjon az Email címem</h3>
              <label class="switch email">
                <input type="checkbox" v-model="currentUser.privacy.showEmail" @click="saveUser(currentUser._id,
                'privacy', { showEmail: currentUser.privacy.showEmail = !currentUser.privacy.showEmail })">
                <span class="slider round"></span>
              </label>
            </div>
            <form @submit.prevent="removeUser(currentUser._id)">
              <a @click="removeUserModal(true)" class="modal-opener">Fiók törlése</a>
              <div id="modal">
                <div class="modal-content">
                  <h4>A fiók törlése visszavonhatatlan!</h4>
                  <div class="buttons">
                    <a @click="removeUserModal(false)">Mégsem</a>
                    <button type="submit" class="submit-btn">Törlés</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { userStore, notificationStore } from '@/store';
import functions from '@/assets/ts/functions';

const { currentUser, error } = storeToRefs(userStore);
const pfp = ref();
const previewpfp = ref();
const previewbg = ref();
const bgimage = ref();
const bglink = ref('');
const password = ref('');
const notifications = ref('');
const link = ref('');

function checkUserRoles() {
    functions.userRoles(currentUser.value.profile.roles);
}

function formatDateToText(ipDate: any): string {
    return functions.formatDate(ipDate);
}

function changeImage(e: any, option: string) {
    if(option == 'pfp') {
        pfp.value = e.target.files[0];
        if(pfp.value) previewpfp.value = URL.createObjectURL(pfp.value);

        notificationStore.addNotification({
            id: 0,
            message: 'Ez csak egy előnézet, mentsd el a Fiókom menüben a Mentés gombbal.',
            type: 'information'
        });
    }

    if(option == 'bgimage.value') {
        bgimage.value = e.target.files[0];
        previewbg.value = URL.createObjectURL(bgimage.value);

        notificationStore.addNotification({
            id: 0,
            message: 'Ez csak egy előnézet, mentsd el a Mentés gombbal.',
            type: 'information'
        });
    }
}

async function saveUser(userId: string, option1: string, option2: any) {
    let patchedUserSettings: object = {};
    let query: string = '';

    switch(option1) {
        case 'profile':
            query = 'profile';
            if(password.value.length > 0) {
                const element = document.getElementById('ch-pw') as HTMLInputElement;
                element.required = true;
            }

            if(pfp.value) {
                const formData = new FormData();
                formData.append('image', pfp.value as string);

                await userStore.uploadImage(formData).then(res => {
                    link.value = res.data.data.link;
                });
            }
            
            patchedUserSettings = {
                username: currentUser.value.profile.username,
                name: currentUser.value.profile.name,
                email: currentUser.value.profile.email,
                biography: currentUser.value.profile.biography,
                profilePicture: link.value ? link.value : currentUser.value.profile.profilePicture,
                password: password.value ? password.value : undefined,
            }
            break;
        case 'appearance':
            query = 'appearance';
            if(bgimage.value) {
                const formData = new FormData();
                formData.append('image', bgimage.value);

                await userStore.uploadImage(formData).then(res => {
                    bglink.value = res.data.data.link;
                });
            }

            if(option2.showNav == true || option2.showNav == false) {
                if(option2.showNav == true) {
                    (document.querySelector('nav') as HTMLElement).style.display = 'block';
                }
                if(option2.showNav == false) {
                    (document.querySelector('nav') as HTMLElement).style.display = 'none';
                }
                patchedUserSettings = {
                    showNav: option2.showNav
                }
            }

            if(option2.showFooter == true || option2.showFooter == false) {
                if(option2.showFooter == true) {
                    (document.querySelector('footer') as HTMLElement).style.display = 'block';
                }
                if(option2.showFooter == false) {
                    (document.querySelector('footer') as HTMLElement).style.display = 'none';
                }
                patchedUserSettings = {
                    showFooter: option2.showFooter
                }
            }

            if(option2 == 'setbgimage') {
                if(bglink) {
                    document.body.style.backgroundImage = 'url(' + bglink + ')';
                    document.body.style.backgroundRepeat = 'no-repeat';
                    document.body.style.backgroundSize = 'auto';
                    document.body.style.animation = 'none';
                }

                patchedUserSettings = {
                    backgroundImage: bglink ? bglink : 'none',
                }
            }

            if(option2.setting == 'theme') {
                document.documentElement.setAttribute('data-theme', option2.theme);
                patchedUserSettings = {
                    theme: option2.theme
                }
            }

            if(option2 == 'deletebgimage.value') {
                window.location.reload();

                patchedUserSettings = {
                    backgroundImage: 'none',
                }
            }
            break;
        case 'privacy':
            query = 'privacy';
            patchedUserSettings = {
                showName: (document.querySelector('.switch.name input[type="checkbox"]') as HTMLInputElement).checked,
                showEmail: (document.querySelector('.switch.email input[type="checkbox"]') as HTMLInputElement).checked
            }
            break;
    }

    userStore.updateUserData(userId, query, patchedUserSettings).then(res => {
        if(res.data.success) {
            notificationStore.addNotification({
                id: 0,
                message: res.data.message,
                type: 'success'
            });
        }
    }).catch(() => {
        notificationStore.addNotification({
            id: 0,
            message: userStore.error,
            type: 'error'
        });
    });
}

function checkbgimage() {
    bgimage.value = currentUser.value.appearance.backgroundImage
}

function copyIframe() {
    if(!window.isSecureContext) {
        notificationStore.addNotification({
            id: 0,
            message: 'Sikertelen másolás. Kérlek használj biztonságos kapcsolatot. (https://)',
            type: 'error'
        })
    } else {
        const url = `<iframe src="${location.hostname}/profile/iframe/${currentUser.value._id}" frameborder="0" width="320" height="420px"></iframe>`;
        navigator.clipboard.writeText(url).then(() => {
            notificationStore.addNotification({
                id: 0,
                message: 'Sikeres másolás.',
                type: 'success'
            })
        });
    }
}

function removeUser(userId: string) {
    userStore.deleteUser(userId).then(res => {
        if(res.data.success) {
            navigateTo('/auth');
            notificationStore.addNotification({
                id: 0,
                message: res.data.message,
                type: 'success'
            });
        }
    }).catch(() => {
        notificationStore.addNotification({
            id: 0,
            message: error.value,
            type: 'error'
        });
    });
}

function removeNotifications(userId: string) {
    userStore.updateNotificationSettings(userId, 'delete').then(res => {
        if(res.data.success) {
            notificationStore.addNotification({
                id: 0,
                message: res.data.message,
                type: 'success'
            });
            userStore.getCurrentUser();
        }
    }).catch(err => {
        notificationStore.addNotification({
            id: 0,
            message: err,
            type: 'error'
        });
    });
}

function removeUserModal(value: boolean) {
    const modal = document.getElementById('modal') as HTMLDivElement;

    if(value) {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

function showPage(pageName: number) {
    const section = document.getElementsByClassName('section') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < section.length; i++) {
        section[i].style.display = 'none';
    }
    section[pageName].style.display = 'block';
}

onMounted(() => {
    checkUserRoles();
    checkbgimage();
}); 
</script>

<style lang="scss" scoped>
@import '@/assets/scss/profile/settings.scss';
</style>