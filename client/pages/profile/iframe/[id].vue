<template>
    <div class="card">
      <div class="card-top"></div>
      <div class="avatar-holder">
        <img :src="user.profile?.profilePicture" alt="pfp">
      </div>
      <div class="name">
        <h3 class="username-roles">{{ user.profile?.username }}</h3>
        <p>{{ user.profile?.biography }}</p>
      </div>
      <div class="card-info">
        <div class="followers">
          <h6>Követők <i class="fa fa-users" aria-hidden="true"></i></h6>
          <p>0</p>
        </div>
        <div class="following">
          <h6>Követés <i class="fa fa-user-plus" aria-hidden="true"></i></h6>
          <p>0</p>
        </div>
        <div class="posts">
          <h6>Bejegyzések <i class="fas fa-edit"></i></h6>
          <p>0</p>
        </div>
      </div>
      <div class="card-footer">
        <h4 v-if="user.privacy?.showName">Teljes név</h4>
        <h5 v-if="user.privacy?.showName">{{ user.profile?.name }}</h5>
        <h4 v-if="user.privacy?.showEmail">Email cím</h4>
        <h5 v-if="user.privacy?.showEmail">{{ user.profile?.email }}</h5>
        <h4 v-if="!user.privacy?.showName && !user.privacy?.showEmail">A felhasználó adatai privátak</h4>
      </div>
    </div>
</template>

<script setup lang=ts>
import { storeToRefs } from 'pinia';
import { userStore } from '@/store';

const { user } = storeToRefs(userStore);

onBeforeMount(async () => {
    await userStore.getUser(useRoute().params.id)
});
</script>

<style lang="scss">
@import '@/assets/scss/profile/iframe.scss';
</style>