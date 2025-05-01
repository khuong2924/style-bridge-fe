<template>
    <MainLayout>
      <div class="container py-16">
        <div class="flex flex-col items-center justify-center text-center">
          <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 class="text-3xl font-semibold text-gray-900 mb-6">Không tìm thấy trang</h2>
          <p class="text-lg text-gray-600 max-w-md mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <BaseButton 
            variant="primary" 
            size="lg"
            @click="$router.push('/')"
          >
            Quay lại trang chủ
          </BaseButton>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  </script>
  