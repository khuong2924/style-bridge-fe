<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl mb-4">Modal Test Page</h1>
    
    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <button 
        @click="showModal = true" 
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Modal
      </button>
    </div>
    
    <!-- Simple Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showModal = false"></div>
      <div class="relative bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Test Modal</h2>
        <p class="mb-4">This is a test modal</p>
        <button 
          @click="showModal = false" 
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script> 