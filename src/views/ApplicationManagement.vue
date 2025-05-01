<template>
    <MainLayout>
      <div class="container py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn ứng tuyển</h1>
          <p class="text-lg text-gray-600">
            Theo dõi trạng thái các đơn ứng tuyển của bạn
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
              {{ getApplicationCount(tab.value) }}
            </span>
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
          <LoaderCircle class="animate-spin text-primary h-12 w-12 mb-4" />
          <p class="text-gray-600">Đang tải dữ liệu...</p>
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
            @click="$router.push('/jobs')"
          >
            Tìm việc ngay
          </BaseButton>
        </div>
        
        <!-- Applications List -->
        <div v-else class="space-y-6">
          <ApplicationCard 
            v-for="application in filteredApplications" 
            :key="application.id"
            :application="application"
            @view="viewApplication"
            @withdraw="confirmWithdraw"
          />
        </div>
      </div>
      
      <!-- Withdraw Confirmation Modal -->
      <div v-if="showWithdrawModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeWithdrawModal"></div>
        <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Xác nhận rút đơn</h2>
            <button class="text-gray-400 hover:text-gray-500" @click="closeWithdrawModal">
              <X size="20" />
            </button>
          </div>
          
          <div class="p-6">
            <div class="flex flex-col items-center text-center mb-6">
              <AlertTriangle class="text-warning h-12 w-12 mb-4" />
              <p class="text-gray-700 mb-4">
                Bạn có chắc chắn muốn rút đơn ứng tuyển này không? Hành động này không thể hoàn tác.
              </p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="font-medium text-gray-900 mb-2">{{ selectedApplication?.job.title }}</h3>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center">
                  <User size="14" class="mr-2" />
                  <span>{{ selectedApplication?.job.employer.name }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar size="14" class="mr-2" />
                  <span>Đã ứng tuyển: {{ formatDate(selectedApplication?.appliedAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3">
              <BaseButton 
                variant="secondary" 
                @click="closeWithdrawModal"
              >
                Hủy
              </BaseButton>
              <BaseButton 
                variant="danger" 
                :loading="isWithdrawing"
                @click="withdrawApplication"
              >
                Rút đơn
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { 
    LoaderCircle, InboxIcon, X, AlertTriangle, 
    User, Calendar, Clock, CheckCircle, XCircle, 
    AlertCircle, Send
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import ApplicationCard from '@/components/ApplicationCard.vue';
  
  // Tabs
  const tabs = [
    { label: 'Tất cả', value: 'all', icon: InboxIcon },
    { label: 'Đã gửi', value: 'pending', icon: Send },
    { label: 'Đã chấp nhận', value: 'accepted', icon: CheckCircle },
    { label: 'Đã từ chối', value: 'rejected', icon: XCircle }
  ];
  
  // State
  const isLoading = ref(true);
  const applications = ref([]);
  const activeTab = ref('all');
  const showWithdrawModal = ref(false);
  const selectedApplication = ref(null);
  const isWithdrawing = ref(false);
  
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
        return 'Bạn chưa ứng tuyển vào công việc nào. Hãy tìm kiếm và ứng tuyển ngay!';
      case 'pending':
        return 'Bạn không có đơn ứng tuyển nào đang chờ phản hồi.';
      case 'accepted':
        return 'Bạn chưa có đơn ứng tuyển nào được chấp nhận.';
      case 'rejected':
        return 'Bạn không có đơn ứng tuyển nào bị từ chối.';
      default:
        return 'Không có đơn ứng tuyển nào.';
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
  
  const viewApplication = (applicationId) => {
    // Navigate to application detail
    console.log('View application:', applicationId);
    // router.push(`/applications/${applicationId}`);
  };
  
  const confirmWithdraw = (application) => {
    selectedApplication.value = application;
    showWithdrawModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeWithdrawModal = () => {
    showWithdrawModal.value = false;
    document.body.style.overflow = '';
  };
  
  const withdrawApplication = async () => {
    if (!selectedApplication.value) return;
  
    isWithdrawing.value = true;
  
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove application from list
      applications.value = applications.value.filter(app => app.id !== selectedApplication.value.id);
      
      // Close modal
      closeWithdrawModal();
      
      // Show success message
      alert('Đã rút đơn ứng tuyển thành công');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isWithdrawing.value = false;
    }
  };
  
  // Fetch applications (mock data)
  onMounted(async () => {
    isLoading.value = true;
  
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      applications.value = [
        {
          id: 1,
          status: 'pending',
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          message: 'Tôi có kinh nghiệm trang điểm cô dâu hơn 3 năm và đã làm việc với nhiều studio ảnh cưới lớn.',
          job: {
            id: 101,
            title: 'Tìm nghệ sĩ trang điểm cho sự kiện cưới tại TP.HCM',
            location: 'Quận 1, TP.HCM',
            price: 2500000,
            employer: {
              id: 201,
              name: 'Wedding Planner Studio',
              avatar: null
            }
          }
        },
        {
          id: 2,
          status: 'accepted',
          appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          message: 'Tôi đã có kinh nghiệm trang điểm cho nhiều sự kiện lớn và có thể đáp ứng yêu cầu của bạn.',
          job: {
            id: 102,
            title: 'Cần tìm nghệ sĩ trang điểm cho sự kiện công ty',
            location: 'Quận 7, TP.HCM',
            price: 1800000,
            employer: {
              id: 202,
              name: 'Event Solutions',
              avatar: null
            }
          }
        },
        {
          id: 3,
          status: 'rejected',
          appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          rejectedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          message: 'Tôi có thể tạo kiểu trang điểm nghệ thuật theo yêu cầu của bạn.',
          job: {
            id: 103,
            title: 'Tìm nghệ sĩ trang điểm cho buổi chụp ảnh thời trang',
            location: 'Quận 3, TP.HCM',
            price: 2200000,
            employer: {
              id: 203,
              name: 'Fashion Studio',
              avatar: null
            }
          }
        },
        {
          id: 4,
          status: 'pending',
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          message: 'Tôi có kinh nghiệm trang điểm theo phong cách Hàn Quốc và có thể đáp ứng yêu cầu của bạn.',
          job: {
            id: 104,
            title: 'Tìm nghệ sĩ trang điểm phong cách Hàn Quốc',
            location: 'Quận Bình Thạnh, TP.HCM',
            price: 1500000,
            employer: {
              id: 204,
              name: 'K-Beauty Studio',
              avatar: null
            }
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  