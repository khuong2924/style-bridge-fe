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
                  <p class="text-sm text-primary">{{ authStore.user?.role === 'artist' ? 'Nghệ sĩ trang điểm' : 'Khách hàng' }}</p>
                  <BaseButton 
                    variant="ghost" 
                    size="sm"
                    class="mt-1 px-0 text-primary-dark hover:text-primary transition-colors"
                    @click="$router.push('/profile')"
                  >
                    Xem hồ sơ
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
            
            <!-- Menu nhanh -->
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Menu nhanh</h3>
              </template>
              
              <div class="space-y-0.5">
                <router-link 
                  v-for="item in quickMenuItems" 
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors group"
                >
                  <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <component :is="item.icon" size="16" />
                  </div>
                  <span class="text-gray-700 group-hover:text-primary-dark transition-colors">{{ item.label }}</span>
                </router-link>
              </div>
            </BaseCard>
            
            <!-- Thông báo ứng tuyển -->
            <BaseCard v-if="authStore.isAuthenticated">
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-900">Thông báo ứng tuyển</h3>
                  <BaseButton 
                    variant="ghost" 
                    size="sm"
                    @click="$router.push('/applications')"
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
                      :src="notification.user.avatar || '/placeholder-avatar.jpg'" 
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
            <!-- Đăng bài -->
            <BaseCard v-if="authStore.isAuthenticated">
              <div class="flex items-start">
                <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    :src="authStore.userAvatar" 
                    alt="User Avatar" 
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex-grow">
                  <div 
                    class="w-full px-4 py-3 rounded-full border border-gray-300 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                    @click="showPostModal = true"
                  >
                    Bạn đang nghĩ gì?
                  </div>
                  
                  <div class="flex mt-3 space-x-2">
                    <button 
                      class="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      @click="showPostModal = true"
                    >
                      <Image size="18" class="mr-2 text-primary" />
                      <span class="text-sm text-gray-700">Hình ảnh</span>
                    </button>
                    <button 
                      class="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      @click="showPostModal = true"
                    >
                      <Video size="18" class="mr-2 text-success" />
                      <span class="text-sm text-gray-700">Video</span>
                    </button>
                    <button 
                      class="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      @click="$router.push('/jobs/create')"
                    >
                      <Briefcase size="18" class="mr-2 text-warning" />
                      <span class="text-sm text-gray-700">Đăng việc</span>
                    </button>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Bộ lọc -->
            <div class="flex overflow-x-auto pb-3 space-x-2">
              <button 
                v-for="filter in filters" 
                :key="filter.value"
                class="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300"
                :class="activeFilter === filter.value 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary/30'"
                @click="activeFilter = filter.value"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <!-- Bảng tin -->
            <div v-if="isLoading" class="flex justify-center py-8">
              <LoaderCircle class="animate-spin text-primary h-8 w-8" />
            </div>
            
            <div v-else-if="filteredPosts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <Newspaper class="text-gray-300 h-16 w-16 mb-4" />
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Không có bài đăng nào</h2>
              <p class="text-gray-600 max-w-md mb-6">
                Chưa có bài đăng nào trong danh mục này. Hãy là người đầu tiên chia sẻ!
              </p>
              <BaseButton 
                variant="primary" 
                @click="showPostModal = true"
              >
                Đăng bài ngay
              </BaseButton>
            </div>
            
            <div v-else class="space-y-6">
              <div 
                v-for="post in filteredPosts" 
                :key="post.id"
                class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <!-- Header -->
                <div class="p-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-primary-lighter to-primary overflow-hidden mr-3 shadow-md">
                      <img 
                        :src="post.author.avatar || '/placeholder-avatar.jpg'" 
                        alt="Author Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ post.author.name }}</h3>
                      <p class="text-xs text-primary">{{ formatTime(post.timestamp) }}</p>
                    </div>
                  </div>
                  
                  <button class="text-gray-400 hover:text-primary rounded-full p-2 hover:bg-gray-50 transition-colors">
                    <MoreVertical size="18" />
                  </button>
                </div>
                
                <!-- Content -->
                <div class="px-5 pb-4">
                  <p class="text-gray-700 mb-4 leading-relaxed">{{ post.content }}</p>
                  
                  <!-- Tags -->
                  <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <span 
                      v-for="tag in post.tags" 
                      :key="tag"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                  
                  <!-- Media -->
                  <div v-if="post.media && post.media.length > 0" class="mb-3">
                    <!-- Single image -->
                    <div 
                      v-if="post.media.length === 1" 
                      class="rounded-lg overflow-hidden cursor-pointer"
                      @click="openGallery(post, 0)"
                    >
                      <img 
                        :src="post.media[0].url" 
                        :alt="`Post image`" 
                        class="w-full object-cover max-h-96"
                      />
                    </div>
                    
                    <!-- Multiple images -->
                    <div 
                      v-else
                      class="grid grid-cols-2 gap-2"
                    >
                      <div 
                        v-for="(media, index) in post.media.slice(0, 4)" 
                        :key="index"
                        class="aspect-square rounded-lg overflow-hidden cursor-pointer relative"
                        @click="openGallery(post, index)"
                      >
                        <img 
                          :src="media.url" 
                          :alt="`Post image ${index + 1}`" 
                          class="w-full h-full object-cover"
                        />
                        
                        <!-- Overlay for more images -->
                        <div 
                          v-if="index === 3 && post.media.length > 4"
                          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl"
                        >
                          +{{ post.media.length - 4 }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Job Card -->
                  <div 
                    v-if="post.job"
                    class="border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="$router.push(`/jobs/${post.job.id}`)"
                  >
                    <h4 class="font-medium text-gray-900 mb-2">{{ post.job.title }}</h4>
                    <div class="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <MapPin size="14" class="mr-1.5 text-gray-400" />
                        <span>{{ post.job.location }}</span>
                      </div>
                      
                      <div class="flex items-center">
                        <Calendar size="14" class="mr-1.5 text-gray-400" />
                        <span>{{ formatDate(post.job.date) }}</span>
                      </div>
                      
                      <div class="flex items-center text-primary font-medium">
                        <DollarSign size="14" class="mr-1.5" />
                        <span>{{ formatPrice(post.job.price) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Stats -->
                <div class="px-4 py-2 border-t border-gray-100 text-sm text-gray-500">
                  <div class="flex justify-between">
                    <div class="flex items-center">
                      <div class="flex items-center">
                        <Heart 
                          size="16" 
                          :class="post.liked ? 'text-error fill-error' : 'text-gray-400'"
                          class="mr-1 cursor-pointer"
                          @click="toggleLike(post)"
                        />
                        <span>{{ post.likes }}</span>
                      </div>
                      <div class="flex items-center ml-4">
                        <MessageSquare size="16" class="text-gray-400 mr-1" />
                        <span>{{ post.comments.length }}</span>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <Share2 size="16" class="text-gray-400 cursor-pointer" @click="sharePost(post)" />
                    </div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="px-4 py-2 border-t border-gray-100">
                  <div class="flex justify-between">
                    <button 
                      class="flex items-center justify-center flex-1 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      @click="toggleLike(post)"
                    >
                      <Heart 
                        size="18" 
                        :class="post.liked ? 'text-error fill-error' : 'text-gray-500'"
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-700">Thích</span>
                    </button>
                    
                    <button 
                      class="flex items-center justify-center flex-1 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      @click="focusComment(post.id)"
                    >
                      <MessageSquare size="18" class="text-gray-500 mr-2" />
                      <span class="text-sm text-gray-700">Bình luận</span>
                    </button>
                    
                    <button 
                      class="flex items-center justify-center flex-1 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      @click="sharePost(post)"
                    >
                      <Share2 size="18" class="text-gray-500 mr-2" />
                      <span class="text-sm text-gray-700">Chia sẻ</span>
                    </button>
                  </div>
                </div>
                
                <!-- Comments -->
                <div v-if="post.showComments" class="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <!-- Comment list -->
                  <div v-if="post.comments.length > 0" class="space-y-3 mb-3">
                    <div 
                      v-for="comment in post.comments" 
                      :key="comment.id"
                      class="flex items-start"
                    >
                      <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-2 flex-shrink-0">
                        <img 
                          :src="comment.author.avatar || '/placeholder-avatar.jpg'" 
                          alt="Comment Author Avatar" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="bg-white rounded-lg px-3 py-2 shadow-sm">
                        <div class="flex items-center mb-1">
                          <h4 class="text-xs font-medium text-gray-900">{{ comment.author.name }}</h4>
                          <span class="text-xs text-gray-500 ml-2">{{ formatTime(comment.timestamp) }}</span>
                        </div>
                        <p class="text-sm text-gray-700">{{ comment.content }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Comment input -->
                  <div class="flex items-start">
                    <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-2 flex-shrink-0">
                      <img 
                        :src="authStore.userAvatar" 
                        alt="User Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="flex-grow relative">
                      <input 
                        :ref="el => { if (el) commentInputs[post.id] = el }"
                        v-model="commentText[post.id]"
                        type="text" 
                        placeholder="Viết bình luận..." 
                        class="w-full px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                        @keyup.enter="addComment(post)"
                      />
                      <button 
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                        @click="addComment(post)"
                      >
                        <Send size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Post Modal -->
        <div v-if="showPostModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPostModal = false"></div>
          <div class="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-lg transform motion-scale-in-[0.95] motion-duration-[0.53s]/scale motion-ease-spring-bouncy">
            <div class="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Tạo bài đăng</h2>
              <button class="text-gray-400 hover:text-gray-500 hover:rotate-90 transition-transform duration-300" @click="showPostModal = false">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-4">
              <div class="flex items-start mb-4">
                <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    :src="authStore.userAvatar" 
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
                    class="absolute top-1 right-1 p-1 bg-black bg-opacity-50 rounded-full text-white"
                    @click="removeMedia(index)"
                  >
                    <X size="14" />
                  </button>
                </div>
              </div>
              
              <div class="flex items-center justify-between border-t border-gray-200 pt-3">
                <div class="flex items-center space-x-2">
                  <button 
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    @click="$refs.mediaInput.click()"
                  >
                    <Image size="20" />
                  </button>
                  <button 
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    @click="$refs.mediaInput.click()"
                  >
                    <Video size="20" />
                  </button>
                  <button 
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
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
              <button class="text-gray-400 hover:text-gray-500" @click="showUpgradeModal = false">
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
              class="absolute -top-12 right-0 text-white p-2 hover:rotate-180 transition-transform duration-300" 
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
                class="p-3 rounded-full bg-primary/30 backdrop-blur-md hover:bg-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:-translate-x-1"
                @click="prevImage"
                :disabled="currentImageIndex === 0"
              >
                <ChevronLeft size="24" />
              </button>
              
              <div class="text-lg bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full">
                {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
              </div>
              
              <button 
                class="p-3 rounded-full bg-primary/30 backdrop-blur-md hover:bg-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:translate-x-1"
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
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { 
    X, LoaderCircle, Image, Video, Briefcase, MapPin, Calendar, DollarSign,
    Heart, MessageSquare, Share2, MoreVertical, Send, Smile, Check,
    ChevronLeft, ChevronRight, TrendingUp, Newspaper, Home, Bell, Users,
    Settings, HelpCircle
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import { useAuthStore } from '@/stores/auth';
  
  // Auth store
  const authStore = useAuthStore();
  
  // State
  const isLoading = ref(true);
  const posts = ref([]);
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
  
  // Filters
  const filters = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Công việc', value: 'jobs' },
    { label: 'Xu hướng', value: 'trending' },
    { label: 'Trang điểm cô dâu', value: 'bridal' },
    { label: 'Trang điểm sự kiện', value: 'event' },
    { label: 'Trang điểm nghệ thuật', value: 'artistic' }
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
  
  // Computed
  const filteredPosts = computed(() => {
    if (activeFilter.value === 'all') {
      return posts.value;
    } else if (activeFilter.value === 'jobs') {
      return posts.value.filter(post => post.job);
    } else if (activeFilter.value === 'trending') {
      return posts.value.filter(post => post.trending);
    } else {
      return posts.value.filter(post => 
        post.tags && post.tags.includes(activeFilter.value)
      );
    }
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
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const closeSubscriptionBanner = () => {
    isSubscriptionBannerClosed.value = true;
    localStorage.setItem('subscriptionBannerClosed', 'true');
  };
  
  const toggleLike = (post) => {
    if (!authStore.isAuthenticated) {
      alert('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  };
  
  const focusComment = (postId) => {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.showComments = true;
      
      // Focus on comment input after DOM update
      setTimeout(() => {
        if (commentInputs[postId]) {
          commentInputs[postId].focus();
        }
      }, 0);
    }
  };
  
  const addComment = (post) => {
    if (!authStore.isAuthenticated) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }
    
    const text = commentText[post.id];
    if (!text || !text.trim()) return;
    
    post.comments.push({
      id: Date.now(),
      content: text,
      timestamp: new Date(),
      author: {
        name: authStore.userFullName,
        avatar: authStore.userAvatar
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
    if (!authStore.isAuthenticated) {
      alert('Vui lòng đăng nhập để đăng bài');
      return;
    }
    
    if (!newPostContent.value.trim() && newPostMedia.value.length === 0) return;
    
    isSubmittingPost.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract hashtags
      const hashtagRegex = /#(\w+)/g;
      const hashtags = [];
      let match;
      while ((match = hashtagRegex.exec(newPostContent.value)) !== null) {
        hashtags.push(match[1]);
      }
      
      // Create media URLs (in a real app, you would upload these to a server)
      const media = newPostMedia.value.map((item, index) => ({
        url: item.preview,
        type: item.type
      }));
      
      // Create new post
      const newPost = {
        id: Date.now(),
        content: newPostContent.value,
        timestamp: new Date(),
        author: {
          name: authStore.userFullName,
          avatar: authStore.userAvatar
        },
        media,
        tags: hashtags,
        likes: 0,
        liked: false,
        comments: [],
        showComments: false
      };
      
      // Add to posts
      posts.value.unshift(newPost);
      
      // Reset form
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
      // Navigate to application detail
      alert('Chuyển đến trang chi tiết đơn ứng tuyển');
    } else if (notification.type === 'message') {
      // Navigate to chat
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
  
  // Fetch data (mock)
  onMounted(async () => {
    isLoading.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock posts data
      posts.value = [
        {
          id: 1,
          content: 'Vừa hoàn thành buổi trang điểm cho cô dâu xinh đẹp. Cảm ơn bạn đã tin tưởng lựa chọn dịch vụ của mình! ✨💄 #makeup #bride #wedding',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          author: {
            name: 'Nguyễn Thị Makeup',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
          },
          media: [
            { url: 'https://images.unsplash.com/photo-1560577953-53a1a4e2bc1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJpZGFsJTIwbWFrZXVwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://images.unsplash.com/photo-1595994195565-d5670ad4e74b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', type: 'image' }
          ],
          tags: ['makeup', 'bride', 'wedding', 'bridal'],
          likes: 24,
          liked: false,
          comments: [
            {
              id: 101,
              content: 'Trang điểm đẹp quá chị ơi!',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              author: {
                name: 'Minh Tâm',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
              }
            }
          ],
          showComments: false
        },
        {
          id: 2,
          content: 'Mình đang tìm nghệ sĩ trang điểm cho sự kiện công ty vào cuối tháng. Ai có kinh nghiệm và còn lịch trống không? #timkiemmakeupartist #sukien',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          author: {
            name: 'Công ty XYZ',
            avatar: null
          },
          media: [],
          tags: ['timkiemmakeupartist', 'sukien', 'event'],
          likes: 5,
          liked: false,
          comments: [],
          showComments: false,
          job: {
            id: 103,
            title: 'Tìm nghệ sĩ trang điểm cho sự kiện công ty',
            location: 'Quận 7, TP.HCM',
            date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            price: 3500000
          }
        },
        {
          id: 3,
          content: 'Chia sẻ một số sản phẩm trang điểm mình hay dùng cho các bạn tham khảo. Đây là những sản phẩm mình đã dùng và thấy hiệu quả nhất! #makeup #cosmetics #review',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          author: {
            name: 'Lê Thị B',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
          },
          media: [
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://images.unsplash.com/photo-1583241475880-083f84372725?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://images.unsplash.com/photo-1591375275624-fa9d336ee56c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://images.unsplash.com/photo-1583241475880-083f84372725?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' }
          ],
          tags: ['makeup', 'cosmetics', 'review'],
          likes: 42,
          liked: true,
          trending: true,
          comments: [
            {
              id: 201,
              content: 'Cảm ơn bạn đã chia sẻ! Mình sẽ thử sản phẩm thứ 2.',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
              author: {
                name: 'Hoàng Thị E',
                avatar: null
              }
            },
            {
              id: 202,
              content: 'Sản phẩm này giá bao nhiêu vậy bạn?',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
              author: {
                name: 'Ngọc Anh',
                avatar: null
              }
            }
          ],
          showComments: false
        },
        {
          id: 4,
          content: 'Mình vừa mở lịch trang điểm cho mùa cưới tháng 10-12. Các bạn có nhu cầu inbox mình sớm nhé! #bridemakeup #wedding #bookingopen',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          author: {
            name: 'Phạm Thị C',
            avatar: null
          },
          media: [
            { url: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', type: 'image' }
          ],
          tags: ['bridemakeup', 'wedding', 'bookingopen', 'bridal'],
          likes: 18,
          liked: false,
          comments: [],
          showComments: false
        }
      ];
      
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
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
          }
        },
        {
          id: 3,
          type: 'application',
          message: 'đã chấp nhận đơn ứng tuyển của bạn',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true,
          user: {
            name: 'Công ty XYZ',
            avatar: null
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
