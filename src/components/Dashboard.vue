<template>
  <div>
    <h1>Dashboard</h1>
  </div>

  <div class="col-2 lg:col-2 xl:col-2">
    <div class="card mb-0">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">Cărți în colecție</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl"> {{ numarCarti }}</div>
        </div>
        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
          style="width: 2.5rem; height: 2.5rem">
          <router-link to="/carti">
            <i class="pi pi-book text-blue-500 !text-xl"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CartiService } from '@/services/carti-service';

const numarCarti = ref(CartiService.cartiGetCount());

</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>