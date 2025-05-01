<template>
    <MainLayout>
      <div class="container py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Đánh giá</h1>
          <p class="text-lg text-gray-600">
            Xem và quản lý đánh giá từ khách hàng
          </p>
        </div>
        
        <div class="flex flex-wrap border-b border-gray-200 mb-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            class="flex items-center px-4 py-2 text-sm font-medium mr-4 -mb-px transition-colors"
            :class="activeTab === tab.value 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'"
            @click="activeTab = tab.value"
          >
            <component :is="tab.icon" class="mr-2" size="18" />
            <span>{{ tab.label }}</span>
            <span class="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {{ getReviewCount(tab.value) }}
            </span>
          </button>
        </div>
        
        <!-- Summary Card -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Tổng quan đánh giá</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div class="text-4xl font-bold text-primary mb-2">{{ averageRating.toFixed(1) }}</div>
                <div class="flex items-center text-warning mb-2">
                  <Star v-for="i in Math.floor(averageRating)" :key="`star-${i}`" size="20" fill="currentColor" />
                  <StarHalf v-if="averageRating % 1 >= 0.5" size="20" fill="currentColor" />
                  <Star v-for="i in 5 - Math.ceil(averageRating)" :key="`empty-star-${i}`" size="20" class="text-gray-300" />
                </div>
                <div class="text-sm text-gray-500">{{ totalReviews }} đánh giá</div>
              </div>
              
              <div class="md:col-span-2">
                <div v-for="i in 5" :key="`rating-${i}`" class="flex items-center mb-2">
                  <div class="w-12 text-sm text-gray-600 text-right mr-3">{{ 6 - i }} sao</div>
                  <div class="flex-grow h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-warning"
                      :style="{ width: `${getRatingPercentage(6 - i)}%` }"
                    ></div>
                  </div>
                  <div class="w-12 text-sm text-gray-600 ml-3">{{ getRatingCount(6 - i) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
          <LoaderCircle class="animate-spin text-primary h-12 w-12 mb-4" />
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredReviews.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare class="text-gray-300 h-16 w-16 mb-4" />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Không có đánh giá</h2>
          <p class="text-gray-600 max-w-md mb-6">
            {{ getEmptyMessage() }}
          </p>
        </div>
        
        <!-- Reviews List -->
        <div v-else class="space-y-6">
          <div 
            v-for="review in filteredReviews" 
            :key="review.id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-start">
                  <div class="h-12 w-12 rounded-full bg-gray-100 overflow-hidden mr-4">
                    <img 
                      :src="review.user.avatar || '/placeholder-avatar.jpg'" 
                      alt="User Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 mb-1">{{ review.user.name }}</h3>
                    <div class="flex items-center">
                      <div class="flex items-center text-warning mr-2">
                        <Star v-for="i in review.rating" :key="`star-${i}`" size="16" fill="currentColor" />
                        <Star v-for="i in 5 - review.rating" :key="`empty-star-${i}`" size="16" class="text-gray-300" />
                      </div>
                      <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button 
                    v-if="!review.replied"
                    class="text-primary hover:text-primary-dark p-1"
                    @click="replyToReview(review)"
                  >
                    <Reply size="18" />
                  </button>
                  <button 
                    class="text-gray-400 hover:text-error p-1"
                    @click="reportReview(review)"
                  >
                    <Flag size="18" />
                  </button>
                </div>
              </div>
              
              <div class="mb-4">
                <p class="text-gray-700">{{ review.comment }}</p>
              </div>
              
              <div v-if="review.jobTitle" class="mb-4 p-3 bg-gray-50 rounded-md">
                <div class="flex items-center text-sm">
                  <Briefcase size="14" class="mr-2 text-gray-500" />
                  <span class="text-gray-700">{{ review.jobTitle }}</span>
                </div>
              </div>
              
              <div v-if="review.images && review.images.length > 0" class="mb-4">
                <div class="grid grid-cols-4 gap-2">
                  <div 
                    v-for="(image, index) in review.images" 
                    :key="index"
                    class="aspect-square rounded overflow-hidden cursor-pointer"
                    @click="openGallery(review, index)"
                  >
                    <img :src="image.url" :alt="`Review image ${index + 1}`" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              
              <div v-if="review.replied" class="mt-4 pl-4 border-l-2 border-gray-200">
                <div class="flex items-start mb-2">
                  <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-3">
                    <img 
                      :src="profile.avatar || '/placeholder-avatar.jpg'" 
                      alt="Your Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ profile.fullName }}</h4>
                    <span class="text-xs text-gray-500">{{ formatDate(review.replyDate) }}</span>
                  </div>
                </div>
                <p class="text-gray-700">{{ review.replyText }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Reply Modal -->
        <div v-if="showReplyModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeReplyModal"></div>
          <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Trả lời đánh giá</h2>
              <button class="text-gray-400 hover:text-gray-500" @click="closeReplyModal">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6">
              <div class="mb-4 p-4 bg-gray-50 rounded-md">
                <div class="flex items-center mb-2">
                  <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-3">
                    <img 
                      :src="selectedReview?.user.avatar || '/placeholder-avatar.jpg'" 
                      alt="User Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ selectedReview?.user.name }}</h4>
                    <div class="flex items-center">
                      <div class="flex items-center text-warning mr-2">
                        <Star v-for="i in selectedReview?.rating" :key="`star-${i}`" size="14" fill="currentColor" />
                        <Star v-for="i in 5 - (selectedReview?.rating || 0)" :key="`empty-star-${i}`" size="14" class="text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-700">{{ selectedReview?.comment }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phản hồi của bạn <span class="text-error">*</span>
                </label>
                <textarea 
                  v-model="replyText" 
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                  placeholder="Viết phản hồi của bạn..."
                ></textarea>
                <p v-if="replyError" class="mt-1 text-xs text-error">
                  {{ replyError }}
                </p>
              </div>
              
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton 
                  type="button"
                  variant="secondary" 
                  @click="closeReplyModal"
                >
                  Hủy
                </BaseButton>
                <BaseButton 
                  type="button"
                  variant="primary" 
                  :loading="isSubmittingReply"
                  @click="submitReply"
                >
                  Gửi phản hồi
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Gallery Modal -->
        <div v-if="showGallery" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-90" @click="closeGallery"></div>
          <div class="relative z-10 w-11/12 max-w-5xl">
            <button class="absolute -top-12 right-0 text-white p-2" @click="closeGallery">
              <X size="24" />
            </button>
            
            <div class="flex items-center justify-center h-[70vh]">
              <img 
                :src="galleryImages[currentImageIndex]?.url" 
                :alt="`Gallery image ${currentImageIndex + 1}`" 
                class="max-w-full max-h-full object-contain" 
              />
            </div>
            
            <div class="flex items-center justify-center gap-8 mt-4 text-white">
              <button 
                class="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="prevImage"
                :disabled="currentImageIndex === 0"
              >
                <ChevronLeft size="24" />
              </button>
              
              <div class="text-lg">
                {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
              </div>
              
              <button 
                class="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="nextImage"
                :disabled="currentImageIndex === galleryImages.length - 1"
              >
                <ChevronRight size="24" />
              </button>
            </div>
            
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
              <div 
                v-for="(image, index) in galleryImages" 
                :key="index"
                class="w-20 h-20 rounded overflow-hidden cursor-pointer transition-opacity"
                :class="index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'"
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
  import { ref, computed, onMounted } from 'vue';
  import { 
    LoaderCircle, MessageSquare, Star, StarHalf, Reply, Flag, 
    X, Briefcase, ChevronLeft, ChevronRight
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  // Tabs
  const tabs = [
    { label: 'Tất cả đánh giá', value: 'all', icon: MessageSquare },
    { label: 'Chưa trả lời', value: 'unreplied', icon: Reply },
    { label: 'Đã trả lời', value: 'replied', icon: MessageSquare }
  ];
  
  // State
  const isLoading = ref(true);
  const reviews = ref([]);
  const activeTab = ref('all');
  const showReplyModal = ref(false);
  const selectedReview = ref(null);
  const replyText = ref('');
  const replyError = ref('');
  const isSubmittingReply = ref(false);
  const showGallery = ref(false);
  const galleryImages = ref([]);
  const currentImageIndex = ref(0);
  const error = ref(null);
  
  // Profile info (mock)
  const profile = ref({
    fullName: 'Nguyễn Thị Makeup',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  });
  
  // Computed
  const filteredReviews = computed(() => {
    if (activeTab.value === 'all') {
      return reviews.value;
    } else if (activeTab.value === 'unreplied') {
      return reviews.value.filter(review => !review.replied);
    } else if (activeTab.value === 'replied') {
      return reviews.value.filter(review => review.replied);
    }
    return reviews.value;
  });
  
  const totalReviews = computed(() => reviews.value.length);
  
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.value.length;
  });
  
  // Methods
  const getReviewCount = (tab) => {
    if (tab === 'all') {
      return reviews.value.length;
    } else if (tab === 'unreplied') {
      return reviews.value.filter(review => !review.replied).length;
    } else if (tab === 'replied') {
      return reviews.value.filter(review => review.replied).length;
    }
    return 0;
  };
  
  const getEmptyMessage = () => {
    switch (activeTab.value) {
      case 'all':
        return 'Bạn chưa nhận được đánh giá nào.';
      case 'unreplied':
        return 'Không có đánh giá nào cần trả lời.';
      case 'replied':
        return 'Bạn chưa trả lời đánh giá nào.';
      default:
        return 'Không có đánh giá nào.';
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
  
    if (diff === 0) {
      return 'Hôm nay';
    } else if (diff === 1) {
      return 'Hôm qua';
    } else if (diff < 7) {
      return `${diff} ngày trước`;
    } else {
      return new Date(date).toLocaleDateString('vi-VN');
    }
  };
  
  const getRatingCount = (rating) => {
    return reviews.value.filter(review => review.rating === rating).length;
  };
  
  const getRatingPercentage = (rating) => {
    if (reviews.value.length === 0) return 0;
    return (getRatingCount(rating) / reviews.value.length) * 100;
  };
  
  const replyToReview = (review) => {
    selectedReview.value = review;
    replyText.value = '';
    replyError.value = '';
    showReplyModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeReplyModal = () => {
    showReplyModal.value = false;
    document.body.style.overflow = '';
  };
  
  const submitReply = async () => {
    if (!replyText.value.trim()) {
      replyError.value = 'Vui lòng nhập nội dung phản hồi';
      return;
    }
    
    isSubmittingReply.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update review with reply
      const index = reviews.value.findIndex(r => r.id === selectedReview.value.id);
      if (index !== -1) {
        reviews.value[index].replied = true;
        reviews.value[index].replyText = replyText.value;
        reviews.value[index].replyDate = new Date();
      }
      
      // Close modal
      closeReplyModal();
      
      // Show success message
      alert('Phản hồi đã được gửi thành công');
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isSubmittingReply.value = false;
    }
  };
  
  const reportReview = (review) => {
    // Implement report functionality
    alert('Chức năng báo cáo đánh giá đang được phát triển');
  };
  
  const openGallery = (review, index) => {
    galleryImages.value = review.images;
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
  
  // Fetch reviews (mock data)
  onMounted(async () => {
    isLoading.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      reviews.value = [
        {
          id: 1,
          rating: 5,
          comment: 'Chị trang điểm rất tỉ mỉ và chuyên nghiệp. Mình rất hài lòng với kết quả và nhận được nhiều lời khen trong ngày cưới.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          jobTitle: 'Trang điểm cô dâu - Đám cưới tại TP.HCM',
          replied: true,
          replyText: 'Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của mình. Rất vui khi biết bạn hài lòng với kết quả. Chúc bạn hạnh phúc!',
          replyDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          images: [
            { url: 'https://images.unsplash.com/photo-1560577953-53a1a4e2bc1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJpZGFsJTIwbWFrZXVwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60' },
            { url: 'https://images.unsplash.com/photo-1595994195565-d5670ad4e74b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' }
          ],
          user: {
            name: 'Trần Thị A',
            avatar: null
          }
        },
        {
          id: 2,
          rating: 5,
          comment: 'Trang điểm đẹp tự nhiên, phù hợp với gương mặt. Chị còn tư vấn kiểu tóc rất hợp với khuôn mặt mình.',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          jobTitle: 'Trang điểm dự tiệc',
          replied: false,
          images: [],
          user: {
            name: 'Lê Thị B',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
          }
        },
        {
          id: 3,
          rating: 4,
          comment: 'Trang điểm đẹp, nhưng phần tóc hơi lỏng nên không giữ được lâu. Nhưng nhìn chung vẫn rất ưng ý.',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          jobTitle: 'Trang điểm chụp ảnh kỷ yếu',
          replied: true,
          replyText: 'Cảm ơn bạn đã phản hồi. Mình xin ghi nhận ý kiến về phần tóc và sẽ cải thiện trong lần sau. Rất mong được phục vụ bạn lần nữa!',
          replyDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          images: [
            { url: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' }
          ],
          user: {
            name: 'Phạm Thị C',
            avatar: null
          }
        },
        {
          id: 4,
          rating: 3,
          comment: 'Trang điểm ổn, nhưng thời gian làm hơi lâu. Mong lần sau có thể nhanh hơn một chút.',
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          jobTitle: 'Trang điểm sự kiện công ty',
          replied: false,
          images: [],
          user: {
            name: 'Nguyễn Văn D',
            avatar: null
          }
        },
        {
          id: 5,
          rating: 5,
          comment: 'Tuyệt vời! Chị trang điểm rất khéo và tỉ mỉ. Mình rất thích phong cách tự nhiên mà vẫn nổi bật.',
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          jobTitle: 'Trang điểm dự tiệc cưới',
          replied: true,
          replyText: 'Cảm ơn bạn đã tin tưởng và đánh giá cao dịch vụ của mình. Rất vui khi biết bạn hài lòng với kết quả!',
          replyDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
          images: [
            { url: 'https://images.unsplash.com/photo-1581309553233-52c066fec8c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' }
          ],
          user: {
            name: 'Hoàng Thị E',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  