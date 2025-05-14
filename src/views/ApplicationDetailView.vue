<template>
  <MainLayout>
    <div class="container py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <LoaderCircle class="animate-spin text-gray-900 h-12 w-12 mb-4" />
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle class="text-error h-16 w-16 mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
        <p class="text-gray-600 max-w-md mb-6">{{ error }}</p>
        <BaseButton 
          variant="primary" 
          class="bg-gray-900 text-white hover:bg-gray-800"
          @click="fetchApplicationDetail"
        >
          Thử lại
        </BaseButton>
      </div>

      <!-- Application Details -->
      <div v-else class="max-w-4xl mx-auto">
        <!-- Back button -->
        <div class="mb-6">
          <button 
            @click="$router.back()" 
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size="18" class="mr-2" />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        <!-- Header section -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <h1 class="text-2xl font-bold text-gray-900">Chi tiết đơn ứng tuyển</h1>
              <div 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusClasses(application.status)"
              >
                <component :is="getStatusIcon(application.status)" size="14" class="mr-1.5" />
                <span>{{ getStatusText(application.status) }}</span>
              </div>
            </div>
          </div>

          <!-- Application info -->
          <div class="p-6 bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin công việc</h2>
                <div class="bg-white rounded-lg shadow-sm p-4 space-y-3">
                  <h3 class="font-medium text-gray-900">{{ application.recruitmentPost?.title || 'Công việc không xác định' }}</h3>
                  
                  <div class="space-y-2">
                    <div class="flex items-center text-sm text-gray-600">
                      <MapPin size="14" class="mr-2 text-gray-400" />
                      <span>{{ application.recruitmentPost?.address || 'Địa điểm không xác định' }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <Calendar size="14" class="mr-2 text-gray-400" />
                      <span>{{ formatDate(application.recruitmentPost?.startTime) || 'Thời gian không xác định' }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <Clock size="14" class="mr-2 text-gray-400" />
                      <span>{{ application.recruitmentPost?.expectedDuration || 'Không xác định' }}</span>
                    </div>
                    <div class="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign size="14" class="mr-2 text-gray-700" />
                      <span>{{ formatPrice(application.recruitmentPost?.compensation) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin ứng viên</h2>
                <div class="bg-white rounded-lg shadow-sm p-4">
                  <div class="flex items-center mb-4">
                    <div class="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                      <img 
                        :src="application.applicant?.avatarUrl || '/placeholder-avatar.png'" 
                        alt="Applicant Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ application.applicant?.fullName || 'Không xác định' }}</h3>
                      <p class="text-sm text-gray-600">{{ application.applicant?.email || 'Không có email' }}</p>
                    </div>
                  </div>
                  
                  <div class="space-y-2 text-sm">
                    <div v-if="application.applicant?.phone" class="flex items-center">
                      <Phone size="14" class="mr-2 text-gray-400" />
                      <span>{{ application.applicant.phone }}</span>
                    </div>
                    <div v-if="application.preferredContactMethod" class="flex items-start">
                      <AtSign size="14" class="mr-2 text-gray-400 mt-0.5" />
                      <span>Liên hệ qua: {{ application.preferredContactMethod }}</span>
                    </div>
                    <div v-if="application.availability" class="flex items-start">
                      <Clock size="14" class="mr-2 text-gray-400 mt-0.5" />
                      <span>Thời gian có thể làm việc: {{ application.availability }}</span>
                    </div>
                    <div class="flex items-center">
                      <Calendar size="14" class="mr-2 text-gray-400" />
                      <span>Đã ứng tuyển {{ formatRelativeTime(application.appliedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Application message -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Lời nhắn ứng tuyển</h2>
          </div>
          <div class="p-6">
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <p class="text-gray-700 whitespace-pre-line">{{ application.message }}</p>
            </div>
            
            <div v-if="application.otherSkills" class="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Kỹ năng khác:</h3>
              <p class="text-gray-700">{{ application.otherSkills }}</p>
            </div>
          </div>
        </div>

        <!-- Portfolio Images -->
        <div v-if="application.images && application.images.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Hình ảnh portfolio</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div 
                v-for="(image, index) in application.images" 
                :key="index"
                class="aspect-square rounded-lg overflow-hidden cursor-pointer relative group"
                @click="openImageViewer(application.images, index)"
              >
                <img 
                  :src="image.url" 
                  alt="Portfolio image" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Search size="24" class="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div v-if="application.status === 'PENDING'" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Xử lý đơn ứng tuyển</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BaseButton 
                variant="outline" 
                class="border-gray-300 text-gray-700 hover:bg-gray-50"
                @click="rejectApplication"
              >
                <XCircle size="18" class="mr-2" />
                Từ chối đơn ứng tuyển
              </BaseButton>
              
              <BaseButton 
                variant="primary" 
                class="bg-gray-900 text-white hover:bg-gray-800"
                @click="acceptApplication"
              >
                <CheckCircle size="18" class="mr-2" />
                Chấp nhận đơn ứng tuyển
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Response info for accepted/rejected applications -->
        <div v-if="application.status === 'ACCEPTED'" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center text-success">
              <CheckCircle size="18" class="mr-2" />
              Đã chấp nhận đơn ứng tuyển
            </h2>
          </div>
          <div class="p-6 bg-success/5">
            <p class="text-gray-700 mb-3">Đơn ứng tuyển đã được chấp nhận vào {{ formatDate(application.acceptedAt) }}</p>
            <p v-if="application.responseMessage" class="text-gray-700 bg-white p-4 rounded-lg border border-success/20">
              {{ application.responseMessage }}
            </p>
          </div>
        </div>

        <div v-if="application.status === 'REJECTED'" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center text-error">
              <XCircle size="18" class="mr-2" />
              Đã từ chối đơn ứng tuyển
            </h2>
          </div>
          <div class="p-6 bg-error/5">
            <p class="text-gray-700 mb-3">Đơn ứng tuyển đã bị từ chối vào {{ formatDate(application.rejectedAt) }}</p>
            <p v-if="application.responseMessage" class="text-gray-700 bg-white p-4 rounded-lg border border-error/20">
              {{ application.responseMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Accept/Reject Confirmation Modal -->
      <div v-if="showActionModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="closeActionModal"></div>
        <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ actionType === 'accept' ? 'Xác nhận chấp nhận' : 'Xác nhận từ chối' }}
            </h2>
            <button class="text-gray-400 hover:text-gray-500" @click="closeActionModal">
              <X size="20" />
            </button>
          </div>
          
          <div class="p-6">
            <div class="flex flex-col items-center text-center mb-6">
              <component 
                :is="actionType === 'accept' ? CheckCircle : AlertTriangle" 
                :class="actionType === 'accept' ? 'text-success' : 'text-warning'"
                class="h-12 w-12 mb-4" 
              />
              <p class="text-gray-700 mb-4">
                {{ actionType === 'accept' 
                  ? 'Bạn có chắc chắn muốn chấp nhận đơn ứng tuyển này?' 
                  : 'Bạn có chắc chắn muốn từ chối đơn ứng tuyển này?' 
                }}
              </p>
            </div>
            
            <div class="mb-4">
              <label for="actionMessage" class="block text-sm font-medium text-gray-700 mb-1">
                {{ actionType === 'accept' ? 'Lời nhắn chấp nhận (không bắt buộc)' : 'Lý do từ chối (không bắt buộc)' }}
              </label>
              <textarea
                id="actionMessage"
                v-model="actionMessage"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring focus:ring-gray-200"
                :placeholder="actionType === 'accept' ? 'Thông tin thêm cho ứng viên...' : 'Lý do từ chối đơn ứng tuyển...'"
              ></textarea>
            </div>
            
            <div class="flex justify-end gap-3">
              <BaseButton 
                variant="secondary" 
                @click="closeActionModal"
              >
                Hủy
              </BaseButton>
              <BaseButton 
                :variant="actionType === 'accept' ? 'primary' : 'danger'"
                :loading="isProcessing"
                :class="actionType === 'accept' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''"
                @click="confirmAction"
              >
                {{ actionType === 'accept' ? 'Chấp nhận' : 'Từ chối' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Viewer Modal -->
      <div v-if="showImageViewer" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
        <div class="absolute inset-0" @click="closeImageViewer"></div>
        <div class="relative z-10 w-11/12 max-w-5xl">
          <button 
            class="absolute -top-12 right-0 text-white p-2 hover:rotate-180 transition-transform duration-300" 
            @click="closeImageViewer"
          >
            <X size="24" />
          </button>
          
          <div class="flex items-center justify-center h-[70vh]">
            <img 
              :src="currentImages[currentImageIndex]?.url" 
              alt="Application image" 
              class="max-w-full max-h-full object-contain shadow-2xl" 
            />
          </div>
          
          <div class="flex items-center justify-center gap-8 mt-6 text-white">
            <button 
              class="p-3 rounded-full bg-gray-800/50 backdrop-blur-md hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:-translate-x-1"
              @click="prevImage"
              :disabled="currentImageIndex === 0"
            >
              <ChevronLeft size="24" />
            </button>
            
            <div class="text-lg bg-gray-800/30 backdrop-blur-md px-4 py-2 rounded-full">
              {{ currentImageIndex + 1 }} / {{ currentImages.length }}
            </div>
            
            <button 
              class="p-3 rounded-full bg-gray-800/50 backdrop-blur-md hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:translate-x-1"
              @click="nextImage"
              :disabled="currentImageIndex === currentImages.length - 1"
            >
              <ChevronRight size="24" />
            </button>
          </div>
          
          <div class="flex gap-3 mt-6 overflow-x-auto pb-3">
            <div 
              v-for="(image, index) in currentImages" 
              :key="index"
              class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
              :class="index === currentImageIndex 
                ? 'ring-2 ring-white scale-105 shadow-lg' 
                : 'opacity-60 hover:opacity-100 hover:scale-105'"
              @click="currentImageIndex = index"
            >
              <img :src="image.url" alt="Thumbnail" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { 
  LoaderCircle, AlertTriangle, ArrowLeft, MapPin, Calendar, 
  Clock, DollarSign, Phone, AtSign, Search, CheckCircle, 
  XCircle, ChevronLeft, ChevronRight, X
} from 'lucide-vue-next';
import MainLayout from '@/layouts/MainLayout.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const applicationId = route.params.id;

// State
const isLoading = ref(true);
const error = ref(null);
const application = ref({});
const actionType = ref('accept'); // 'accept' or 'reject'
const showActionModal = ref(false);
const actionMessage = ref('');
const isProcessing = ref(false);

// Image viewer state
const showImageViewer = ref(false);
const currentImages = ref([]);
const currentImageIndex = ref(0);

// Methods
const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return Clock;
    case 'ACCEPTED':
      return CheckCircle;
    case 'REJECTED':
      return XCircle;
    default:
      return Clock;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Đang chờ phản hồi';
    case 'ACCEPTED':
      return 'Đã chấp nhận';
    case 'REJECTED':
      return 'Đã từ chối';
    default:
      return 'Không xác định';
  }
};

const getStatusClasses = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-50 text-yellow-700';
    case 'ACCEPTED':
      return 'bg-green-50 text-green-700';
    case 'REJECTED':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const formatDate = (date) => {
  if (!date) return 'Không xác định';
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));

  if (diff === 0) {
    return 'hôm nay';
  } else if (diff === 1) {
    return 'hôm qua';
  } else if (diff < 7) {
    return `${diff} ngày trước`;
  } else {
    return formatDate(date);
  }
};

const formatPrice = (price) => {
  if (!price) return 'Không xác định';
  
  // Check if price is already a number or needs to be extracted from a string
  let numericPrice = price;
  if (typeof price === 'string') {
    // Extract numbers from the string (remove non-numeric characters)
    const match = price.match(/\d+/g);
    numericPrice = match ? parseFloat(match.join('')) : 0;
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(numericPrice);
};

const fetchApplicationDetail = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      error.value = 'Bạn cần đăng nhập để xem chi tiết đơn ứng tuyển. Vui lòng đăng nhập và thử lại.';
      isLoading.value = false;
      return;
    }
    
    // Make API request with token
    const response = await axios.get(`http://localhost:8082/posting/api/applications/${applicationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Process the response data
    const appData = response.data;
    application.value = {
      ...appData,
      appliedAt: appData.appliedAt || new Date().toISOString(),
      images: appData.imageUrls ? appData.imageUrls.map(url => ({ url })) : []
    };
    
    console.log('Application detail fetched:', application.value);
  } catch (err) {
    console.error('Error fetching application detail:', err);
    error.value = err.response?.data?.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
  } finally {
    isLoading.value = false;
  }
};

const acceptApplication = () => {
  actionType.value = 'accept';
  actionMessage.value = '';
  showActionModal.value = true;
  document.body.style.overflow = 'hidden';
};

const rejectApplication = () => {
  actionType.value = 'reject';
  actionMessage.value = '';
  showActionModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeActionModal = () => {
  showActionModal.value = false;
  document.body.style.overflow = '';
};

const confirmAction = async () => {
  isProcessing.value = true;

  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Bạn cần đăng nhập để thực hiện hành động này.');
    }
    
    // Determine API endpoint and action based on actionType
    const endpoint = actionType.value === 'accept' 
      ? `http://localhost:8082/posting/api/applications/${applicationId}/accept`
      : `http://localhost:8082/posting/api/applications/${applicationId}/reject`;
    
    // Make API request with token
    await axios.post(endpoint, 
      { message: actionMessage.value || null }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Update local data
    application.value.status = actionType.value === 'accept' ? 'ACCEPTED' : 'REJECTED';
    application.value.responseMessage = actionMessage.value;
    
    // Set timestamps
    if (actionType.value === 'accept') {
      application.value.acceptedAt = new Date().toISOString();
    } else {
      application.value.rejectedAt = new Date().toISOString();
    }
    
    // Show success message
    alert(actionType.value === 'accept' 
      ? 'Đã chấp nhận đơn ứng tuyển thành công' 
      : 'Đã từ chối đơn ứng tuyển thành công');
    
    // Close modal
    closeActionModal();
    
  } catch (error) {
    console.error('Error processing application:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
  } finally {
    isProcessing.value = false;
  }
};

// Image viewer methods
const openImageViewer = (images, index) => {
  currentImages.value = images;
  currentImageIndex.value = index;
  showImageViewer.value = true;
  document.body.style.overflow = 'hidden';
};

const closeImageViewer = () => {
  showImageViewer.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  if (currentImageIndex.value < currentImages.value.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Fetch application on component mount
onMounted(() => {
  fetchApplicationDetail();
});
</script> 