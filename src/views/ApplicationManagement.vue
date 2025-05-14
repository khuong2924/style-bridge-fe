<template>
    <MainLayout>
      <div class="container py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn ứng tuyển</h1>
          <p class="text-lg text-gray-600">
            Theo dõi các đơn ứng tuyển cho công việc của bạn
          </p>
        </div>
        
        <div class="flex flex-wrap border-b border-gray-200 mb-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            class="flex items-center px-4 py-2 text-sm font-medium mr-4 -mb-px transition-colors"
            :class="activeTab === tab.value 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'"
            @click="activeTab = tab.value"
          >
            <component :is="tab.icon" class="mr-2" size="18" />
            <span>{{ tab.label }}</span>
            <span class="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {{ getApplicationCount(tab.value) }}
            </span>
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
          <LoaderCircle class="animate-spin text-gray-900 h-12 w-12 mb-4" />
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle class="text-error h-16 w-16 mb-4" />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
          <p class="text-gray-600 max-w-md mb-6">
            {{ error }}
          </p>
          <BaseButton 
            variant="primary" 
            @click="fetchApplications"
          >
            Thử lại
          </BaseButton>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredApplications.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <InboxIcon class="text-gray-300 h-16 w-16 mb-4" />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Không có đơn ứng tuyển</h2>
          <p class="text-gray-600 max-w-md mb-6">
            {{ getEmptyMessage() }}
          </p>
          <BaseButton 
            variant="primary" 
            class="bg-gray-900 text-white hover:bg-gray-800"
            @click="$router.push('/jobs/create')"
          >
            <Briefcase size="18" class="mr-2" />
            Đăng việc mới
          </BaseButton>
        </div>
        
        <!-- Applications List -->
        <div v-else class="space-y-6">
          <div 
            v-for="application in filteredApplications" 
            :key="application.id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClasses(application.status)"
                >
                  <component :is="getStatusIcon(application.status)" size="14" class="mr-1.5" />
                  <span>{{ getStatusText(application.status) }}</span>
                </div>
                
                <div class="flex items-center text-sm text-gray-500">
                  <Clock size="14" class="mr-1.5" />
                  <span>Đã ứng tuyển {{ formatDate(application.appliedAt) }}</span>
                </div>
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ application.recruitmentPost?.title || 'Công việc không xác định' }}</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm text-gray-600">
                  <div class="flex items-center">
                    <User size="14" class="mr-1.5 text-gray-400" />
                    <span>{{ application.applicant?.fullName || 'Không xác định' }}</span>
                  </div>
                  
                  <div class="flex items-center">
                    <Mail size="14" class="mr-1.5 text-gray-400" />
                    <span>{{ application.applicant?.email || 'Không có email' }}</span>
                  </div>
                  
                  <div class="flex items-center">
                    <Phone size="14" class="mr-1.5 text-gray-400" />
                    <span>{{ application.applicant?.phone || 'Không có SĐT' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="mb-4 p-4 bg-gray-50 rounded-md">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Lời nhắn ứng viên:</h4>
                <p class="text-sm text-gray-600">{{ application.message }}</p>
              </div>
              
              <div v-if="application.otherSkills" class="mb-4 p-4 bg-gray-50 rounded-md">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Kỹ năng khác:</h4>
                <p class="text-sm text-gray-600">{{ application.otherSkills }}</p>
              </div>
              
              <div v-if="application.availability" class="mb-4 p-4 bg-gray-50 rounded-md">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Thời gian có thể làm việc:</h4>
                <p class="text-sm text-gray-600">{{ application.availability }}</p>
              </div>
              
              <div v-if="application.images && application.images.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Hình ảnh:</h4>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <div 
                    v-for="(image, index) in application.images" 
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden cursor-pointer relative group"
                    @click="openImageViewer(application.images, index)"
                  >
                    <img 
                      :src="image.url" 
                      alt="Application image" 
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Search size="24" class="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end gap-3">
                <BaseButton 
                  v-if="application.status === 'PENDING'"
                  variant="outline" 
                  size="sm"
                  class="border-gray-300 text-gray-700 hover:bg-gray-50"
                  @click="rejectApplication(application)"
                >
                  <XCircle size="16" class="mr-2" />
                  Từ chối
                </BaseButton>
                
                <BaseButton 
                  v-if="application.status === 'PENDING'"
                  variant="primary" 
                  size="sm"
                  class="bg-gray-900 text-white hover:bg-gray-800"
                  @click="acceptApplication(application)"
                >
                  <CheckCircle size="16" class="mr-2" />
                  Chấp nhận
                </BaseButton>
                
                <BaseButton 
                  variant="secondary" 
                  size="sm"
                  @click="viewApplicationDetail(application)"
                >
                  <Eye size="16" class="mr-2" />
                  Xem chi tiết
                </BaseButton>
              </div>
            </div>
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
            
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="font-medium text-gray-900 mb-2">{{ selectedApplication?.recruitmentPost?.title }}</h3>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center">
                  <User size="14" class="mr-2" />
                  <span>{{ selectedApplication?.applicant?.fullName }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar size="14" class="mr-2" />
                  <span>Đã ứng tuyển: {{ formatDate(selectedApplication?.appliedAt) }}</span>
                </div>
              </div>
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
            @click="closeImageViewer">
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
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { 
    LoaderCircle, InboxIcon, X, AlertTriangle, 
    User, Calendar, Clock, CheckCircle, XCircle, 
    AlertCircle, Send, Search, Mail, Phone, Eye,
    ChevronLeft, ChevronRight, Briefcase
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  const router = useRouter();
  
  // Tabs
  const tabs = [
    { label: 'Tất cả', value: 'all', icon: InboxIcon },
    { label: 'Đang chờ', value: 'PENDING', icon: Send },
    { label: 'Đã chấp nhận', value: 'ACCEPTED', icon: CheckCircle },
    { label: 'Đã từ chối', value: 'REJECTED', icon: XCircle }
  ];
  
  // State
  const isLoading = ref(true);
  const error = ref(null);
  const applications = ref([]);
  const activeTab = ref('all');
  const showActionModal = ref(false);
  const actionType = ref('accept'); // 'accept' or 'reject'
  const selectedApplication = ref(null);
  const isProcessing = ref(false);
  const actionMessage = ref('');
  
  // Image viewer state
  const showImageViewer = ref(false);
  const currentImages = ref([]);
  const currentImageIndex = ref(0);
  
  // Computed
  const filteredApplications = computed(() => {
    if (activeTab.value === 'all') {
      return applications.value;
    }
    return applications.value.filter(app => app.status === activeTab.value);
  });
  
  // Methods
  const getApplicationCount = (status) => {
    if (status === 'all') {
      return applications.value.length;
    }
    return applications.value.filter(app => app.status === status).length;
  };
  
  const getEmptyMessage = () => {
    switch (activeTab.value) {
      case 'all':
        return 'Chưa có ai ứng tuyển vào công việc của bạn. Hãy đăng công việc mới để tìm kiếm người phù hợp!';
      case 'PENDING':
        return 'Không có đơn ứng tuyển nào đang chờ phản hồi.';
      case 'ACCEPTED':
        return 'Bạn chưa chấp nhận đơn ứng tuyển nào.';
      case 'REJECTED':
        return 'Bạn chưa từ chối đơn ứng tuyển nào.';
      default:
        return 'Không có đơn ứng tuyển nào.';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return Send;
      case 'ACCEPTED':
        return CheckCircle;
      case 'REJECTED':
        return XCircle;
      default:
        return Send;
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
      return new Date(date).toLocaleDateString('vi-VN');
    }
  };
  
  const fetchApplications = async () => {
    isLoading.value = true;
    error.value = null;
  
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        error.value = 'Bạn cần đăng nhập để xem đơn ứng tuyển. Vui lòng đăng nhập và thử lại.';
        isLoading.value = false;
        return;
      }
      
      // Make API request with token
      const response = await axios.get('http://localhost:8082/posting/api/applications/authored', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Process the response data
      applications.value = response.data.map(app => ({
        ...app,
        appliedAt: app.appliedAt || new Date().toISOString(),
        images: app.imageUrls ? app.imageUrls.map(url => ({ url })) : []
      }));
      
      console.log('Applications fetched:', applications.value);
    } catch (err) {
      console.error('Error fetching applications:', err);
      error.value = err.response?.data?.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
    } finally {
      isLoading.value = false;
    }
  };
  
  const acceptApplication = (application) => {
    selectedApplication.value = application;
    actionType.value = 'accept';
    actionMessage.value = '';
    showActionModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const rejectApplication = (application) => {
    selectedApplication.value = application;
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
    if (!selectedApplication.value) return;
  
    isProcessing.value = true;
  
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện hành động này.');
      }
      
      // Determine API endpoint and action based on actionType
      const endpoint = actionType.value === 'accept' 
        ? `http://localhost:8082/posting/api/applications/${selectedApplication.value.id}/accept`
        : `http://localhost:8082/posting/api/applications/${selectedApplication.value.id}/reject`;
      
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
      const index = applications.value.findIndex(app => app.id === selectedApplication.value.id);
      if (index !== -1) {
        applications.value[index].status = actionType.value === 'accept' ? 'ACCEPTED' : 'REJECTED';
        // Update other fields if necessary
        if (actionType.value === 'accept') {
          applications.value[index].acceptedAt = new Date().toISOString();
        } else {
          applications.value[index].rejectedAt = new Date().toISOString();
        }
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
  
  const viewApplicationDetail = (application) => {
    // Navigate to application detail page
    router.push(`/applications/${application.id}`);
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
  
  // Watch for tab changes to update URL param
  watch(activeTab, (newTab) => {
    router.replace({ query: { tab: newTab === 'all' ? undefined : newTab } });
  });
  
  // Fetch applications on component mount
  onMounted(async () => {
    // Check for tab in URL
    const tabFromQuery = router.currentRoute.value.query.tab;
    if (tabFromQuery && tabs.some(tab => tab.value === tabFromQuery)) {
      activeTab.value = tabFromQuery;
    }
    
    await fetchApplications();
  });
  </script>
  