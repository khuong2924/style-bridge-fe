<template>
    <div class="flex flex-col min-h-screen">
      <header class="sticky top-0 z-50 bg-white shadow-sm">
        <div class="container">
          <div class="flex items-center justify-between h-16">
            <router-link to="/" class="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" class="h-8 w-auto" />
              <span class="text-xl font-bold text-primary">MakeupConnect</span>
            </router-link>
            
            <nav class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="py-2 text-gray-700 hover:text-primary transition-colors">Trang chủ</router-link>
              <router-link to="/jobs" class="py-2 text-gray-700 hover:text-primary transition-colors">Tìm việc</router-link>
              <router-link to="/artists" class="py-2 text-gray-700 hover:text-primary transition-colors">Tìm nghệ sĩ</router-link>
              <router-link to="/about" class="py-2 text-gray-700 hover:text-primary transition-colors">Giới thiệu</router-link>
            </nav>
            
            <div class="hidden md:flex items-center space-x-4">
              <div v-if="isLoggedIn" class="flex items-center">
                <BaseButton 
                  variant="ghost" 
                  icon="Bell" 
                  class="mr-2"
                  @click="toggleNotifications"
                />
                
                <div class="relative">
                  <div 
                    class="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    @click="toggleUserMenu"
                  >
                    <img :src="user.avatar || '/placeholder-avatar.jpg'" alt="Avatar" class="h-8 w-8 rounded-full object-cover" />
                    <span class="text-sm font-medium">{{ user.name }}</span>
                    <ChevronDown size="16" />
                  </div>
                  
                  <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                    <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size="16" class="mr-3" />
                      <span>Hồ sơ cá nhân</span>
                    </router-link>
                    <router-link to="/dashboard" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LayoutDashboard size="16" class="mr-3" />
                      <span>Bảng điều khiển</span>
                    </router-link>
                    <router-link to="/settings" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings size="16" class="mr-3" />
                      <span>Cài đặt</span>
                    </router-link>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button @click="logout" class="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-gray-100 text-left">
                      <LogOut size="16" class="mr-3" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <template v-else>
                <BaseButton 
                  variant="ghost" 
                  @click="$router.push('/login')"
                >
                  Đăng nhập
                </BaseButton>
                <BaseButton 
                  variant="primary" 
                  @click="$router.push('/register')"
                >
                  Đăng ký
                </BaseButton>
              </template>
            </div>
            
            <button class="md:hidden flex items-center" @click="toggleMobileMenu">
              <Menu v-if="!showMobileMenu" size="24" />
              <X v-else size="24" />
            </button>
          </div>
        </div>
      </header>
      
      <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-gray-100">
        <div class="container py-2">
          <router-link to="/" class="block py-3 text-gray-700 hover:text-primary">Trang chủ</router-link>
          <router-link to="/jobs" class="block py-3 text-gray-700 hover:text-primary">Tìm việc</router-link>
          <router-link to="/artists" class="block py-3 text-gray-700 hover:text-primary">Tìm nghệ sĩ</router-link>
          <router-link to="/about" class="block py-3 text-gray-700 hover:text-primary">Giới thiệu</router-link>
          
          <div class="border-t border-gray-100 my-2"></div>
          
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="block py-3 text-gray-700 hover:text-primary">Đăng nhập</router-link>
            <router-link to="/register" class="block py-3 text-primary font-medium">Đăng ký</router-link>
          </template>
          <template v-else>
            <router-link to="/profile" class="block py-3 text-gray-700 hover:text-primary">Hồ sơ cá nhân</router-link>
            <router-link to="/dashboard" class="block py-3 text-gray-700 hover:text-primary">Bảng điều khiển</router-link>
            <router-link to="/settings" class="block py-3 text-gray-700 hover:text-primary">Cài đặt</router-link>
            <button @click="logout" class="block w-full text-left py-3 text-error">Đăng xuất</button>
          </template>
        </div>
      </div>
      
      <main class="flex-grow">
        <slot />
      </main>
      
      <footer class="bg-gray-50 pt-12 pb-6 mt-12">
        <div class="container">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div class="col-span-1 md:col-span-1">
              <img src="/logo.svg" alt="Logo" class="h-10 w-auto mb-4" />
              <h3 class="text-xl font-bold text-primary mb-2">MakeupConnect</h3>
              <p class="text-gray-600 mb-4">
                Nền tảng kết nối nghệ sĩ trang điểm và khách hàng hàng đầu Việt Nam
              </p>
              <div class="flex space-x-4">
                <a href="#" class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Facebook size="18" />
                </a>
                <a href="#" class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Instagram size="18" />
                </a>
                <a href="#" class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Twitter size="18" />
                </a>
                <a href="#" class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Youtube size="18" />
                </a>
              </div>
            </div>
            
            <div class="col-span-1">
              <h4 class="text-base font-semibold text-gray-900 mb-4">Công ty</h4>
              <ul class="space-y-3">
                <li><router-link to="/about" class="text-gray-600 hover:text-primary">Giới thiệu</router-link></li>
                <li><router-link to="/careers" class="text-gray-600 hover:text-primary">Tuyển dụng</router-link></li>
                <li><router-link to="/press" class="text-gray-600 hover:text-primary">Báo chí</router-link></li>
                <li><router-link to="/blog" class="text-gray-600 hover:text-primary">Blog</router-link></li>
              </ul>
            </div>
            
            <div class="col-span-1">
              <h4 class="text-base font-semibold text-gray-900 mb-4">Hỗ trợ</h4>
              <ul class="space-y-3">
                <li><router-link to="/help" class="text-gray-600 hover:text-primary">Trung tâm trợ giúp</router-link></li>
                <li><router-link to="/safety" class="text-gray-600 hover:text-primary">An toàn</router-link></li>
                <li><router-link to="/terms" class="text-gray-600 hover:text-primary">Điều khoản</router-link></li>
                <li><router-link to="/privacy" class="text-gray-600 hover:text-primary">Chính sách riêng tư</router-link></li>
              </ul>
            </div>
            
            <div class="col-span-1">
              <h4 class="text-base font-semibold text-gray-900 mb-4">Liên hệ</h4>
              <ul class="space-y-3">
                <li><a href="mailto:contact@makeupconnect.vn" class="text-gray-600 hover:text-primary">contact@makeupconnect.vn</a></li>
                <li><a href="tel:+84123456789" class="text-gray-600 hover:text-primary">+84 123 456 789</a></li>
                <li class="text-gray-600">123 Nguyễn Huệ, Quận 1, TP.HCM</li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-500 text-sm">
              &copy; {{ new Date().getFullYear() }} MakeupConnect. Tất cả quyền được bảo lưu.
            </p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <router-link to="/terms" class="text-gray-500 text-sm hover:text-primary">Điều khoản</router-link>
              <router-link to="/privacy" class="text-gray-500 text-sm hover:text-primary">Chính sách riêng tư</router-link>
              <router-link to="/cookies" class="text-gray-500 text-sm hover:text-primary">Cookies</router-link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { 
    Menu, X, ChevronDown, User, LayoutDashboard, 
    Settings, LogOut, Bell, Facebook, Instagram, 
    Twitter, Youtube 
  } from 'lucide-vue-next';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  // Mock user data - would come from auth store in real app
  const isLoggedIn = ref(true);
  const user = ref({
    name: 'Nguyễn Văn A',
    avatar: null
  });
  
  const showMobileMenu = ref(false);
  const showUserMenu = ref(false);
  const showNotifications = ref(false);
  
  const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value;
    if (showMobileMenu.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
    showNotifications.value = false;
  };
  
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    showUserMenu.value = false;
  };
  
  const logout = () => {
    // Handle logout logic
    isLoggedIn.value = false;
    showUserMenu.value = false;
  };
  </script>