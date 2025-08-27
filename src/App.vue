<script setup>
import { onMounted } from 'vue'

import { CartiService } from '@/services/carti-service';

onMounted(async () => {
  await CartiService.getCartiInitial();
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>