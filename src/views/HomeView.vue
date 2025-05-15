<template>
    <MainLayout>
      <!-- Simple Test Modal - Remove in production -->
      <div v-if="showSimpleModal" class="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto">
        <div class="absolute inset-0 bg-black/60" @click="showSimpleModal = false"></div>
        <div class="relative bg-white rounded-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <span class="bg-gray-900 text-white p-1.5 rounded-md mr-2">📝</span>
              Ứng tuyển công việc
            </h2>
            <button
              class="text-gray-500 hover:text-gray-700 hover:rotate-90 transition-transform duration-300"
              @click="showSimpleModal = false"
            >
              <X size="20" />
            </button>
          </div>
          
          <form @submit.prevent="submitApplication">
            <div class="space-y-4">
              <!-- Post ID (Hidden) -->
              <input type="hidden" v-model="applicationForm.recruitmentPostId" />
              
              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Lời nhắn</label>
                <textarea
                  id="message"
                  v-model="applicationForm.message"
                  rows="3"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  required
                ></textarea>
              </div>
              
              <!-- Other Skills -->
              <div>
                <label for="otherSkills" class="block text-sm font-medium text-gray-700 mb-1">Kỹ năng khác</label>
                <textarea
                  id="otherSkills"
                  v-model="applicationForm.otherSkills"
                  rows="2"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                ></textarea>
              </div>
              
              <!-- Preferred Contact Method -->
              <div>
                <label for="preferredContactMethod" class="block text-sm font-medium text-gray-700 mb-1">Phương thức liên hệ</label>
                <input
                  id="preferredContactMethod"
                  v-model="applicationForm.preferredContactMethod"
                  type="text"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                />
              </div>
              
              <!-- Availability -->
              <div>
                <label for="availability" class="block text-sm font-medium text-gray-700 mb-1">Thời gian có thể làm việc</label>
                <input
                  id="availability"
                  v-model="applicationForm.availability"
                  type="text"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                />
              </div>
              
              <!-- Images -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                
                <!-- Image preview -->
                <div v-if="applicationForm.images.length > 0" class="grid grid-cols-3 gap-3 mb-4">
                  <div 
                    v-for="(image, index) in applicationForm.images" 
                    :key="index"
                    class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm group hover:shadow-md transition-all duration-300 hover:border-gray-300"
                  >
                    <img 
                      :src="image.preview" 
                      alt="Preview" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button 
                      type="button"
                      class="absolute bottom-2 right-2 p-1.5 bg-white text-gray-700 rounded-full shadow hover:shadow-md hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                      @click="removeImage(index)"
                    >
                      <X size="14" />
                    </button>
                  </div>
                </div>
                
                <!-- Image upload button -->
                <div 
                  @click="$refs.fileInput.click()"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-300 group hover:border-gray-500 hover:shadow-inner relative overflow-hidden"
                >
                  <div class="relative z-10">
                    <Upload size="24" class="mx-auto text-gray-400 mb-2 group-hover:text-gray-600 transition-colors duration-300 group-hover:scale-110 transform" />
                    <p class="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300 font-medium">Click để tải lên hình ảnh</p>
                    <p class="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors duration-300">Tối đa 5 hình, dung lượng < 2MB</p>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <input 
                    ref="fileInput"
                    type="file" 
                    multiple 
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload" 
                  />
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow"
                @click="showSimpleModal = false"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative group"
                :disabled="isSubmittingApplication"
              >
                <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-0"></span>
                <span class="relative z-10">
                  <span v-if="isSubmittingApplication" class="flex items-center">
                    <LoaderCircle size="16" class="animate-spin mr-2" />
                    Đang gửi...
                  </span>
                  <span v-else>Xác nhận</span>
                </span>
              </button>
            </div>
          
          </form>
        </div>
      </div>
      
      <div class="container py-8">
        
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cột Trái - Thông tin người dùng và menu -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Thông tin người dùng -->
            <BaseCard v-if="authStore.isAuthenticated" class="motion-scale-in-[0.95] motion-delay-[0.21s]/scale motion-duration-[0.53s]/scale motion-ease-spring-bouncier">
              <div class="flex items-center">
                <div class="h-16 w-16 rounded-full bg-gray-100 overflow-hidden mr-4 group relative">
                  <img 
                    :src="authStore.userAvatar"
                    alt="User Avatar" 
                    class="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ authStore.userFullName }}</h3>
                  <p class="text-sm text-primary">{{ authStore.userRole }}</p>
                  <BaseButton 
                    variant="ghost" 
                    size="sm"
                    class="mt-1 px-0 text-primary-dark hover:text-primary transition-colors"
                    @click="router.push('/profile')"
                  >
                    Xem hồ sơ
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
            
            <BaseCard v-else class="p-4 bg-gradient-to-r from-primary-blue to-primary text-white">
              <h3 class="text-lg font-semibold mb-2">Chào mừng đến với StyleBridge</h3>
              <p class="mb-4 text-white/90">Đăng nhập để kết nối với nghệ sĩ trang điểm và tìm kiếm cơ hội hợp tác.</p>
              <div class="flex space-x-2">
                <BaseButton 
                  variant="light"
                  @click="router.push('/login')"
                  class="w-full"
                >
                  Đăng nhập
                </BaseButton>
                <BaseButton 
                  variant="outline" 
                  @click="router.push('/register')"
                  class="w-full border-white text-white hover:bg-white/10"
                >
                  Đăng ký
                </BaseButton>
              </div>
            </BaseCard>
            
            <!-- Menu nhanh - Chỉ hiển thị khi đã đăng nhập -->
            <BaseCard v-if="authStore.isAuthenticated">
              <template #header>
             
              </template>
              
              <div class="space-y-0.5">
                <router-link 
                  v-for="item in quickMenuItems" 
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center py-2.5 px-3 rounded-lg bg-white border border-gray-100 text-gray-700 transition-all duration-300 group btn-hover-hide quick-menu-item"
                >
                  <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors icon-container">
                    <component :is="item.icon" size="16" />
                  </div>
                  <span class="text-gray-700 transition-colors">{{ item.label }}</span>
                  <span v-if="$route.path === item.path" class="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                </router-link>
              </div>
            </BaseCard>
            
            <!-- Thông báo ứng tuyển - Chỉ hiển thị khi đã đăng nhập -->
            <BaseCard v-if="authStore.isAuthenticated">
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-900">Thông báo ứng tuyển</h3>
                  <div class="flex items-center">
                    <button 
                      class="p-1 rounded-full hover:bg-gray-100 mr-2 text-gray-500 hover:text-gray-700"
                      @click="fetchApplications"
                      title="Làm mới"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button 
                      class="p-1 rounded-full hover:bg-gray-100 mr-2 text-gray-500 hover:text-gray-700"
                      @click="toggleDebugMode"
                      title="Debug"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </button>
                    <BaseButton 
                      variant="ghost" 
                      size="sm"
                      class="btn-hover-hide"
                      @click="handleMenuClick('/applications')"
                    >
                      Xem tất cả
                    </BaseButton>
                  </div>
                </div>
              </template>
              
              <!-- Debug information -->
              <div v-if="debugMode" class="mb-4 p-3 bg-gray-100 rounded-md text-xs overflow-auto max-h-60">
                <div class="flex justify-between items-center mb-2">
                  <p class="font-bold">Debug Mode</p>
                  <button 
                    @click="toggleDebugMode" 
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Token Information -->
                <div class="mb-4 p-2 bg-gray-200 rounded">
                  <div class="flex justify-between items-center">
                    <p class="font-bold">Current Token:</p>
                    <div>
                      <button 
                        @click="copyTokenToClipboard" 
                        class="px-2 py-0.5 bg-blue-500 text-white rounded text-xs mr-1"
                        title="Copy full token to clipboard"
                      >
                        Copy
                      </button>
                      <button 
                        @click="showTokenInput = !showTokenInput" 
                        class="px-2 py-0.5 bg-green-500 text-white rounded text-xs"
                      >
                        {{ showTokenInput ? 'Cancel' : 'Set Token' }}
                      </button>
                    </div>
                  </div>
                  <p class="mt-1 font-mono break-all bg-gray-100 p-1 rounded">{{ getCurrentTokenForDebug() }}</p>
                  
                  <!-- Token Input -->
                  <div v-if="showTokenInput" class="mt-2">
                    <textarea 
                      v-model="debugToken" 
                      rows="3" 
                      class="w-full text-xs p-1 border border-gray-300 rounded font-mono"
                      placeholder="Paste token here"
                    ></textarea>
                    <button 
                      @click="setCustomToken" 
                      class="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      Apply Token
                    </button>
                  </div>
                </div>
                
                <!-- API Response -->
                <p class="font-bold mb-2" v-if="rawApiResponse">API Response:</p>
                <pre v-if="rawApiResponse">{{ JSON.stringify(rawApiResponse, null, 2) }}</pre>
                
                <div class="mt-3 p-2 bg-gray-200 rounded" v-if="notifications">
                  <p class="font-bold mb-1">Current Notifications Array:</p>
                  <pre>{{ JSON.stringify(notifications, null, 2) }}</pre>
                </div>
                
                <div class="mt-3">
                  <button 
                    @click="notifications = []" 
                    class="px-2 py-1 bg-red-500 text-white rounded mr-2"
                  >
                    Clear Notifications
                  </button>
                  <button 
                    @click="fetchApplications" 
                    class="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Refetch
                  </button>
                </div>
              </div>
              
              <div v-if="isLoadingNotifications" class="py-6 text-center">
                <LoaderCircle class="animate-spin mx-auto h-6 w-6 text-gray-400 mb-2" />
                <p class="text-sm text-gray-500">Đang tải thông báo...</p>
              </div>
              
              <div v-else-if="notifications.length === 0" class="py-4 text-center text-gray-500">
                <p>Không có thông báo ứng tuyển</p>
                <p class="text-xs text-gray-400 mt-1">{{ debugMode ? 'Debug: ' + (rawApiResponse ? 'API có dữ liệu nhưng xử lý thất bại' : 'Không có dữ liệu từ API') : '' }}</p>
                <button 
                  @click="fetchApplications" 
                  class="mt-2 text-xs text-primary hover:underline flex items-center justify-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Làm mới
                </button>
              </div>
              
              <!-- Add notification count for debugging -->
              <div v-else class="space-y-4">
                <div v-if="debugMode" class="text-xs bg-blue-50 p-2 rounded text-blue-700">
                  Đang hiển thị {{ notifications.length }} thông báo
                </div>
                
                <div 
                  v-for="(notification, index) in notifications" 
                  :key="notification.id || index"
                  class="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="viewApplication(notification)"
                >
                  <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      :src="notification.user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                      alt="User Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="flex-grow">
                    <p class="text-sm text-gray-700">
                      <span class="font-medium">{{ notification.user.name }}</span> 
                      {{ notification.message }}
                    </p>
                    <span class="text-xs text-gray-500">{{ formatTime(notification.timestamp) }}</span>
                    <p v-if="notification.applicationData?.message" class="text-xs text-gray-600 mt-1 line-clamp-2 italic">
                      "{{ notification.applicationData.message }}"
                    </p>
                    
                    <!-- Show job details if available -->
                    <div v-if="notification.applicationData?.recruitmentPost" class="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                      <p class="font-medium text-gray-700">
                        {{ notification.applicationData.recruitmentPost.title }}
                      </p>
                      <div class="flex items-center mt-1 text-gray-500">
                        <span>{{ notification.applicationData.recruitmentPost.makeupType }}</span>
                        <span class="mx-1">•</span>
                        <span>{{ formatPrice(notification.applicationData.recruitmentPost.compensation) }}</span>
                      </div>
                    </div>
                    
                    <!-- Show image if available -->
                    <div v-if="notification.imageUrl" class="mt-2">
                      <img 
                        :src="notification.imageUrl" 
                        alt="Application image" 
                        class="h-16 w-16 object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  </div>
                  <div v-if="!notification.read" class="ml-2 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                </div>
                
                <div v-if="notifications.length > 0" class="text-center pt-2">
                  <button 
                    @click="fetchApplications" 
                    class="text-xs text-primary hover:underline flex items-center justify-center mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                  </button>
                </div>
              </div>
            </BaseCard>
            
            <!-- Xu hướng -->
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Xu hướng</h3>
              </template>
              
              <div class="space-y-3">
                <div 
                  v-for="(trend, index) in trends" 
                  :key="index"
                  class="flex items-center justify-between"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ trend.name }}</p>
                    <p class="text-xs text-gray-500">{{ trend.count }} bài đăng</p>
                  </div>
                  <TrendingUp v-if="trend.trending" size="16" class="text-success" />
                </div>
              </div>
            </BaseCard>
          </div>
          
          <!-- Cột Giữa - Đăng bài và Bảng tin -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Đầu trang - Banner chào mừng -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl overflow-hidden shadow-xl mb-8" v-if="!authStore.isAuthenticated">
              <div class="relative">
                <div class="absolute inset-0 bg-pattern opacity-10"></div>
                <div class="container mx-auto px-6 py-8 relative z-10">
                  <div class="flex flex-col md:flex-row items-center">
                    <div class="md:w-2/3 mb-8 md:mb-0 md:pr-16">
                      <h1 class="text-4xl font-bold mb-4 tracking-tight">
                        Chào mừng đến với <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-white">StyleBridge</span>
                      </h1>
                      <p class="text-xl text-gray-300 mb-6 leading-relaxed">
                        Nền tảng kết nối nghệ sĩ trang điểm chuyên nghiệp và khách hàng hàng đầu tại Việt Nam.
                      </p>
                      <div class="flex flex-wrap gap-4">
                        <BaseButton 
                          variant="primary" 
                          class="bg-white text-gray-900 hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
                          @click="router.push('/register')"
                        >
                          Đăng ký ngay
                        </BaseButton>
                        <BaseButton 
                          variant="outline" 
                          class="border-white text-white hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300"
                          @click="router.push('/login')"
                        >
                          Đăng nhập
                        </BaseButton>
                      </div>
                    </div>
                    <div class="md:w-1/3 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                        alt="Makeup Artist" 
                        class="rounded-lg shadow-2xl w-full object-cover transform hover:scale-105 transition-transform duration-700"
                        style="max-height: 240px"
                      />
                      <div class="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-lg">
                        <span class="text-3xl">✨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bộ lọc được cải tiến -->
            <div class="sticky top-20 z-30 bg-white/90 backdrop-blur-md py-3 px-4 rounded-xl shadow-md mb-6 border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-900 flex items-center">
                  <Filter size="18" class="mr-2 text-gray-500" />
                  Khám phá
                </h3>
                <div class="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
                  {{ filteredPosts.length }} bài viết
                </div>
              </div>
              
              <!-- Main filter categories -->
              <div class="filter-container flex overflow-x-auto py-2 space-x-3 scrollbar-hide relative">
                <button 
                  v-for="filter in filters" 
                  :key="filter.value"
                  class="group flex items-center px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  :class="[
                    activeFilter === filter.value 
                      ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow'
                  ]"
                  @click="activeFilter = filter.value"
                >
                  <div class="relative">
                    <component 
                      :is="filter.icon" 
                      :size="16" 
                      class="mr-2 transition-transform group-hover:scale-110"
                      :class="activeFilter === filter.value ? 'text-white' : 'text-gray-500'"
                    />
                    <span 
                      v-if="getFilterCount(filter.value) > 0 && filter.value !== 'all'" 
                      class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                    >
                      {{ getFilterCount(filter.value) }}
                    </span>
                  </div>
                  <span>{{ filter.label }}</span>
                </button>
                
                <!-- Gradient edge effect -->
                <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
              
              <!-- Advanced filter options -->
              <div class="mt-3 pt-3 border-t border-gray-100">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <h4 class="text-sm font-medium text-gray-700 flex items-center">
                      <SlidersHorizontal size="14" class="mr-1.5 text-gray-500" />
                      Bộ lọc nâng cao
                    </h4>
                    <div 
                      v-if="hasActiveFilters" 
                      class="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {{ activeFiltersCount }}
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <button 
                      @click="resetAndCloseFilters" 
                      class="text-xs text-primary hover:underline flex items-center"
                    >
                      <RotateCcw size="12" class="mr-1" />
                      Đặt lại bộ lọc
                    </button>
                    
                    <button 
                      @click="showAdvancedFilters = !showAdvancedFilters" 
                      class="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      :title="showAdvancedFilters ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'"
                    >
                      <ChevronDown 
                        v-if="showAdvancedFilters" 
                        size="16" 
                        class="text-gray-500 transition-transform duration-300"
                      />
                      <ChevronRight 
                        v-else 
                        size="16" 
                        class="text-gray-500 transition-transform duration-300"
                      />
                    </button>
                  </div>
                </div>
                
                <div v-show="showAdvancedFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-300 ease-in-out"
                  :class="{'opacity-100': showAdvancedFilters, 'opacity-0 max-h-0 overflow-hidden': !showAdvancedFilters}"
                >
                  <!-- Mức thù lao (Compensation) -->
                  <div class="rounded-lg border border-gray-200 p-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Mức thù lao</label>
                    <div class="flex items-center space-x-2">
                      <input 
                        type="number" 
                        v-model="advancedFilters.minPrice" 
                        placeholder="Từ" 
                        class="w-full text-sm rounded-md border-gray-200 py-1.5 focus:border-primary focus:ring-primary"
                      />
                      <span class="text-gray-400">-</span>
                      <input 
                        type="number" 
                        v-model="advancedFilters.maxPrice" 
                        placeholder="Đến" 
                        class="w-full text-sm rounded-md border-gray-200 py-1.5 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <!-- Thời gian bắt đầu (StartTime) -->
                  <div class="rounded-lg border border-gray-200 p-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Thời gian bắt đầu</label>
                    <input 
                      type="date" 
                      v-model="advancedFilters.startDate" 
                      class="w-full text-sm rounded-md border-gray-200 py-1.5 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <!-- Loại thuê (HiringType) -->
                  <div class="rounded-lg border border-gray-200 p-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Loại thuê</label>
                    <select 
                      v-model="advancedFilters.hiringType" 
                      class="w-full text-sm rounded-md border-gray-200 py-1.5 focus:border-primary focus:ring-primary"
                    >
                      <option value="">Tất cả</option>
                      <option value="Trọn gói">Trọn gói</option>
                      <option value="Theo giờ">Theo giờ</option>
                      <option value="Theo buổi">Theo buổi</option>
                    </select>
                  </div>
                  
                  <!-- Địa điểm (Address) -->
                  <div class="rounded-lg border border-gray-200 p-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">Địa điểm</label>
                    <select 
                      v-model="advancedFilters.location" 
                      class="w-full text-sm rounded-md border-gray-200 py-1.5 focus:border-primary focus:ring-primary"
                    >
                      <option value="">Tất cả</option>
                      <option v-for="location in uniqueLocations" :key="location" :value="location">
                        {{ location }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <div v-show="showAdvancedFilters" class="flex justify-end mt-3 transition-all duration-300"
                  :class="{'opacity-100 transform translate-y-0': showAdvancedFilters, 'opacity-0 transform -translate-y-4': !showAdvancedFilters}"
                >
                  <button 
                    @click="applyAdvancedFilters" 
                    class="flex items-center px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Search size="14" class="mr-1.5" />
                    Lọc kết quả
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Post Creation Card - Only visible when authenticated -->
            <div v-if="authStore.isAuthenticated" class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md mb-6">
              <div class="p-4">
                <div class="flex items-start">
                  <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      :src="authStore.userAvatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                      alt="User Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div 
                    class="flex-grow bg-gray-100 rounded-full px-4 py-2.5 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
                    @click="handlePostClick()"
                  >
                    Bạn đang nghĩ gì?
                  </div>
                </div>
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <button 
                    class="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                    @click="handlePostClick()"
                  >
                    <Image size="18" class="mr-2 text-gray-500" />
                    <span class="text-sm font-medium">Hình ảnh</span>
                  </button>
                  <button 
                    class="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                    @click="handlePostClick()"
                  >
                    <Video size="18" class="mr-2 text-gray-500" />
                    <span class="text-sm font-medium">Video</span>
                  </button>
                  <button 
                    class="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                    @click="handleJobsClick()"
                  >
                    <Briefcase size="18" class="mr-2 text-gray-500" />
                    <span class="text-sm font-medium">Công việc</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Thay đổi phần hiển thị bài đăng -->
            <div v-if="isLoading" class="flex justify-center py-12">
              <div class="flex flex-col items-center">
                <LoaderCircle class="animate-spin text-gray-600 h-10 w-10 mb-4" />
                <p class="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            </div>
            
            <div v-else-if="filteredPosts.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-md">
              <Newspaper class="text-gray-300 h-20 w-20 mb-6" />
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Không có bài đăng nào</h2>
              <p class="text-gray-600 max-w-md mb-8 px-4">
                Chưa có bài đăng nào trong danh mục này. Hãy là người đầu tiên chia sẻ!
              </p>
              <BaseButton 
                variant="primary" 
                class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
                @click="handlePostClick()"
              >
                <PlusCircle size="18" class="mr-2" />
                Đăng bài ngay
              </BaseButton>
            </div>
            
            <div v-else class="space-y-6">
              <div 
                v-for="post in filteredPosts" 
                :key="post.id"
                class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <!-- Header -->
                <div class="p-5 flex items-center justify-between border-b border-gray-100">
                  <div class="flex items-center">
                    <div 
                      class="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-black overflow-hidden mr-4 shadow-md cursor-pointer"
                      @click="navigateToUserProfile(post.author.id)"
                    >
                      <img 
                        :src="post.author.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                        alt="Author Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 
                        class="font-semibold text-gray-900 cursor-pointer hover:underline"
                        @click="navigateToUserProfile(post.author.id)"
                      >{{ post.author.name }}</h3>
                      <div class="flex items-center text-xs text-gray-500">
                        <Clock size="12" class="mr-1.5" />
                        <span>{{ formatTime(post.timestamp) }}</span>
                      </div>
                    
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div class="relative group">
                      <button class="text-gray-400 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors">
                        <Users size="18" />
                      </button>
                      <!-- Tooltip -->
                      <div class="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                        <div class="text-sm">
                          <p v-if="post.author.gender" class="mb-1">
                            <span class="font-medium text-gray-700">Giới tính:</span> 
                            <span class="text-gray-600">{{ post.author.gender }}</span>
                          </p>
                          <p v-if="post.author.address" class="mb-1">
                            <span class="font-medium text-gray-700">Địa chỉ:</span> 
                            <span class="text-gray-600">{{ post.author.address }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center">
                      {{ post.makeupType }}
                    </span>
                    <button class="text-gray-400 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors">
                      <MoreVertical size="18" />
                    </button>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="px-5 py-4">
                  <!-- Title -->
                  <h4 class="font-semibold text-lg text-gray-900 mb-2">{{ post.title }}</h4>
                  
                  <p class="text-gray-700 mb-4 leading-relaxed">{{ post.content }}</p>
                  
                  <!-- Tags -->
                  <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
                    <span 
                      v-for="tag in post.tags" 
                      :key="tag"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                  
                  <!-- Media -->
                  <div v-if="post.media && post.media.length > 0" class="mb-4">
                    <!-- Single image -->
                    <div 
                      v-if="post.media.length === 1" 
                      class="rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
                      @click="openGallery(post, 0)"
                    >
                      <img 
                        :src="post.media[0].url" 
                        :alt="`Post image`" 
                        class="w-full object-cover max-h-96 hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <!-- Multiple images -->
                    <div 
                      v-else
                      class="grid grid-cols-2 gap-3"
                    >
                      <div 
                        v-for="(media, index) in post.media.slice(0, 4)" 
                        :key="index"
                        class="aspect-square rounded-lg overflow-hidden cursor-pointer relative shadow-md hover:shadow-lg transition-all duration-300"
                        @click="openGallery(post, index)"
                      >
                        <img 
                          :src="media.url" 
                          :alt="`Post image ${index + 1}`" 
                          class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                        
                        <!-- Overlay for more images -->
                        <div 
                          v-if="index === 3 && post.media.length > 4"
                          class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm"
                        >
                          +{{ post.media.length - 4 }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Job Card Cải tiến -->
                  <div 
                    v-if="post.job"
                    class="border border-gray-200 rounded-lg p-5 mb-3 bg-gray-50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                    :data-post-id="post.id"
                  >
                    <div class="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-gray-700 to-gray-900"></div>
                    <div class="pl-3">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4 text-sm text-gray-700 mb-4">
                        <div class="flex items-center">
                          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <MapPin size="14" class="text-gray-700" />
                          </div>
                          <span>{{ post.job.location }}</span>
                        </div>
                        
                        <div class="flex items-center">
                          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <Calendar size="14" class="text-gray-700" />
                          </div>
                          <span>{{ formatDate(post.job.date) }}</span>
                        </div>
                        
                        <div class="flex items-center">
                          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <DollarSign size="14" class="text-gray-700" />
                          </div>
                          <span class="font-medium">{{ formatPrice(post.job.price) }}</span>
                        </div>
                      </div>
                      
                      
                      <!-- Thông tin thêm -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-4">
                        <div class="flex items-center">
                          <span class="text-gray-500 mr-2">Thời lượng:</span>
                          <span>{{ post.job.duration }}</span>
                        </div>
                        
                        <div class="flex items-center">
                          <span class="text-gray-500 mr-2">Số lượng:</span>
                          <span>{{ post.job.quantity }} người</span>
                        </div>
                        
                        <div class="flex items-center">
                          <span class="text-gray-500 mr-2">Loại hình:</span>
                          <span>{{ post.job.hiringType }}</span>
                        </div>
                        
                        <div class="flex items-center">
                          <span class="text-gray-500 mr-2">Hạn nộp:</span>
                          <span>{{ formatDate(post.job.deadline) }}</span>
                        </div>
                      </div>
                      
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500">ID: JOB-{{ post.job.id }}</span>
                        <div class="flex space-x-3">
                          <BaseButton 
                            variant="outline" 
                            class="border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                            @click="handleMenuClick(`/jobs/${post.job.id}`)"
                          >
                            <Eye size="14" class="mr-2" />
                            Xem chi tiết
                          </BaseButton>
                          <button 
                            id="apply-button"
                            class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-lg hover:from-gray-900 hover:to-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                            @click="handleSimpleApplyButtonClick(post)"
                          >
                            <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-0"></span>
                            <span class="flex items-center justify-center relative z-10">
                              <span class="font-medium group-hover:tracking-wide transition-all duration-300">Ứng tuyển ngay</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Footer - Thông tin thêm -->
                <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div class="flex items-center text-xs text-gray-500">
                    <Eye size="14" class="mr-1.5" />
                    <span>{{ Math.floor(Math.random() * 100) + 20 }} lượt xem</span>
                  </div>
                  
                  <button 
                    class="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center"
                    @click="handleBookmark(post)"
                  >
                    <Bookmark :class="post.bookmarked ? 'fill-gray-700' : ''" size="14" class="mr-1.5" />
                    {{ post.bookmarked ? 'Đã lưu' : 'Lưu bài đăng' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Load More Button -->
            <div v-if="filteredPosts.length > 0 && currentPage < totalPages - 1" class="flex justify-center mt-6">
              <BaseButton 
                variant="outline" 
                class="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-lg transform hover:-translate-y-1 transition-all duration-300"
                @click="loadMorePosts"
                :disabled="isLoading"
              >
                <template v-if="isLoading">
                  <LoaderCircle size="16" class="animate-spin mr-2" />
                  Đang tải...
                </template>
                <template v-else>
                  Xem thêm bài đăng
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
        
        <!-- Post Modal -->
        <div v-if="showPostModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPostModal = false"></div>
          <div class="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-lg transform motion-scale-in-[0.95] motion-duration-[0.53s]/scale motion-ease-spring-bouncy">
            <div class="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Tạo bài đăng</h2>
              <button class="text-gray-400 hover:text-gray-500 hover:rotate-90 transition-transform duration-300 btn-hover-hide" @click="showPostModal = false">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-4">
              <div class="flex items-start mb-4">
                <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    :src="authStore.userAvatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                    alt="User Avatar" 
                    class="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ authStore.userFullName }}</h3>
                  <select 
                    v-model="postVisibility"
                    class="mt-1 text-xs border-none p-0 pr-5 text-gray-500 focus:ring-0"
                  >
                    <option value="public">Công khai</option>
                    <option value="friends">Bạn bè</option>
                    <option value="private">Chỉ mình tôi</option>
                  </select>
                </div>
              </div>
              
              <textarea 
                v-model="newPostContent"
                rows="4"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 mb-4"
                placeholder="Bạn đang nghĩ gì?"
              ></textarea>
              
              <!-- Preview images -->
              <div v-if="newPostMedia.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                <div 
                  v-for="(media, index) in newPostMedia" 
                  :key="index"
                  class="relative aspect-square rounded-lg overflow-hidden"
                >
                  <img 
                    :src="media.preview" 
                    alt="Preview" 
                    class="w-full h-full object-cover"
                  />
                  <button 
                    class="absolute top-1 right-1 p-1 bg-black bg-opacity-50 rounded-full text-white btn-hover-hide"
                    @click="removeMedia(index)"
                  >
                    <X size="14" />
                  </button>
                </div>
              </div>
              
              <div class="flex items-center justify-between border-t border-gray-200 pt-3">
                <div class="flex items-center space-x-2">
                  <button 
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 btn-hover-hide"
                    @click="$refs.mediaInput.click()"
                  >
                    <Image size="20" />
                  </button>
                  <button 
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 btn-hover-hide"
                    @click="$refs.mediaInput.click()"
                  >
                    <Video size="20" />
                  </button>
                  <button 
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 btn-hover-hide"
                    @click="showEmojiPicker = !showEmojiPicker"
                  >
                    <Smile size="20" />
                  </button>
                  <input 
                    ref="mediaInput"
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    class="hidden"
                    @change="onMediaChange"
                  />
                </div>
                
                <BaseButton 
                  variant="primary" 
                  :disabled="!newPostContent.trim() && newPostMedia.length === 0"
                  :loading="isSubmittingPost"
                  class="btn-hover-hide btn-primary"
                  @click="submitPost"
                >
                  Đăng
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upgrade Modal -->
        <div v-if="showUpgradeModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="showUpgradeModal = false"></div>
          <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-2xl font-semibold text-gray-900">Nâng cấp tài khoản</h2>
              <button class="text-gray-400 hover:text-gray-500 btn-hover-hide btn-close" @click="showUpgradeModal = false">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  v-for="(plan, index) in subscriptionPlans" 
                  :key="index"
                  class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  :class="{'border-primary': plan.recommended}"
                >
                  <div 
                    class="p-4 text-center"
                    :class="plan.recommended ? 'bg-primary text-white' : 'bg-gray-50'"
                  >
                    <h3 class="text-lg font-semibold">{{ plan.name }}</h3>
                    <div v-if="plan.recommended" class="text-xs font-medium py-1 px-2 bg-white/20 rounded-full inline-block mt-1">
                      Được đề xuất
                    </div>
                  </div>
                  
                  <div class="p-4">
                    <div class="text-center mb-4">
                      <span class="text-3xl font-bold">{{ formatPrice(plan.price) }}</span>
                      <span class="text-gray-500">/tháng</span>
                    </div>
                    
                    <ul class="space-y-2 mb-6">
                      <li 
                        v-for="(feature, i) in plan.features" 
                        :key="i"
                        class="flex items-start"
                      >
                        <Check size="16" class="text-success mt-0.5 mr-2 flex-shrink-0" />
                        <span class="text-sm text-gray-700">{{ feature }}</span>
                      </li>
                    </ul>
                    
                    <BaseButton 
                      :variant="plan.recommended ? 'primary' : 'outline'"
                      block
                      class="btn-hover-hide"
                      :class="plan.recommended ? 'btn-primary' : ''"
                      @click="selectPlan(plan)"
                    >
                      {{ plan.recommended ? 'Đăng ký ngay' : 'Chọn gói' }}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Gallery Modal -->
        <div v-if="showGallery" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
          <div class="absolute inset-0" @click="closeGallery"></div>
          <div class="relative z-10 w-11/12 max-w-5xl">
            <button 
              class="absolute -top-12 right-0 text-white p-2 hover:rotate-180 transition-transform duration-300 btn-hover-hide btn-close" 
              @click="closeGallery">
              <X size="24" />
            </button>
            
            <div class="flex items-center justify-center h-[70vh]">
              <img 
                :src="galleryImages[currentImageIndex]?.url" 
                :alt="`Gallery image ${currentImageIndex + 1}`" 
                class="max-w-full max-h-full object-contain shadow-2xl" 
              />
            </div>
            
            <div class="flex items-center justify-center gap-8 mt-6 text-white">
              <button 
                class="p-3 rounded-full bg-primary/30 backdrop-blur-md hover:bg-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:-translate-x-1 btn-hover-hide"
                @click="prevImage"
                :disabled="currentImageIndex === 0"
              >
                <ChevronLeft size="24" />
              </button>
              
              <div class="text-lg bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full">
                {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
              </div>
              
              <button 
                class="p-3 rounded-full bg-primary/30 backdrop-blur-md hover:bg-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:translate-x-1 btn-hover-hide"
                @click="nextImage"
                :disabled="currentImageIndex === galleryImages.length - 1"
              >
                <ChevronRight size="24" />
              </button>
            </div>
            
            <div class="flex gap-3 mt-6 overflow-x-auto pb-3">
              <div 
                v-for="(image, index) in galleryImages" 
                :key="index"
                class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
                :class="index === currentImageIndex 
                  ? 'ring-2 ring-primary scale-105 shadow-lg' 
                  : 'opacity-60 hover:opacity-100 hover:scale-105'"
                @click="currentImageIndex = index"
              >
                <img :src="image.url" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
        
        
        
        <!-- User Profile Modal -->
        <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeUserProfile"></div>
          <div class="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md transform motion-scale-in-[0.95] motion-duration-[0.53s]/scale motion-ease-spring-bouncy">
            <div class="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Thông tin người dùng</h2>
              <button class="text-gray-400 hover:text-gray-500 hover:rotate-90 transition-transform duration-300 btn-hover-hide btn-close" @click="closeUserProfile">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6">
              <div class="flex flex-col items-center mb-6">
                <div class="h-24 w-24 rounded-full bg-gradient-to-br from-gray-700 to-black overflow-hidden mb-4 shadow-md">
                  <img 
                    :src="selectedUser.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                    alt="User Avatar" 
                    class="h-full w-full object-cover"
                  />
                </div>
                <h3 class="font-bold text-xl text-gray-900">{{ selectedUser.name }}</h3>
              </div>
              
              <div class="space-y-4">
                <div v-if="selectedUser.email" class="flex items-center">
                  <div class="w-10 flex-shrink-0 text-gray-500">
                    <Mail size="18" />
                  </div>
                  <div class="flex-grow">
                    <p class="text-sm text-gray-500">Email</p>
                    <a :href="`mailto:${selectedUser.email}`" class="font-medium text-gray-900 hover:underline">{{ selectedUser.email }}</a>
                  </div>
                </div>
                
                <div v-if="selectedUser.phone" class="flex items-center">
                  <div class="w-10 flex-shrink-0 text-gray-500">
                    <Phone size="18" />
                  </div>
                  <div class="flex-grow">
                    <p class="text-sm text-gray-500">Số điện thoại</p>
                    <a :href="`tel:${selectedUser.phone}`" class="font-medium text-gray-900 hover:underline">{{ selectedUser.phone }}</a>
                  </div>
                </div>
                
                <div v-if="selectedUser.gender" class="flex items-center">
                  <div class="w-10 flex-shrink-0 text-gray-500">
                    <Users size="18" />
                  </div>
                  <div class="flex-grow">
                    <p class="text-sm text-gray-500">Giới tính</p>
                    <p class="font-medium text-gray-900">{{ selectedUser.gender }}</p>
                  </div>
                </div>
                
                <div v-if="selectedUser.address" class="flex items-center">
                  <div class="w-10 flex-shrink-0 text-gray-500">
                    <MapPin size="18" />
                  </div>
                  <div class="flex-grow">
                    <p class="text-sm text-gray-500">Địa chỉ</p>
                    <p class="font-medium text-gray-900">{{ selectedUser.address }}</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-8 flex justify-end">
                <BaseButton 
                  variant="outline" 
                  class="border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-full transform hover:-translate-y-1 transition-all duration-300 shadow-md mr-3"
                  @click="showContactForm = true"
                >
                  Liên hệ
                </BaseButton>
                <BaseButton 
                  variant="primary" 
                  class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transform hover:-translate-y-1 transition-all duration-300 shadow-md"
                  @click="closeUserProfile"
                >
                  Đóng
                </BaseButton>
              </div>
              
              <!-- Contact Form -->
              <div v-if="showContactForm" class="mt-6 border-t border-gray-200 pt-6">
                <h4 class="font-semibold text-gray-900 mb-4">Gửi tin nhắn</h4>
                <div class="space-y-4">
                  <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <input
                      id="subject"
                      v-model="contactForm.subject"
                      type="text"
                      class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                      placeholder="Nhập tiêu đề"
                    />
                  </div>
                  <div>
                    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                    <textarea
                      id="message"
                      v-model="contactForm.message"
                      rows="4"
                      class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                      placeholder="Nhập nội dung tin nhắn..."
                    ></textarea>
                  </div>
                  <div class="flex justify-end space-x-3">
                    <BaseButton 
                      variant="outline" 
                      class="border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
                      @click="showContactForm = false"
                    >
                      Hủy
                    </BaseButton>
                    <BaseButton 
                      variant="primary" 
                      class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-md"
                      @click="sendContactMessage"
                      :disabled="isSending"
                    >
                      <template v-if="isSending">
                        <LoaderCircle size="16" class="animate-spin mr-2" />
                        Đang gửi...
                      </template>
                      <template v-else>
                        <Send size="16" class="mr-2" />
                        Gửi tin nhắn
                      </template>
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive, watch, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { 
    X, LoaderCircle, Image, Video, Briefcase, MapPin, Calendar, DollarSign,
    Heart, MessageSquare, Share2, MoreVertical, Send, Smile, Check,
    ChevronLeft, ChevronRight, TrendingUp, Newspaper, Home, Bell, Users,
    Settings, HelpCircle, Filter, Sparkles, Brush, Camera, Palette,
    Clock, Eye, Bookmark, PlusCircle, Trophy, Mail, Phone, Upload,
    SlidersHorizontal, RotateCcw, Search, ChevronDown
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import { useAuthStore } from '@/stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  // State
  const isLoading = ref(true);
  const posts = ref([]);
  const apiPosts = ref([]);
  const currentPage = ref(0);
  const totalPages = ref(0);
  const notifications = ref([]);
  const isLoadingNotifications = ref(false);
  const trends = ref([]);
  const activeFilter = ref('all');
  const isSubscriptionBannerClosed = ref(localStorage.getItem('subscriptionBannerClosed') === 'true');
  const showPostModal = ref(false);
  const showUpgradeModal = ref(false);
  const postVisibility = ref('public');
  const newPostContent = ref('');
  const newPostMedia = ref([]);
  const isSubmittingPost = ref(false);
  const showEmojiPicker = ref(false);
  const commentText = reactive({});
  const commentInputs = reactive({});
  const showGallery = ref(false);
  const galleryImages = ref([]);
  const currentImageIndex = ref(0);
  const selectedPost = ref(null);
  const showProfileModal = ref(false);
  const selectedUser = ref({});
  const showContactForm = ref(false);
  const contactForm = ref({
    subject: '',
    message: ''
  });
  const isSending = ref(false);
  const showApplicationModal = ref(false);
  const selectedJob = ref(null);
  const isSubmittingApplication = ref(false);
  const applicationForm = ref({
    recruitmentPostId: '',
    message: '',
    otherSkills: '',
    preferredContactMethod: '',
    availability: '',
    images: []
  });
  const showSimpleModal = ref(false);
  const showDirectTestModal = ref(false);
  const isModalOpen = ref(false);
  const advancedFilters = reactive({
    minPrice: '',
    maxPrice: '',
    startDate: '',
    hiringType: '',
    location: ''
  });
  const uniqueLocations = ref([]);
  const showAdvancedFilters = ref(true);
  const activeFiltersCount = ref(0);
  
  // Filters
  const filters = [
    { label: 'Tất cả', value: 'all', icon: Filter },
    { label: 'Công việc', value: 'jobs', icon: Briefcase },
    { label: 'Trang điểm cô dâu', value: 'Trang điểm cô dâu', icon: Sparkles },
    { label: 'Trang điểm sự kiện', value: 'Trang điểm sự kiện', icon: Camera },
    { label: 'Trang điểm nghệ thuật', value: 'Trang điểm nghệ thuật', icon: Palette }
  ];
  
  // Quick menu items
  const quickMenuItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Công việc', path: '/jobs', icon: Briefcase },
    { label: 'Thông báo', path: '/notifications', icon: Bell },
    { label: 'Lịch hẹn', path: '/appointments', icon: Calendar },
    { label: 'Tin nhắn', path: '/chat', icon: MessageSquare },
    { label: 'Cộng đồng', path: '/community', icon: Users },
    { label: 'Cài đặt', path: '/settings', icon: Settings },
    { label: 'Trợ giúp', path: '/help', icon: HelpCircle }
  ];
  
  // Subscription plans
  const subscriptionPlans = [
    {
      name: 'Cơ bản',
      price: 0,
      features: [
        'Đăng tối đa 3 công việc/tháng',
        'Hiển thị cơ bản trong tìm kiếm',
        'Hỗ trợ qua email'
      ]
    },
    {
      name: 'Chuyên nghiệp',
      price: 199000,
      recommended: true,
      features: [
        'Đăng không giới hạn công việc',
        'Ưu tiên hiển thị trong tìm kiếm',
        'Hỗ trợ 24/7',
        'Huy hiệu xác minh',
        'Thống kê chi tiết'
      ]
    },
    {
      name: 'Doanh nghiệp',
      price: 499000,
      features: [
        'Tất cả tính năng của gói Chuyên nghiệp',
        'Quản lý nhiều tài khoản',
        'API tích hợp',
        'Hỗ trợ riêng',
        'Tùy chỉnh thương hiệu'
      ]
    }
  ];
  
  // Add a debug variable to store raw response
  const rawApiResponse = ref(null);
  const debugMode = ref(false);
  const debugToken = ref('');
  const showTokenInput = ref(false);
  
  // Computed
  const hasActiveFilters = computed(() => {
    return !!(
      advancedFilters.minPrice || 
      advancedFilters.maxPrice || 
      advancedFilters.startDate || 
      advancedFilters.hiringType || 
      advancedFilters.location
    );
  });
  
  // Update activeFiltersCount whenever filters change
  watch(advancedFilters, () => {
    let count = 0;
    if (advancedFilters.minPrice || advancedFilters.maxPrice) count++;
    if (advancedFilters.startDate) count++;
    if (advancedFilters.hiringType) count++;
    if (advancedFilters.location) count++;
    activeFiltersCount.value = count;
  }, { deep: true, immediate: true });
  
  // Fetch posts with filter
  const fetchPostsWithFilter = async (filter = 'all') => {
    isLoading.value = true;
    try {
      // Sử dụng biến môi trường thay vì URL cứng
      const baseUrl = window.API_URL || 'http://localhost';
      const postingPath = window.POSTING_API_PATH || '/posting';
      let url = `${baseUrl}${postingPath}/api/posts?page=0&size=10`;
      
      // Add filter parameter if necessary
      if (filter !== 'all' && filter !== 'jobs') {
        url += `&makeupType=${encodeURIComponent(filter)}`;
      }
      
      // Add advanced filter parameters
      const params = new URLSearchParams();
      
      if (advancedFilters.minPrice) {
        params.append('minPrice', advancedFilters.minPrice);
      }
      
      if (advancedFilters.maxPrice) {
        params.append('maxPrice', advancedFilters.maxPrice);
      }
      
      if (advancedFilters.startDate) {
        params.append('startDate', advancedFilters.startDate);
      }
      
      if (advancedFilters.hiringType) {
        params.append('hiringType', advancedFilters.hiringType);
      }
      
      if (advancedFilters.location) {
        params.append('location', advancedFilters.location);
      }
      
      // Append params to URL if any are set
      const paramsString = params.toString();
      if (paramsString) {
        url += `&${paramsString}`;
      }
      
      const response = await axios.get(url);
      apiPosts.value = response.data.content || [];
      currentPage.value = response.data.number;
      totalPages.value = response.data.totalPages;
      
      // Fetch user info for each post
      const postsWithUserInfo = await Promise.all(
        apiPosts.value.map(async (post) => {
          let authorInfo = {
            name: "Người đăng",
            avatar: null,
            id: post.posterUserId
          };
          
          // Fetch user info if posterUserId is available
          if (post.posterUserId) {
            try {
              // Sử dụng biến môi trường cho auth service
              const baseUrl = window.API_URL || 'http://localhost';
              const authPath = window.IDENTITY_API_PATH || '/auth';
              const userResponse = await axios.get(`${baseUrl}${authPath}/users/${post.posterUserId}`);
              const userData = userResponse.data;
              
              authorInfo = {
                name: userData.fullName || userData.username,
                avatar: userData.avatarUrl,
                id: userData.id,
                email: userData.email,
                phone: userData.phone,
                gender: userData.gender,
                address: userData.address
              };
            } catch (error) {
              console.error(`Failed to fetch user info for ID ${post.posterUserId}:`, error);
            }
          }
          
          return {
            id: post.id,
            content: post.description,
            title: post.title,
            timestamp: post.postedAt,
            makeupType: post.makeupType,
            author: authorInfo,
            media: [],
            tags: [post.makeupType.toLowerCase().replace(/\s+/g, '')],
            job: {
              id: post.id,
              title: post.title,
              location: post.address,
              date: post.startTime,
              price: parseFloat(post.compensation.replace(/[^\d]/g, '') || 0),
              duration: post.expectedDuration,
              hiringType: post.hiringType,
              quantity: post.quantity,
              deadline: post.deadline
            },
            bookmarked: false
          };
        })
      );
      
      posts.value = postsWithUserInfo;
      
      // Extract unique locations for the filter dropdown
      const locations = new Set();
      postsWithUserInfo.forEach(post => {
        if (post.job && post.job.location) {
          // Extract district from address (assuming format like "12 Nguyễn Huệ, Quận 1, TP.HCM")
          const addressParts = post.job.location.split(',');
          if (addressParts.length > 1) {
            const district = addressParts[1].trim();
            locations.add(district);
          } else {
            locations.add(post.job.location);
          }
        }
      });
      uniqueLocations.value = Array.from(locations);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Watch for filter changes
  watch(activeFilter, (newFilter) => {
    fetchPostsWithFilter(newFilter);
  });
  
  // Debug modal visibility
  watch(showApplicationModal, (newValue) => {
    console.log('showApplicationModal changed to:', newValue);
  });
  
  // Load more posts
  const loadMorePosts = async () => {
    if (currentPage.value < totalPages.value - 1) {
      isLoading.value = true;
      try {
        // Sử dụng biến môi trường thay vì URL cứng
        const baseUrl = window.API_URL || 'http://localhost';
        const postingPath = window.POSTING_API_PATH || '/posting';
        let url = `${baseUrl}${postingPath}/api/posts?page=${currentPage.value + 1}&size=10`;
        
        // Add filter parameter if necessary
        if (activeFilter.value !== 'all' && activeFilter.value !== 'jobs') {
          url += `&makeupType=${encodeURIComponent(activeFilter.value)}`;
        }
        
        // Add advanced filter parameters
        const params = new URLSearchParams();
        
        if (advancedFilters.minPrice) {
          params.append('minPrice', advancedFilters.minPrice);
        }
        
        if (advancedFilters.maxPrice) {
          params.append('maxPrice', advancedFilters.maxPrice);
        }
        
        if (advancedFilters.startDate) {
          params.append('startDate', advancedFilters.startDate);
        }
        
        if (advancedFilters.hiringType) {
          params.append('hiringType', advancedFilters.hiringType);
        }
        
        if (advancedFilters.location) {
          params.append('location', advancedFilters.location);
        }
        
        // Append params to URL if any are set
        const paramsString = params.toString();
        if (paramsString) {
          url += `&${paramsString}`;
        }
        
        const response = await axios.get(url);
        const newApiPosts = response.data.content || [];
        apiPosts.value = [...apiPosts.value, ...newApiPosts];
        currentPage.value = response.data.number;
        totalPages.value = response.data.totalPages;
        
        // Fetch user info for each new post
        const newPostsWithUserInfo = await Promise.all(
          newApiPosts.map(async (post) => {
            let authorInfo = {
              name: "Người đăng",
              avatar: null,
              id: post.posterUserId
            };
            
            // Fetch user info if posterUserId is available
            if (post.posterUserId) {
              try {
                // Sử dụng biến môi trường cho auth service
                const baseUrl = window.API_URL || 'http://localhost';
                const authPath = window.IDENTITY_API_PATH || '/auth';
                const userResponse = await axios.get(`${baseUrl}${authPath}/users/${post.posterUserId}`);
                const userData = userResponse.data;
                
                authorInfo = {
                  name: userData.fullName || userData.username,
                  avatar: userData.avatarUrl,
                  id: userData.id,
                  email: userData.email,
                  phone: userData.phone,
                  gender: userData.gender,
                  address: userData.address
                };
              } catch (error) {
                console.error(`Failed to fetch user info for ID ${post.posterUserId}:`, error);
              }
            }
            
            return {
              id: post.id,
              content: post.description,
              title: post.title,
              timestamp: post.postedAt,
              makeupType: post.makeupType,
              author: authorInfo,
              media: [],
              tags: [post.makeupType.toLowerCase().replace(/\s+/g, '')],
              job: {
                id: post.id,
                title: post.title,
                location: post.address,
                date: post.startTime,
                price: parseFloat(post.compensation.replace(/[^\d]/g, '') || 0),
                duration: post.expectedDuration,
                hiringType: post.hiringType,
                quantity: post.quantity,
                deadline: post.deadline
              },
              bookmarked: false
            };
          })
        );
        
        posts.value = [...posts.value, ...newPostsWithUserInfo];
        
        // Add any new locations to the unique locations list
        const newLocations = new Set(uniqueLocations.value);
        newPostsWithUserInfo.forEach(post => {
          if (post.job && post.job.location) {
            const addressParts = post.job.location.split(',');
            if (addressParts.length > 1) {
              const district = addressParts[1].trim();
              newLocations.add(district);
            } else {
              newLocations.add(post.job.location);
            }
          }
        });
        uniqueLocations.value = Array.from(newLocations);
        
      } catch (error) {
        console.error('Error loading more posts:', error);
      } finally {
        isLoading.value = false;
      }
    }
  };
  
  // Computed
  const filteredPosts = computed(() => {
    // First apply the main category filter
    let result = posts.value;
    
    if (activeFilter.value === 'jobs') {
      result = result.filter(post => post.job);
    } else if (activeFilter.value !== 'all') {
      result = result.filter(post => post.makeupType === activeFilter.value);
    }
    
    // Then apply advanced filters if any are set
    if (advancedFilters.minPrice) {
      result = result.filter(post => {
        if (!post.job) return false;
        const price = parseFloat(post.job.price);
        return !isNaN(price) && price >= parseFloat(advancedFilters.minPrice);
      });
    }
    
    if (advancedFilters.maxPrice) {
      result = result.filter(post => {
        if (!post.job) return false;
        const price = parseFloat(post.job.price);
        return !isNaN(price) && price <= parseFloat(advancedFilters.maxPrice);
      });
    }
    
    if (advancedFilters.startDate) {
      const filterDate = new Date(advancedFilters.startDate);
      result = result.filter(post => {
        if (!post.job || !post.job.date) return false;
        const postDate = new Date(post.job.date);
        return postDate >= filterDate;
      });
    }
    
    if (advancedFilters.hiringType) {
      result = result.filter(post => {
        return post.job && post.job.hiringType === advancedFilters.hiringType;
      });
    }
    
    if (advancedFilters.location) {
      result = result.filter(post => {
        return post.job && post.job.location && post.job.location.includes(advancedFilters.location);
      });
    }
    
    return result;
  });
  
  // Methods
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) {
      return 'Vừa xong';
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} phút trước`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} giờ trước`;
    } else if (diff < 604800) {
      return `${Math.floor(diff / 86400)} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(price).replace('₫', '').trim();
  };
  
  const closeSubscriptionBanner = () => {
    isSubscriptionBannerClosed.value = true;
    localStorage.setItem('subscriptionBannerClosed', 'true');
  };
  
  const toggleLike = (post) => {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  };
  
  const handleBookmark = (post) => {
    if (!post.hasOwnProperty('bookmarked')) {
      post.bookmarked = false;
    }
    post.bookmarked = !post.bookmarked;
    
    // Hiển thị thông báo
    alert(post.bookmarked ? 'Đã lưu bài đăng' : 'Đã bỏ lưu bài đăng');
  };
  
  const handleJobApplication = (job) => {
    openApplicationModal(job);
  };
  
  const focusComment = (postId) => {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.showComments = true;
      
      setTimeout(() => {
        if (commentInputs[postId]) {
          commentInputs[postId].focus();
        }
      }, 0);
    }
  };
  
  const addComment = (post) => {
    const text = commentText[post.id];
    if (!text || !text.trim()) return;
    
    post.comments.push({
      id: Date.now(),
      content: text,
      timestamp: new Date(),
      author: {
        name: "Nguyễn Thị A",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s"
      }
    });
    
    commentText[post.id] = '';
  };
  
  const sharePost = (post) => {
    alert('Chức năng chia sẻ đang được phát triển');
  };
  
  const onMediaChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*') && !file.type.match('video.*')) continue;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        newPostMedia.value.push({
          file,
          preview: e.target.result,
          type: file.type.startsWith('image') ? 'image' : 'video'
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeMedia = (index) => {
    newPostMedia.value.splice(index, 1);
  };
  
  const submitPost = async () => {
    if (!newPostContent.value.trim() && newPostMedia.value.length === 0) return;
    
    isSubmittingPost.value = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const hashtagRegex = /#(\w+)/g;
      const hashtags = [];
      let match;
      while ((match = hashtagRegex.exec(newPostContent.value)) !== null) {
        hashtags.push(match[1]);
      }
      
      const media = newPostMedia.value.map((item, index) => ({
        url: item.preview,
        type: item.type
      }));
      
      const newPost = {
        id: Date.now(),
        content: newPostContent.value,
        timestamp: new Date(),
        author: {
          name: "Người dùng test",
          avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s"
        },
        media,
        tags: hashtags,
        likes: 0,
        liked: false,
        comments: [],
        showComments: false
      };
      
      posts.value.unshift(newPost);
      
      newPostContent.value = '';
      newPostMedia.value = [];
      showPostModal.value = false;
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại sau.');
    } finally {
      isSubmittingPost.value = false;
    }
  };
  
  const selectPlan = (plan) => {
    if (plan.price > 0) {
      alert(`Bạn đã chọn gói ${plan.name} với giá ${formatPrice(plan.price)}/tháng. Chức năng thanh toán đang được phát triển.`);
    } else {
      alert('Bạn đang sử dụng gói Cơ bản miễn phí.');
    }
    showUpgradeModal.value = false;
  };
  
  const viewNotification = (notification) => {
    notification.read = true;
    
    if (notification.type === 'application') {
      alert('Chuyển đến trang chi tiết đơn ứng tuyển');
    } else if (notification.type === 'message') {
      alert('Chuyển đến trang chat');
    }
  };
  
  const openGallery = (post, index) => {
    selectedPost.value = post;
    galleryImages.value = post.media;
    currentImageIndex.value = index;
    showGallery.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeGallery = () => {
    showGallery.value = false;
    document.body.style.overflow = '';
  };
  
  const nextImage = () => {
    if (currentImageIndex.value < galleryImages.value.length - 1) {
      currentImageIndex.value++;
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  };
  
  const getFilterCount = (filterValue) => {
    if (filterValue === 'all') return posts.value.length;
    if (filterValue === 'jobs') return posts.value.filter(post => post.job).length;
    return posts.value.filter(post => post.tags && post.tags.includes(filterValue)).length;
  };
  
  const handlePostClick = () => {
    showPostModal.value = true;
  };
  
  const handleJobsClick = () => {
    handleMenuClick('/jobs/create');
  };
  
  const handleMenuClick = (path) => {
    const publicRoutes = ['/', '/jobs', '/help'];
    const isProtectedRoute = !publicRoutes.some(route => path.startsWith(route));
    router.push(path);
  };
  
  // Show user profile
  const showUserProfile = (user) => {
    selectedUser.value = user;
    showProfileModal.value = true;
    showContactForm.value = false;
    contactForm.value = { subject: '', message: '' };
  };
  
  // Close user profile
  const closeUserProfile = () => {
    showProfileModal.value = false;
    showContactForm.value = false;
  };
  
  // Send contact message
  const sendContactMessage = async () => {
    if (!contactForm.value.subject || !contactForm.value.message) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    isSending.value = true;
    try {
      // Here you would implement the actual API call to send the message
      // For demonstration, we'll use a timeout to simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Tin nhắn đã được gửi thành công!');
      showContactForm.value = false;
      contactForm.value = { subject: '', message: '' };
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      isSending.value = false;
    }
  };
  
  // Navigate to user profile
  const navigateToUserProfile = (userId) => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };
  
  // Updated token handling for the application submission
  const submitApplication = async (event) => {
    if (!applicationForm.value.recruitmentPostId || !applicationForm.value.message) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    console.log('Bắt đầu xử lý ứng tuyển...');
    console.log('Thông tin ứng tuyển:', {
      recruitmentPostId: applicationForm.value.recruitmentPostId,
      message: applicationForm.value.message?.substring(0, 20) + '...'
    });
    
    isSubmittingApplication.value = true;
    
    try {
      // Check token from multiple sources, with axios defaults as a backup
      let authToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('Token từ localStorage/sessionStorage:', authToken ? 'Đã tìm thấy' : 'Không tìm thấy');
      
      // Try to get from authStore if no token found yet
      if (!authToken && authStore.token) {
        authToken = authStore.token;
        console.log('Token từ authStore:', 'Đã tìm thấy');
      }
      
      // Try axios defaults as a last resort
      if (!authToken && axios.defaults.headers.common['Authorization']) {
        const authHeader = axios.defaults.headers.common['Authorization'];
        if (authHeader.startsWith('Bearer ')) {
          authToken = authHeader.substring(7);
          console.log('Token từ axios defaults:', 'Đã tìm thấy');
        }
      }
      
      console.log('Token cuối cùng:', authToken ? `${authToken.substring(0, 15)}...` : 'Không tìm thấy');
      
      // Auto-set test token if none is found
      if (!authToken) {
        console.log('Không tìm thấy token, đang thử thiết lập token test...');
        try {
          const result = window.setTestToken();
          console.log('Kết quả thiết lập token test:', result);
          if (result && result.success) {
            authToken = localStorage.getItem('token');
            console.log('Đã tự động thiết lập token test:', authToken ? `${authToken.substring(0, 15)}...` : 'Thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi thiết lập token test:', error);
        }
        
        if (!authToken) {
          alert('Bạn cần đăng nhập để thực hiện chức năng này. Hoặc sử dụng lệnh window.setTestToken() trong Console để thiết lập token test.');
          isSubmittingApplication.value = false;
          return;
        }
      }
      
      // Log the data being sent for debugging
      console.log('Sending application data:', {
        recruitmentPostId: applicationForm.value.recruitmentPostId,
        message: applicationForm.value.message,
        otherSkills: applicationForm.value.otherSkills,
        preferredContactMethod: applicationForm.value.preferredContactMethod,
        availability: applicationForm.value.availability,
        imageCount: applicationForm.value.images.length
      });
      
      // Prepare form data for multipart/form-data request
      const formData = new FormData();
      formData.append('recruitmentPostId', applicationForm.value.recruitmentPostId);
      formData.append('message', applicationForm.value.message);
      
      if (applicationForm.value.otherSkills) {
        formData.append('otherSkills', applicationForm.value.otherSkills);
      }
      
      if (applicationForm.value.preferredContactMethod) {
        formData.append('preferredContactMethod', applicationForm.value.preferredContactMethod);
      }
      
      if (applicationForm.value.availability) {
        formData.append('availability', applicationForm.value.availability);
      }
      
      // Append images if any
      applicationForm.value.images.forEach((image) => {
        formData.append('images', image.file);
      });
      
      // Ensure token is set in global axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      // Make a direct fetch request to get better control and debugging
      const response = await fetch(`${window.API_URL}${window.POSTING_API_PATH}/applications/with-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
          // Don't set Content-Type in fetch with FormData, it will set the correct one with boundary
        },
        body: formData
      });
      
      // Check response
      if (!response.ok) {
        // Try to get more info about the error
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (e) {
          // Fallback if we can't parse the error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (errorData) {
          throw new Error(`Error: ${errorData.message || response.statusText}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      // Parse response
      const data = await response.json();
      console.log('Application submitted successfully:', data);
      
      // Reset form and close modal
      applicationForm.value = {
        recruitmentPostId: '',
        message: '',
        otherSkills: '',
        preferredContactMethod: '',
        availability: '',
        images: []
      };
      
      // Show success message
      alert('Đơn ứng tuyển của bạn đã được gửi thành công!');
      showSimpleModal.value = false;
      
    } catch (error) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi gửi đơn ứng tuyển. Vui lòng thử lại sau.';
      
      if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền thực hiện chức năng này.';
        errorMessage += '\n\nVui lòng thử thiết lập token bằng cách mở Console và gõ lệnh window.setTestToken()';
      }
      
      alert(errorMessage);
    } finally {
      isSubmittingApplication.value = false;
    }
  };
  
  // Fetch data
  onMounted(async () => {
    isLoading.value = true;
    
    try {
      // Log environment variables for debugging
      console.log('Environment variables check:');
      console.log('window.API_URL =', window.API_URL);
      console.log('window.POSTING_API_PATH =', window.POSTING_API_PATH);
      console.log('window.IDENTITY_API_PATH =', window.IDENTITY_API_PATH);
      
      // Initialize the modal system
      document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && showApplicationModal.value) {
          closeApplicationModal();
        }
      });
      
      // Call checkAndSetToken to process any token in URL params or storage
      const initialTokenCheck = checkAndSetToken();
      console.log('Token check on page load:', initialTokenCheck ? 'Token found and set' : 'No token found');
      
      // Define a global method for testing with token
      window.setTestToken = () => {
        try {
          const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhcnRpc3QxIiwiaWQiOiIyIiwicm9sZXMiOiJST0xFX0FSVElTVCIsImlhdCI6MTc0NzI0NDIxMCwiZXhwIjoxNzQ3MzMwNjEwfQ.LfazmOeGb4WB_47_Fg9WhO3zeZNzSOb1UcUQAlzMK1_bQf2K8I5ByncmAq8PYcZ8KOYCSe7X-iKW17lZoAubIQ";
          
          // Store in multiple places to increase chances of success
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
          
          // If using authentication store
          if (authStore.setToken) {
            authStore.setToken(token);
          }
          
          // Create global axios defaults
          if (window.axios) {
            window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          
          console.log('%cToken set successfully!', 'color: green; font-weight: bold; font-size: 14px');
          console.log('Token value:', token.substring(0, 20) + '...');
          console.log('Try submitting your application now.');
          
          return {
            success: true,
            message: 'Token set successfully in localStorage, sessionStorage, and global axios defaults'
          };
        } catch (error) {
          console.error('Error setting token:', error);
          return {
            success: false,
            error: error.message
          };
        }
      };
      
      // Also provide a direct token setter for login response
      window.setExampleLoginToken = () => {
        const sampleLoginResponse = {
          "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhcnRpc3QxIiwiaWQiOiIyIiwicm9sZXMiOiJST0xFX0FSVElTVCIsImlhdCI6MTc0NzI0NDIxMCwiZXhwIjoxNzQ3MzMwNjEwfQ.LfazmOeGb4WB_47_Fg9WhO3zeZNzSOb1UcUQAlzMK1_bQf2K8I5ByncmAq8PYcZ8KOYCSe7X-iKW17lZoAubIQ",
          "type": "Bearer",
          "id": 2,
          "username": "artist1",
          "email": "artist1@example.com",
          "roles": [
            "ROLE_ARTIST"
          ]
        };
        
        return window.setAuthTokenDirectly(sampleLoginResponse);
      };
      
      // Fetch posts from API - this will also extract locations
      await fetchPostsWithFilter(activeFilter.value);
      
      // If we didn't get any locations from posts, try the direct API
      if (uniqueLocations.value.length === 0) {
        await fetchUniqueLocations();
      }
      
      // Fetch applications for notifications
      await fetchApplications();
      
      // Check and set token from login response
      const tokenSet = checkAndSetToken();
      if (!tokenSet) {
        // If token is not set, try to set it from localStorage
        const localToken = localStorage.getItem('token');
        if (localToken) {
          console.log('Found existing token in localStorage');
          sessionStorage.setItem('token', localToken);
          if (authStore.setToken) {
            authStore.setToken(localToken);
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${localToken}`;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      isLoading.value = false;
    }
  });
  
  // Check and set token from login response
  const checkAndSetToken = () => {
    const token = getMostRecentToken();
    return !!token; // Return true if token exists
  };
  
  // Function to save token directly from login response
  window.setAuthTokenDirectly = (loginResponse) => {
    try {
      if (!loginResponse || !loginResponse.token) {
        console.error('Invalid login response - no token found');
        return { success: false, error: 'No token in response' };
      }

      const token = loginResponse.token;
      
      // Store in multiple places to ensure availability
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);
      
      // Set in auth store if available
      if (authStore.setToken) {
        authStore.setToken(token);
      }
      
      // Set in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('%cToken set successfully from login response!', 'color: green; font-weight: bold; font-size: 14px');
      console.log('Token value:', token.substring(0, 20) + '...');
      console.log('User info:', {
        id: loginResponse.id,
        username: loginResponse.username,
        email: loginResponse.email,
        roles: loginResponse.roles
      });
      
      // Refresh notifications with the new token
      if (typeof fetchApplications === 'function') {
        console.log('Automatically refreshing notifications with new token');
        fetchApplications();
      }
      
      return { 
        success: true,
        message: 'Token successfully stored from login response'
      };
    } catch (error) {
      console.error('Error setting token from login response:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Add a simple handler that directly sets the modal to visible
  const handleSimpleApplyButtonClick = (post) => {
    console.log('Simple apply button clicked for post:', post ? post.id : 'unknown');
    
    // Set the current job's ID to the application form
    if (post && post.job) {
      applicationForm.value.recruitmentPostId = post.job.id.toString();
      console.log('Setting recruitment post ID:', post.job.id);
    } else if (selectedJob && selectedJob.value) {
      applicationForm.value.recruitmentPostId = selectedJob.value.id.toString();
    } else {
      // If there's a job in the post we're currently viewing
      const currentPost = posts.value.find(post => 
        post.job && (post.id === selectedPost.value?.id || document.getElementById('apply-button')?.closest('[data-post-id]')?.getAttribute('data-post-id') === post.id.toString())
      );
      
      if (currentPost && currentPost.job) {
        applicationForm.value.recruitmentPostId = currentPost.job.id.toString();
      } else {
        console.warn('Could not determine recruitment post ID');
      }
    }
    
    // Reset other form fields
    applicationForm.value.message = '';
    applicationForm.value.otherSkills = '';
    applicationForm.value.preferredContactMethod = '';
    applicationForm.value.availability = '';
    applicationForm.value.images = [];
    
    // Show the modal
    showSimpleModal.value = true;
    console.log('Set showSimpleModal to true:', showSimpleModal.value);
  };
  
  // Get the most recent token from all available sources
  const getMostRecentToken = () => {
    console.log('[TOKEN] Getting most recent token...');
    
    // Check URL parameters first (highest priority - most recent login)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      const token = urlParams.get('token');
      if (token) {
        console.log('[TOKEN] Found token in URL parameters (most recent)');
        // Store in all locations for future use
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
        if (authStore.setToken) {
          authStore.setToken(token);
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
      }
    }
    
    // Check auth store next (likely from recent login)
    if (authStore.token) {
      console.log('[TOKEN] Using token from auth store');
      return authStore.token;
    }
    
    // Check session storage (temporary for current session)
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      console.log('[TOKEN] Using token from session storage');
      return sessionToken;
    }
    
    // Check local storage (persistent)
    const localToken = localStorage.getItem('token');
    if (localToken) {
      console.log('[TOKEN] Using token from local storage');
      return localToken;
    }
    
    // Check axios defaults (set by other parts of the app)
    const axiosAuth = axios.defaults.headers.common['Authorization'];
    if (axiosAuth && axiosAuth.startsWith('Bearer ')) {
      console.log('[TOKEN] Using token from axios defaults');
      return axiosAuth.substring(7); // Remove 'Bearer ' prefix
    }
    
    console.log('[TOKEN] No token found in any storage');
    return null;
  };
  
  // Get the specific token for applications API
  const getApplicationsApiToken = () => {
    // Use the specific token provided by the user
    const specificToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMSIsImlkIjoiMSIsInJvbGVzIjoiUk9MRV9BUlRJU1QiLCJpYXQiOjE3NDcyNTU5MDQsImV4cCI6MTc0NzM0MjMwNH0.aTRzZcUUgtuiRuLjgypF2Kq8Cho4emAsN1JBFnZ0_Ddijq38SaEzMdPUFgBQcACY4v4WLH4ZJvCn22zzBBA2sA";
    console.log('[APPLICATIONS API] Using specific token for applications API');
    return specificToken;
  };
  
  // Fetch applications that were sent to the logged in user
  const fetchApplications = async () => {
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, skipping application fetch');
      return;
    }
    
    isLoadingNotifications.value = true;
    rawApiResponse.value = null; // Reset debug data
    
    try {
      console.log('%c[FETCH APPLICATIONS] Starting fetch process', 'background: #333; color: #bada55; padding: 2px;');
      
      // Get the specific token for applications API
      let token = getApplicationsApiToken();
      
      console.log('[FETCH APPLICATIONS] Using specific token for applications API');
      
      if (!token) {
        console.error('[FETCH APPLICATIONS] No specific token available for applications API');
        isLoadingNotifications.value = false;
        return;
      }
      
      // Ensure token is properly formatted with Bearer prefix
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log('[FETCH APPLICATIONS] Making API request with specific token');
      
      // Sử dụng biến môi trường thay vì URL cứng
      const baseUrl = window.API_URL || 'http://localhost';
      const postingPath = window.POSTING_API_PATH || '/posting';
      const authPath = window.IDENTITY_API_PATH || '/auth';
      
      // Use both axios and fetch for comparison
      try {
        console.log('[FETCH APPLICATIONS] Attempting direct fetch call first');
        const fetchResponse = await fetch(`${baseUrl}${postingPath}/api/applications/authored`, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json();
          console.log('%c[FETCH APPLICATIONS] Direct fetch successful', 'color: green; font-weight: bold;');
          console.log('[FETCH APPLICATIONS] Raw fetch response:', fetchData);
          rawApiResponse.value = fetchData;
        } else {
          console.error('[FETCH APPLICATIONS] Direct fetch failed:', fetchResponse.status, fetchResponse.statusText);
          // Try to get more details about the error
          try {
            const errorData = await fetchResponse.text();
            console.error('[FETCH APPLICATIONS] Error response:', errorData);
          } catch (e) {}
        }
      } catch (fetchError) {
        console.error('[FETCH APPLICATIONS] Direct fetch error:', fetchError);
      }
      
      // Make the axios request
      console.log('[FETCH APPLICATIONS] Now trying with axios');
      const response = await axios.get(`${baseUrl}${postingPath}/api/applications/authored`, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      console.log('[FETCH APPLICATIONS] Axios response status:', response.status);
      console.log('[FETCH APPLICATIONS] Axios response data:', response.data);
      
      // Save raw response for debugging
      rawApiResponse.value = response.data;
      
      // Handle the specific response structure from the API
      let applicationsData = [];
      
      // Check if the response has the expected paginated structure
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        console.log('[FETCH APPLICATIONS] Found paginated response with content array, length:', response.data.content.length);
        applicationsData = response.data.content;
      } else if (Array.isArray(response.data)) {
        console.log('[FETCH APPLICATIONS] Response data is a direct array, length:', response.data.length);
        applicationsData = response.data;
      } else {
        console.error('[FETCH APPLICATIONS] Unexpected response structure:', response.data);
        notifications.value = [];
        isLoadingNotifications.value = false;
        return;
      }
      
      console.log('[FETCH APPLICATIONS] Processed applications data:', applicationsData);
      
      if (!applicationsData.length) {
        console.log('[FETCH APPLICATIONS] No applications found');
        notifications.value = [];
        isLoadingNotifications.value = false;
        return;
      }
      
      console.log('[FETCH APPLICATIONS] Processing', applicationsData.length, 'applications into notifications...');
      
      // Transform the application data to notification format
      const applicationNotifications = await Promise.all(applicationsData.map(async (app, index) => {
        console.log(`[FETCH APPLICATIONS] Processing application ${index + 1}/${applicationsData.length}:`, app.id);
        
        let userData = {
          name: "Ứng viên",
          avatar: null
        };
        
        // Fetch user info if applicantUserId is available
        if (app.applicantUserId) {
          try {
            console.log('[FETCH APPLICATIONS] Fetching user info for applicant ID:', app.applicantUserId);
            
            const userResponse = await axios.get(`${baseUrl}${authPath}/users/${app.applicantUserId}`, {
              headers: {
                'Authorization': authHeader
              }
            });
            
            console.log('[FETCH APPLICATIONS] User info response:', userResponse.data);
            
            userData = {
              name: userResponse.data.fullName || userResponse.data.username || 'Ứng viên',
              avatar: userResponse.data.avatarUrl,
              id: userResponse.data.id,
              email: userResponse.data.email,
              phone: userResponse.data.phone
            };
          } catch (error) {
            console.error(`[FETCH APPLICATIONS] Failed to fetch user info for ID ${app.applicantUserId}:`, error);
          }
        }
        
        // Get image URL if available
        let imageUrl = null;
        if (app.attachedImages && app.attachedImages.length > 0) {
          imageUrl = app.attachedImages[0].storagePath;
          console.log('[FETCH APPLICATIONS] Found image URL:', imageUrl);
        }
        
        // Get job title if available
        let jobTitle = '';
        if (app.recruitmentPost && app.recruitmentPost.title) {
          jobTitle = app.recruitmentPost.title;
          console.log('[FETCH APPLICATIONS] Found job title:', jobTitle);
        }
        
        // Add current timestamp if not available
        const now = new Date();
        // Use postedAt from recruitmentPost if available
        const timestamp = app.appliedAt || 
                         (app.recruitmentPost && app.recruitmentPost.postedAt ? app.recruitmentPost.postedAt : now.toISOString());
        
        const notificationItem = {
          id: app.id || Math.random().toString(36).substring(2, 11),
          type: 'application',
          message: `đã ứng tuyển vào công việc "${jobTitle || 'của bạn'}"`,
          timestamp: timestamp,
          read: false,
          user: userData,
          applicationData: app,
          imageUrl: imageUrl
        };
        
        console.log('[FETCH APPLICATIONS] Created notification item:', notificationItem);
        return notificationItem;
      }));
      
      console.log('%c[FETCH APPLICATIONS] Final processed notifications:', 'color: blue; font-weight: bold;', applicationNotifications);
      
      if (applicationNotifications.length > 0) {
        // Force reactive update by creating a new array
        notifications.value = [...applicationNotifications];
        console.log('[FETCH APPLICATIONS] Notifications state updated with', applicationNotifications.length, 'items');
        console.log('[FETCH APPLICATIONS] Current notifications.value:', notifications.value);
      } else {
        console.log('[FETCH APPLICATIONS] No notifications to display after processing');
        notifications.value = [];
      }
      
      // Force a UI update by setting a timeout
      setTimeout(() => {
        console.log('[FETCH APPLICATIONS] Checking notifications after timeout:', notifications.value.length);
      }, 500);
      
    } catch (error) {
      console.error('[FETCH APPLICATIONS] Error fetching applications:', error);
      console.error('[FETCH APPLICATIONS] Error details:', error.response ? error.response.data : 'No response data');
      notifications.value = [];
    } finally {
      isLoadingNotifications.value = false;
      console.log('[FETCH APPLICATIONS] Finished fetching applications, loading state set to false');
    }
  };
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    debugMode.value = !debugMode.value;
    console.log('[DEBUG] Debug mode:', debugMode.value ? 'ON' : 'OFF');
  };
  
  // View application details
  const viewApplication = (notification) => {
    notification.read = true;
    
    // Navigate to application details
    if (notification.applicationData && notification.applicationData.id) {
      router.push(`/applications/${notification.applicationData.id}`);
    }
  };
  
  // Get the current token for debugging
  const getCurrentTokenForDebug = () => {
    const token = getMostRecentToken();
    if (token) {
      // Only show first and last few characters for security
      const firstChars = token.substring(0, 10);
      const lastChars = token.substring(token.length - 10);
      const middleLength = token.length - 20;
      return `${firstChars}${'*'.repeat(middleLength > 0 ? middleLength : 0)}${lastChars} (Length: ${token.length})`;
    }
    return 'No token found';
  };
  
  // Set a custom token for testing
  const setCustomToken = () => {
    if (!debugToken.value.trim()) {
      alert('Please enter a token');
      return;
    }
    
    const token = debugToken.value.trim();
    console.log('[DEBUG] Setting custom token:', token.substring(0, 10) + '...');
    
    // Store in all locations
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
    if (authStore.setToken) {
      authStore.setToken(token);
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    alert('Token set successfully! Refreshing notifications...');
    fetchApplications();
    showTokenInput.value = false;
  };
  
  // Copy token to clipboard
  const copyTokenToClipboard = async () => {
    const token = getMostRecentToken();
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        alert('Token copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy token:', err);
        alert('Failed to copy token. See console for details.');
      }
    } else {
      alert('No token available to copy');
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    advancedFilters.minPrice = '';
    advancedFilters.maxPrice = '';
    advancedFilters.startDate = '';
    advancedFilters.hiringType = '';
    advancedFilters.location = '';
  };
  
  // Apply advanced filters
  const applyAdvancedFilters = () => {
    // Reset to first page and fetch with current filters
    currentPage.value = 0;
    fetchPostsWithFilter(activeFilter.value);
  };
  
  // Fetch unique locations
  const fetchUniqueLocations = async () => {
    try {
      // Sử dụng biến môi trường thay vì URL cứng
      const baseUrl = window.API_URL || 'http://localhost';
      const postingPath = window.POSTING_API_PATH || '/posting';
      
      // This is a fallback in case we don't have any posts yet
      // In most cases, locations will be extracted from posts
      const response = await axios.get(`${baseUrl}${postingPath}/api/locations`);
      if (response.data && Array.isArray(response.data)) {
        const apiLocations = response.data.map(location => 
          typeof location === 'string' ? location : location.name || location.district || ''
        ).filter(Boolean);
        
        // Merge with any existing locations
        const allLocations = new Set([...uniqueLocations.value, ...apiLocations]);
        uniqueLocations.value = Array.from(allLocations);
      }
    } catch (error) {
      console.error('Error fetching unique locations:', error);
    }
  };
  
  // Reset filters and toggle advanced section
  const resetAndCloseFilters = () => {
    advancedFilters.minPrice = '';
    advancedFilters.maxPrice = '';
    advancedFilters.startDate = '';
    advancedFilters.hiringType = '';
    advancedFilters.location = '';
    
    // Apply the reset filters immediately
    applyAdvancedFilters();
    
    // Close the advanced filters section after a short delay
    setTimeout(() => {
      showAdvancedFilters.value = false;
    }, 300);
  };
  </script>
  