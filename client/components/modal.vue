<template>
    <div>
        <div class="modal-overlay" v-if="isVisible" @click="closeModal"></div>
        <div class="modal" v-if="isVisible">
            <div class="modal-content">
                <button @click="closeModal" class="close-btn">X</button>
                <h2>{{ title }}</h2>
                <p v-html="description"></p>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
const props = defineProps(['isVisible', 'title', 'description']);
const emit = defineEmits(['closeModal']);

function closeModal() {
  emit('closeModal');
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/modal.scss';
</style>
  