<template>
  <div class="login min-h-screen flex items-center justify-center">
    <!-- Nền với hiệu ứng gradient xám đen và overlay pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 opacity-80 z-0"></div>
    <div class="absolute inset-0 bg-pattern z-0 opacity-5"></div>
    
    <!-- Container chính hai cột -->
    <div class="container mx-auto z-10">
      <div class="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
        
        <!-- Cột trái - Hình ảnh và slogan -->
        <div class="md:w-1/2 relative hidden md:block">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?q=80&w=2069&auto=format&fit=crop" 
            alt="Makeup Artist" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div class="mt-10">
              <h1 class="text-4xl font-bold mb-4 drop-shadow-md transform translate-y-3 opacity-0 animate-fade-in-down">
                StyleBridge
              </h1>
              <p class="text-xl font-light mb-8 max-w-md leading-relaxed drop-shadow-md transform translate-y-3 opacity-0 animate-fade-in-down animation-delay-200">
                Nền tảng kết nối nghệ sĩ trang điểm và khách hàng hàng đầu Việt Nam
              </p>
              <div class="space-y-4 transform translate-y-3 opacity-0 animate-fade-in-down animation-delay-400">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <p>Kết nối với nghệ sĩ trang điểm hàng đầu</p>
                </div>
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Trải nghiệm dịch vụ chất lượng cao</p>
                </div>
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Đặt lịch nhanh chóng, tiện lợi</p>
                </div>
              </div>
            </div>
            <div class="mb-10 transform translate-y-3 opacity-0 animate-fade-in-down animation-delay-600">
              <p class="text-white/70 italic">"Vẻ đẹp bắt đầu từ khoảnh khắc bạn quyết định là chính mình."</p>
              <p class="font-semibold mt-2">— Coco Chanel</p>
            </div>
          </div>
        </div>
        
        <!-- Cột phải - Form đăng nhập -->
        <div class="md:w-1/2 p-8 md:p-12">
          <div class="max-w-md mx-auto">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Chào mừng trở lại!</h2>
            </div>
            
            <form class="space-y-6" @submit.prevent="handleLogin">
              <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-sm animate-shake" role="alert">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p>{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-5">
                <div class="group relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-gray-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    v-model="username"
                    name="username"
                    type="text"
                    required
                    autocomplete="username"
                    class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition-all text-gray-900"
                    placeholder="Tên đăng nhập"
                  />
                </div>
                <div class="group relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-gray-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition-all text-gray-900"
                    placeholder="Mật khẩu"
                  />
                  <button 
                    type="button" 
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                    @click="showPassword = !showPassword"
                  >
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    v-model="rememberMe"
                    class="h-5 w-5 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                    Nhớ tài khoản
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" class="font-medium text-gray-600 hover:text-black transition">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-lg text-white bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  :disabled="isLoading"
                >
                  <span class="absolute left-0 inset-y-0 flex items-center pl-3" v-if="isLoading">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-300 group-hover:text-gray-200 transition" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
                </button>
              </div>
            </form>
            
            <div class="mt-8">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                </div>
              </div>
              
              <div class="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path>
                    </svg>
                  </a>
                </div>
                <div>
                  <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.838c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.337-.012 2.415-.012 2.742 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
                    </svg>
                  </a>
                </div>
                <div>
                  <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.1 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-8">
              <p class="text-sm text-gray-600">
                Chưa có tài khoản?
                <router-link to="/register" class="font-medium text-gray-600 hover:text-black transition">
                  Đăng ký ngay
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Debug information
    console.log('Login request initiated');
    console.log('API URL:', window.API_URL);
    console.log('IDENTITY_API_PATH:', window.IDENTITY_API_PATH);
    console.log('Full URL:', `${window.API_URL}${window.IDENTITY_API_PATH}/auth/signin`);
    
    await authStore.login(username.value, password.value);
    
    // Chuyển hướng người dùng
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      // Hiển thị thông báo lỗi từ backend
      console.error('Error response:', error.response.data);
      errorMessage.value = error.response.data.message || 'Đăng nhập không thành công. Vui lòng thử lại.';
    } else {
      errorMessage.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
}
</style>