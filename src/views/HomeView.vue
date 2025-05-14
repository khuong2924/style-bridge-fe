<template>
    <MainLayout>
      <div class="container py-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cột Trái - Thông tin người dùng và menu -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Thông tin người dùng -->
            <BaseCard class="motion-scale-in-[0.95] motion-delay-[0.21s]/scale motion-duration-[0.53s]/scale motion-ease-spring-bouncier">
              <div class="flex items-center">
                <div class="h-16 w-16 rounded-full bg-gray-100 overflow-hidden mr-4 group relative">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s"
                    alt="User Avatar" 
                    class="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Nguyễn Thị A</h3>
                  <p class="text-sm text-primary">Nghệ sĩ trang điểm</p>
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
            
            <!-- Menu nhanh -->
            <BaseCard>
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
            
            <!-- Thông báo ứng tuyển -->
            <BaseCard>
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
            <!-- Đăng bài -->
            <BaseCard>
              <div class="flex items-start">
                <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s" 
                    alt="User Avatar" 
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex-grow">
                  <div 
                    class="w-full px-4 py-3 rounded-full border border-gray-300 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                    @click="handlePostClick()"
                  >
                    Bạn đang nghĩ gì?
                  </div>
                  
                  <div class="flex mt-3 space-x-2">
                    <button 
                      class="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors btn-hover-hide btn-action-primary"
                      @click="handlePostClick()"
                    >
                      <Image size="18" class="mr-2 text-primary" />
                      <span class="text-sm text-gray-700">Hình ảnh</span>
                    </button>
                    <button 
                      class="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors btn-hover-hide btn-action-success"
                      @click="handlePostClick()"
                    >
                      <Video size="18" class="mr-2 text-success" />
                      <span class="text-sm text-gray-700">Video</span>
                    </button>
                    <button 
                      class="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors btn-hover-hide btn-action-warning"
                      @click="handleJobsClick()"
                    >
                      <Briefcase size="18" class="mr-2 text-warning" />
                      <span class="text-sm text-gray-700">Đăng việc</span>
                    </button>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Bộ lọc -->
            <div class="relative mb-4">
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-r from-primary-lighter/10 via-primary/5 to-primary-dark/10 rounded-lg -z-10"></div>
              <div class="flex items-center justify-between mb-2 px-2">
                <h3 class="text-lg font-semibold text-gray-800">Khám phá</h3>
                <div class="text-xs text-gray-500">{{ filteredPosts.length }} bài viết</div>
              </div>
              <div class="filter-container flex overflow-x-auto py-3 px-2 space-x-3 scrollbar-hide relative">
                <button 
                  v-for="filter in filters" 
                  :key="filter.value"
                  class="group flex items-center px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 hover:translate-y-[-2px] bg-white/90 backdrop-blur-sm border border-gray-200/90 text-gray-700 hover:border-primary/30 hover:shadow-md hover:bg-gray-50/80"
                  @click="activeFilter = filter.value"
                >
                  <div class="relative">
                    <component 
                      :is="filter.icon" 
                      :size="16" 
                      class="mr-2 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3"
                    />
                    <span 
                      v-if="getFilterCount(filter.value) > 0 && filter.value !== 'all'" 
                      class="absolute -top-2 -right-2 w-4 h-4 bg-error text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                    >
                      {{ getFilterCount(filter.value) }}
                    </span>
                  </div>
                  <span>{{ filter.label }}</span>
                  <span 
                    v-if="activeFilter === filter.value" 
                    class="ml-2 h-2 w-2 rounded-full bg-primary"
                  ></span>
                  <span 
                    class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary-dark/20 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  ></span>
                </button>
                
                <!-- Gradient edge effect -->
                <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
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
                class="btn-hover-hide"
                @click="handlePostClick()"
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
                        :src="post.author.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                        alt="Author Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ post.author.name }}</h3>
                      <p class="text-xs text-primary">{{ formatTime(post.timestamp) }}</p>
                    </div>
                  </div>
                  
                  <button class="text-gray-400 hover:text-primary rounded-full p-2 hover:bg-gray-50 transition-colors btn-hover-hide">
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
                    @click="handleMenuClick(`/jobs/${post.job.id}`)"
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
                        <span class="mr-1.5 font-bold text-xs">₫</span>
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
                          :class="post.liked ? 'text-error heart-filled' : 'text-gray-400'"
                          class="mr-1 cursor-pointer heart-animation"
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
                      class="flex items-center justify-center flex-1 py-2 rounded-md hover:bg-gray-50 transition-colors btn-hover-hide btn-action-like"
                      @click="toggleLike(post)"
                    >
                      <Heart 
                        size="18" 
                        :class="post.liked ? 'text-error heart-filled' : 'text-gray-500'"
                        class="mr-2 heart-animation"
                      />
                      <span class="text-sm" :class="post.liked ? 'text-error' : 'text-gray-700'">Thích</span>
                    </button>
                    
                    <button 
                      class="flex items-center justify-center flex-1 py-2 rounded-md hover:bg-gray-50 transition-colors btn-hover-hide btn-action-comment"
                      @click="focusComment(post.id)"
                    >
                      <MessageSquare size="18" class="text-gray-500 mr-2" />
                      <span class="text-sm text-gray-700">Bình luận</span>
                    </button>
                    
                    <button 
                      class="flex items-center justify-center flex-1 py-2 rounded-md hover:bg-gray-50 transition-colors btn-hover-hide btn-action-share"
                      @click="sharePost(post)"
                    >
                      <Share2 size="18" class="text-gray-500 mr-2" />
                      <span class="text-sm text-gray-700">Chia sẻ</span>
                    </button>
                  </div>
                </div>
                
                <!-- Comments -->
                <div v-if="post.showComments" class="px-4 py-3 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm rounded-b-xl">
                  <!-- Comment list -->
                  <div v-if="post.comments.length > 0" class="space-y-3 mb-3">
                    <div 
                      v-for="comment in post.comments" 
                      :key="comment.id"
                      class="flex items-start"
                    >
                      <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-2 flex-shrink-0">
                        <img 
                          :src="comment.author.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'" 
                          alt="Comment Author Avatar" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="bg-white rounded-lg px-3 py-2 shadow-sm max-w-[85%]">
                        <div class="flex items-center mb-1">
                          <h4 class="text-xs font-medium text-gray-900">{{ comment.author.name }}</h4>
                          <span class="text-xs text-gray-500 ml-2">{{ formatTime(comment.timestamp) }}</span>
                        </div>
                        <p class="text-sm text-gray-700 break-words">{{ comment.content }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Comment input -->
                  <div class="flex items-start">
                    <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-2 flex-shrink-0">
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s" 
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
                        class="w-full px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                        @keyup.enter="addComment(post)"
                      />
                      <button 
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark transition-colors"
                        @click="addComment(post)"
                      >
                        <Send size="18" />
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
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { 
    X, LoaderCircle, Image, Video, Briefcase, MapPin, Calendar, DollarSign,
    Heart, MessageSquare, Share2, MoreVertical, Send, Smile, Check,
    ChevronLeft, ChevronRight, TrendingUp, Newspaper, Home, Bell, Users,
    Settings, HelpCircle, Filter, Sparkles, Brush, Camera, Palette
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import { useAuthStore } from '@/stores/auth';
  
  // Auth store
  const authStore = useAuthStore();
  
  // Add this line:
  const router = useRouter();
  
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
    { label: 'Tất cả', value: 'all', icon: Filter },
    { label: 'Công việc', value: 'jobs', icon: Briefcase },
    { label: 'Xu hướng', value: 'trending', icon: TrendingUp },
    { label: 'Trang điểm cô dâu', value: 'bridal', icon: Sparkles },
    { label: 'Trang điểm sự kiện', value: 'event', icon: Camera },
    { label: 'Trang điểm nghệ thuật', value: 'artistic', icon: Palette }
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
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(price).replace('₫', '').trim();
  };
  
  const closeSubscriptionBanner = () => {
    isSubscriptionBannerClosed.value = true;
    localStorage.setItem('subscriptionBannerClosed', 'true');
  };
  
  const toggleLike = (post) => {
    // Bypass authentication check for UI/UX testing
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    
    // Add animation effect if liked
    if (post.liked) {
      const heartElements = document.querySelectorAll('.heart-filled');
      heartElements.forEach(heart => {
        heart.classList.add('animate-pulse');
        setTimeout(() => {
          heart.classList.remove('animate-pulse');
        }, 1000);
      });
    }
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
    // Bypass authentication check for UI/UX testing
    
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
    // Bypass authentication check for UI/UX testing
    
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
  
  const getFilterCount = (filterValue) => {
    if (filterValue === 'all') return posts.value.length;
    if (filterValue === 'jobs') return posts.value.filter(post => post.job).length;
    if (filterValue === 'trending') return posts.value.filter(post => post.trending).length;
    return posts.value.filter(post => post.tags && post.tags.includes(filterValue)).length;
  };
  
  const handlePostClick = () => {
    // Bypass authentication check for UI/UX testing
    showPostModal.value = true;
  };
  
  const handleJobsClick = () => {
    // Bypass authentication check for UI/UX testing
    handleMenuClick('/jobs/create');
  };
  
  const handleMenuClick = (path) => {
    // List of routes that should be accessible without authentication
    const publicRoutes = ['/', '/jobs', '/help'];
    
    // Check if the path is a protected route
    const isProtectedRoute = !publicRoutes.some(route => path.startsWith(route));
    
    // For testing UI/UX, we'll just navigate to all routes
    // In a real app, you would check authentication here
    router.push(path);
    
    // Uncomment this in production:
    /*
    if (isProtectedRoute && !authStore.isAuthenticated) {
      // Show login prompt or redirect to login
      alert('Vui lòng đăng nhập để truy cập trang này');
      router.push('/login');
    } else {
      router.push(path);
    }
    */
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
            avatar: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png'
          },
          media: [
            { url: 'https://afamilycdn.com/150157425591193600/2020/3/15/590521086729755431268163506859756613829005-1584241194844185165225.jpg', type: 'image' },
            { url: 'https://nvhphunu.vn/wp-content/uploads/2024/05/r32r23r3rUntitled.png', type: 'image' }
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
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'
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
            avatar: 'https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-women-cartoon-avatar-in-flat-style-png-image_6110776.png'
          },
          media: [
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://images.unsplash.com/photo-1583241475880-083f84372725?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', type: 'image' },
            { url: 'https://nvhphunu.vn/wp-content/uploads/2024/05/r32r23r3rUntitled.png', type: 'image' },
            { url: 'https://nvhphunu.vn/wp-content/uploads/2024/05/r32r23r3rUntitled.png', type: 'image' },
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
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s'
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
</style>
