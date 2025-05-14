<template>
  <div class="register min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
        <p class="mt-2 text-sm text-gray-600">
          Hoặc
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            đăng nhập nếu đã có tài khoản
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>
        
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              id="username"
              v-model="formData.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Tên đăng nhập"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận mật khẩu"
            />
          </div>
          
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              id="role"
              v-model="formData.role"
              name="role"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="user">Người dùng thông thường</option>
              <option value="artist">Nghệ sĩ trang điểm</option>
            </select>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            v-model="formData.acceptTerms"
            required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            Tôi đồng ý với <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">điều khoản và điều kiện</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="isLoading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3" v-if="isLoading">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  acceptTerms: false
});

const handleRegister = async () => {
  // Validate form
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp';
    return;
  }
  
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Prepare data for API
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: [formData.role === 'artist' ? 'artist' : 'user']
    };
    
    // Call register API
    await authService.register(userData);
    
    // Show success notification
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    
    // Redirect to login page
    router.push('/login');
  } catch (error) {
    console.error('Register error:', error);
    if (error.response) {
      // Display error message from backend
      errorMessage.value = error.response.data.message || 'Đăng ký không thành công. Vui lòng thử lại.';
    } else {
      errorMessage.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>