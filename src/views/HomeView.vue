<template>
    <MainLayout>
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
                  <BaseButton 
                    variant="ghost" 
                    size="sm"
                    class="btn-hover-hide"
                    @click="handleMenuClick('/applications')"
                  >
                    Xem tất cả
                  </BaseButton>
                </div>
              </template>
              
              <div v-if="notifications.length === 0" class="py-4 text-center text-gray-500">
                Không có thông báo mới
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="viewNotification(notification)"
                >
                  <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      :src="notification.user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                      alt="User Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="text-sm text-gray-700">
                      <span class="font-medium">{{ notification.user.name }}</span> 
                      {{ notification.message }}
                    </p>
                    <span class="text-xs text-gray-500">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                  <div v-if="!notification.read" class="ml-2 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
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
                          <BaseButton 
                            variant="primary" 
                            class="bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black text-sm shadow-md"
                            @click="handleJobApplication(post.job)"
                          >
                            <Briefcase size="14" class="mr-2" />
                            Ứng tuyển ngay
                          </BaseButton>
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
              <button class="text-gray-400 hover:text-gray-500 hover:rotate-90 transition-transform duration-300 btn-hover-hide btn-close" @click="showPostModal = false">
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
  import { ref, computed, onMounted, reactive, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { 
    X, LoaderCircle, Image, Video, Briefcase, MapPin, Calendar, DollarSign,
    Heart, MessageSquare, Share2, MoreVertical, Send, Smile, Check,
    ChevronLeft, ChevronRight, TrendingUp, Newspaper, Home, Bell, Users,
    Settings, HelpCircle, Filter, Sparkles, Brush, Camera, Palette,
    Clock, Eye, Bookmark, PlusCircle, Trophy, Mail, Phone
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
  
  // Fetch posts with filter
  const fetchPostsWithFilter = async (filter = 'all') => {
    isLoading.value = true;
    try {
      let url = 'http://localhost:8082/posting/api/posts?page=0&size=10';
      
      // Add filter parameter if necessary
      if (filter !== 'all' && filter !== 'jobs') {
        url += `&makeupType=${encodeURIComponent(filter)}`;
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
              const userResponse = await axios.get(`http://localhost:8081/auth/users/${post.posterUserId}`);
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
  
  // Load more posts
  const loadMorePosts = async () => {
    if (currentPage.value < totalPages.value - 1) {
      isLoading.value = true;
      try {
        let url = `http://localhost:8082/posting/api/posts?page=${currentPage.value + 1}&size=10`;
        
        // Add filter parameter if necessary
        if (activeFilter.value !== 'all' && activeFilter.value !== 'jobs') {
          url += `&makeupType=${encodeURIComponent(activeFilter.value)}`;
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
                const userResponse = await axios.get(`http://localhost:8081/auth/users/${post.posterUserId}`);
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
      } catch (error) {
        console.error('Error loading more posts:', error);
      } finally {
        isLoading.value = false;
      }
    }
  };
  
  // Computed
  const filteredPosts = computed(() => {
    // API handles most filtering, but we still need to handle the 'jobs' filter case
    if (activeFilter.value === 'jobs') {
      return posts.value.filter(post => post.job);
    }
    return posts.value;
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
    if (!authStore.isAuthenticated) {
      const confirmed = confirm('Bạn cần đăng nhập để ứng tuyển. Đăng nhập ngay?');
      if (confirmed) {
        router.push('/login?redirect=/jobs/' + job.id);
      }
      return;
    }
    
    alert(`Bạn đang ứng tuyển vào vị trí: ${job.title}`);
    router.push(`/jobs/${job.id}/apply`);
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
  
  // Fetch data
  onMounted(async () => {
    isLoading.value = true;
    
    try {
      // Fetch posts from API
      await fetchPostsWithFilter(activeFilter.value);
      
      // Mock notifications
      notifications.value = [
        {
          id: 1,
          type: 'application',
          message: 'đã ứng tuyển vào công việc của bạn',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          user: {
            name: 'Ngọc Anh',
            avatar: null
          }
        },
        {
          id: 2,
          type: 'message',
          message: 'đã gửi cho bạn một tin nhắn mới',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          user: {
            name: 'Minh Tâm',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'
          }
        }
      ];
      
      // Mock trends
      trends.value = [
        {
          name: 'Trang điểm cô dâu',
          count: 128,
          trending: true
        },
        {
          name: 'Makeup tự nhiên',
          count: 96,
          trending: true
        },
        {
          name: 'Trang điểm Hàn Quốc',
          count: 84,
          trending: false
        },
        {
          name: 'Trang điểm sự kiện',
          count: 72,
          trending: false
        },
        {
          name: 'Trang điểm nghệ thuật',
          count: 56,
          trending: true
        }
      ];
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      isLoading.value = false;
    }
  });
  </script>

<style scoped>
:root {
  --color-primary-rgb: 79, 70, 229;
  --color-primary-dark-rgb: 67, 56, 202;
  --color-success-rgb: 75, 192, 192;
  --color-warning-rgb: 255, 159, 64;
  --color-error-rgb: 255, 71, 87;
  --color-info-rgb: 30, 144, 255;
}

.btn-hover-hide {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-hover-hide:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  filter: brightness(1.05);
}

.btn-hover-hide:active {
  transform: translateY(-1px);
}

.btn-hover-hide::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
}

.btn-hover-hide:hover::after {
  animation: btn-shine 0.8s;
}

/* Quick menu item hover effect */
.quick-menu-item {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.quick-menu-item:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-color: rgba(var(--color-primary-rgb), 0.1);
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quick-menu-item:hover .icon-container {
  transform: scale(1.1) rotate(5deg);
  color: rgb(var(--color-primary-rgb));
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

/* Custom button styles */
.btn-action-primary:hover {
  background: linear-gradient(to right, rgba(var(--color-primary-rgb), 0.1), rgba(var(--color-primary-rgb), 0.05));
  border-color: rgba(var(--color-primary-rgb), 0.2);
}

.btn-action-success:hover {
  background: linear-gradient(to right, rgba(var(--color-success-rgb), 0.1), rgba(var(--color-success-rgb), 0.05));
  border-color: rgba(var(--color-success-rgb), 0.2);
}

.btn-action-warning:hover {
  background: linear-gradient(to right, rgba(var(--color-warning-rgb), 0.1), rgba(var(--color-warning-rgb), 0.05));
  border-color: rgba(var(--color-warning-rgb), 0.2);
}

.btn-action-like:hover .text-gray-500:not(.fill-error) {
  color: rgb(var(--color-error-rgb));
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.btn-action-comment:hover .text-gray-500 {
  color: rgb(var(--color-info-rgb));
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.btn-action-share:hover .text-gray-500 {
  color: rgb(var(--color-success-rgb));
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.btn-send:hover {
  transform: scale(1.2) translateY(-50%);
  color: rgb(var(--color-info-rgb));
}

/* Close button animation */
.btn-close {
  transition: all 0.3s ease;
}

.btn-close:hover {
  transform: rotate(90deg);
  color: rgb(var(--color-error-rgb));
}

/* Primary button animation */
.btn-primary {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(var(--color-primary-rgb), 0.3);
}

.btn-primary:active {
  transform: translateY(-1px);
}

.btn-primary::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
}

.btn-primary:hover::after {
  animation: btn-shine 0.8s;
}

@keyframes btn-shine {
  100% {
    transform: translateX(100%);
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.active-filter {
  position: relative;
  overflow: hidden;
}

.active-filter::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  20%, 100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.filter-container {
  padding-bottom: 5px;
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.heart-filled {
  fill: #FF4757;
  color: #FF4757 !important;
  filter: drop-shadow(0 0 1px rgba(255, 71, 87, 0.3));
  transform: scale(1.1);
}

.heart-animation {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.heart-animation:hover {
  transform: scale(1.2);
}

/* Thêm các hiệu ứng mới */
.filter-container button:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-container button:active {
  transform: translateY(-2px);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Thêm các hiệu ứng mới */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Nền pattern bổ sung */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>
