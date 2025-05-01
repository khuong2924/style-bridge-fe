<template>
    <MainLayout>
      <div class="container py-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
          <LoaderCircle class="animate-spin text-primary h-12 w-12 mb-4" />
          <p class="text-gray-600">Đang tải thông tin công việc...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle size="48" class="text-error mb-4" />
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Không thể tải thông tin</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <BaseButton variant="primary" @click="$router.push('/jobs')">
            Quay lại danh sách công việc
          </BaseButton>
        </div>
        
        <!-- Content -->
        <div v-else>
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-8 mb-8">
            <div class="max-w-3xl mx-auto">
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                  {{ getMakeupTypeLabel(job.makeupType) }}
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                  {{ job.status === 'active' ? 'Đang tuyển' : 'Đã đóng' }}
                </span>
              </div>
              
              <h1 class="text-3xl font-bold mb-6">{{ job.title }}</h1>
              
              <div class="flex flex-wrap gap-6">
                <div class="flex items-center">
                  <Clock size="16" class="mr-2 opacity-80" />
                  <span>Đăng tải: {{ formatDate(job.postedAt) }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar size="16" class="mr-2 opacity-80" />
                  <span>Hết hạn: {{ formatDate(job.expireDate) }}</span>
                </div>
                <div class="flex items-center">
                  <Eye size="16" class="mr-2 opacity-80" />
                  <span>{{ job.views }} lượt xem</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <!-- Job Information -->
              <BaseCard>
                <template #header>
                  <h2 class="text-xl font-semibold text-gray-900">Thông tin công việc</h2>
                </template>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div class="flex items-start">
                      <MapPin size="18" class="text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p class="text-sm text-gray-500 mb-1">Địa điểm</p>
                        <p class="font-medium">{{ job.location }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div class="flex items-start">
                      <Calendar size="18" class="text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p class="text-sm text-gray-500 mb-1">Thời gian bắt đầu</p>
                        <p class="font-medium">{{ formatDateTime(job.startTime) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div class="flex items-start">
                      <Clock size="18" class="text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p class="text-sm text-gray-500 mb-1">Thời lượng dự kiến</p>
                        <p class="font-medium">{{ job.duration }} giờ</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div class="flex items-start">
                      <Tag size="18" class="text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p class="text-sm text-gray-500 mb-1">Hình thức thuê</p>
                        <p class="font-medium">
                          {{ job.hireType === 'package' ? 'Trọn gói' : 'Theo giờ' }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div class="flex items-start">
                      <DollarSign size="18" class="text-primary mt-0.5 mr-2" />
                      <div>
                        <p class="text-sm text-gray-500 mb-1">Thù lao</p>
                        <p class="font-medium text-lg text-primary">
                          {{ formatPrice(job.price) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div class="flex items-start">
                      <Users size="18" class="text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p class="text-sm text-gray-500 mb-1">Số lượng tuyển</p>
                        <p class="font-medium">{{ job.quantity }} người</p>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseCard>
              
              <!-- Job Description -->
              <BaseCard>
                <template #header>
                  <h2 class="text-xl font-semibold text-gray-900">Mô tả công việc</h2>
                </template>
                
                <div class="prose max-w-none">
                  <p v-for="(paragraph, index) in job.description.split('\n')" :key="index" class="mb-4">
                    {{ paragraph }}
                  </p>
                </div>
              </BaseCard>
              
              <!-- Reference Images -->
              <BaseCard v-if="job.images && job.images.length > 0">
                <template #header>
                  <h2 class="text-xl font-semibold text-gray-900">Hình ảnh tham khảo</h2>
                </template>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div 
                    v-for="(image, index) in job.images" 
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden cursor-pointer"
                    @click="openImageGallery(index)"
                  >
                    <img :src="image.url" :alt="`Reference ${index + 1}`" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </BaseCard>
            </div>
            
            <div class="space-y-6">
              <!-- Employer Card -->
              <BaseCard>
                <div class="space-y-6">
                  <div class="flex items-center">
                    <div class="h-16 w-16 rounded-full bg-gray-100 overflow-hidden mr-4">
                      <img 
                        :src="job.employer.avatar || '/placeholder-avatar.jpg'" 
                        alt="Employer Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">{{ job.employer.name }}</h3>
                      <p class="text-sm text-gray-500">Nhà tuyển dụng</p>
                    </div>
                  </div>
                  
                  <div class="space-y-3 pt-4 border-t border-gray-100">
                    <div class="flex items-center text-sm text-gray-600">
                      <Calendar size="16" class="mr-3 text-gray-400" />
                      <span>Tham gia từ {{ formatDate(job.employer.joinedAt) }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <Briefcase size="16" class="mr-3 text-gray-400" />
                      <span>{{ job.employer.jobCount }} công việc đã đăng</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <Star size="16" class="mr-3 text-gray-400" />
                      <span>Đánh giá: {{ job.employer.rating }}/5</span>
                    </div>
                  </div>
                  
                  <BaseButton 
                    variant="outline" 
                    block 
                    icon="User"
                    icon-position="left"
                  >
                    Xem hồ sơ
                  </BaseButton>
                </div>
              </BaseCard>
              
              <!-- Action Card -->
              <BaseCard>
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900">Quan tâm đến công việc này?</h3>
                  
                  <div class="flex items-baseline justify-between">
                    <span class="text-sm text-gray-500">Thù lao:</span>
                    <span class="text-2xl font-bold text-primary">{{ formatPrice(job.price) }}</span>
                  </div>
                  
                  <div class="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <Timer size="16" class="mr-2 text-gray-500" />
                    <span>
                      {{ isExpired ? 'Đã hết hạn' : `Còn ${getDaysRemaining(job.expireDate)} ngày để ứng tuyển` }}
                    </span>
                  </div>
                  
                  <BaseButton 
                    variant="primary" 
                    block 
                    size="lg"
                    :disabled="isExpired || job.status !== 'active'"
                    @click="applyForJob"
                  >
                    Ứng tuyển ngay
                  </BaseButton>
                  
                  <div class="grid grid-cols-3 gap-2">
                    <BaseButton 
                      variant="ghost" 
                      icon="Heart"
                      block
                      :class="{ 'text-primary': isSaved }"
                      @click="toggleSaveJob"
                    >
                      {{ isSaved ? 'Đã lưu' : 'Lưu' }}
                    </BaseButton>
                    
                    <BaseButton 
                      variant="ghost" 
                      icon="Share2"
                      block
                      @click="shareJob"
                    >
                      Chia sẻ
                    </BaseButton>
                    
                    <BaseButton 
                      variant="ghost" 
                      icon="Flag"
                      block
                      @click="reportJob"
                    >
                      Báo cáo
                    </BaseButton>
                  </div>
                </div>
              </BaseCard>
              
              <!-- Similar Jobs -->
              <BaseCard>
                <template #header>
                  <h3 class="text-lg font-semibold text-gray-900">Công việc tương tự</h3>
                </template>
                
                <div class="divide-y divide-gray-100">
                  <div 
                    v-for="similarJob in similarJobs" 
                    :key="similarJob.id"
                    class="py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    @click="viewSimilarJob(similarJob.id)"
                  >
                    <div class="flex justify-between">
                      <div class="pr-4">
                        <h4 class="font-medium text-gray-900 mb-1 line-clamp-2">{{ similarJob.title }}</h4>
                        <div class="flex items-center text-xs text-gray-500 mb-1">
                          <MapPin size="12" class="mr-1" />
                          <span>{{ similarJob.location }}</span>
                        </div>
                        <div class="text-sm font-medium text-primary">
                          {{ formatPrice(similarJob.price) }}
                        </div>
                      </div>
                      <ChevronRight size="16" class="text-gray-400 self-center flex-shrink-0" />
                    </div>
                  </div>
                </div>
                
                <div class="pt-4 mt-2 border-t border-gray-100">
                  <BaseButton 
                    variant="ghost" 
                    block
                    @click="$router.push('/jobs')"
                  >
                    Xem tất cả công việc
                  </BaseButton>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
        
        <!-- Image Gallery Modal -->
        <div v-if="showGallery" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-90" @click="closeImageGallery"></div>
          <div class="relative z-10 w-11/12 max-w-5xl">
            <button class="absolute -top-12 right-0 text-white p-2" @click="closeImageGallery">
              <X size="24" />
            </button>
            
            <div class="flex items-center justify-center h-[70vh]">
              <img 
                :src="job.images[currentImageIndex].url" 
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
                {{ currentImageIndex + 1 }} / {{ job.images.length }}
              </div>
              
              <button 
                class="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="nextImage"
                :disabled="currentImageIndex === job.images.length - 1"
              >
                <ChevronRight size="24" />
              </button>
            </div>
            
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
              <div 
                v-for="(image, index) in job.images" 
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
        
        <!-- Apply Modal -->
        <div v-if="showApplyModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeApplyModal"></div>
          <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Ứng tuyển công việc</h2>
              <button class="text-gray-400 hover:text-gray-500" @click="closeApplyModal">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
              <div class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ job.title }}</h3>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <User size="14" class="mr-1" />
                    <span>{{ job.employer.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <MapPin size="14" class="mr-1" />
                    <span>{{ job.location }}</span>
                  </div>
                </div>
              </div>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Lời nhắn <span class="text-error">*</span>
                  </label>
                  <textarea 
                    v-model="applicationForm.message" 
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                    placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với công việc này..."
                    rows="5"
                  ></textarea>
                  <p v-if="applicationErrors.message" class="mt-1 text-xs text-error">
                    {{ applicationErrors.message }}
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Hình ảnh đính kèm (tùy chọn)</label>
                  <p class="text-xs text-gray-500 mb-2">
                    Tải lên hình ảnh tác phẩm của bạn để tăng cơ hội được chọn
                  </p>
                  
                  <div class="flex items-center">
                    <input 
                      type="file" 
                      ref="fileInput" 
                      multiple 
                      accept="image/*" 
                      class="hidden"
                      @change="onFileChange"
                    />
                    <BaseButton 
                      variant="outline" 
                      type="button" 
                      icon="Upload"
                      @click="$refs.fileInput.click()"
                    >
                      Chọn ảnh
                    </BaseButton>
                  </div>
                  
                  <div v-if="applicationForm.images.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    <div 
                      v-for="(image, index) in applicationForm.images" 
                      :key="index"
                      class="relative aspect-square rounded overflow-hidden group"
                    >
                      <img :src="image.preview" alt="Preview" class="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        class="absolute top-1 right-1 p-1 bg-white rounded-full text-error shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="removeImage(index)"
                      >
                        <X size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 p-6 border-t border-gray-200">
              <BaseButton 
                variant="secondary" 
                @click="closeApplyModal"
              >
                Hủy
              </BaseButton>
              <BaseButton 
                variant="primary" 
                :loading="isSubmitting"
                @click="submitApplication"
              >
                Gửi đơn ứng tuyển
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { 
    Clock, Calendar, MapPin, Tag, DollarSign, Users, Eye,
    LoaderCircle, AlertCircle, User, Briefcase, Star, 
    Timer, Heart, Share2, Flag, ChevronRight,
    ChevronLeft, X
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  // State
  const isLoading = ref(true);
  const error = ref(null);
  const job = ref(null);
  const similarJobs = ref([]);
  const isSaved = ref(false);
  const showGallery = ref(false);
  const currentImageIndex = ref(0);
  const showApplyModal = ref(false);
  const isSubmitting = ref(false);
  
  const applicationForm = reactive({
    message: '',
    images: []
  });
  
  const applicationErrors = reactive({});
  
  // Computed
  const isExpired = computed(() => {
    if (!job.value) return true;
    return new Date(job.value.expireDate) < new Date();
  });
  
  // Mock data fetch
  onMounted(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock job data
      job.value = {
        id: 1,
        title: 'Tìm nghệ sĩ trang điểm cho sự kiện cưới tại TP.HCM',
        makeupType: 'bridal',
        status: 'active',
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expireDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        startTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        duration: 4,
        location: 'Quận 1, TP.HCM',
        hireType: 'package',
        price: 2500000,
        quantity: 1,
        views: 156,
        description: 'Chúng tôi đang tìm kiếm một nghệ sĩ trang điểm chuyên nghiệp cho một đám cưới vào cuối tháng này.\n\nYêu cầu:\n- Có kinh nghiệm trang điểm cô dâu tối thiểu 2 năm\n- Có khả năng tạo kiểu tóc cơ bản\n- Có portfolio đẹp và phong cách trang điểm tự nhiên\n- Có thể làm việc từ sáng sớm\n\nCông việc bao gồm:\n- Trang điểm cho cô dâu\n- Trang điểm nhẹ cho 2 phù dâu\n- Tạo kiểu tóc cơ bản\n\nVui lòng ứng tuyển với portfolio của bạn để chúng tôi xem xét. Cảm ơn!',
        images: [
          { url: 'https://images.unsplash.com/photo-1560577953-53a1a4e2bc1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJpZGFsJTIwbWFrZXVwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60' },
          { url: 'https://images.unsplash.com/photo-1595994195565-d5670ad4e74b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' },
          { url: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' }
        ],
        employer: {
          id: 101,
          name: 'Wedding Planner Studio',
          avatar: null,
          joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          jobCount: 24,
          rating: 4.8
        }
      };
      
      // Mock similar jobs
      similarJobs.value = [
        {
          id: 2,
          title: 'Trang điểm cho buổi chụp ảnh cưới ngoại cảnh',
          location: 'Quận 2, TP.HCM',
          price: 1800000
        },
        {
          id: 3,
          title: 'Cần tìm nghệ sĩ trang điểm cho tiệc cưới',
          location: 'Quận 7, TP.HCM',
          price: 2200000
        },
        {
          id: 4,
          title: 'Trang điểm cô dâu phong cách Hàn Quốc',
          location: 'Quận Bình Thạnh, TP.HCM',
          price: 2800000
        }
      ];
    } catch (err) {
      console.error('Error fetching job details:', err);
      error.value = 'Không thể tải thông tin công việc. Vui lòng thử lại sau.';
    } finally {
      isLoading.value = false;
    }
  });
  
  // Helper functions
  const getMakeupTypeLabel = (type) => {
    const types = {
      bridal: 'Cô dâu',
      event: 'Sự kiện',
      photoshoot: 'Chụp ảnh',
      artistic: 'Nghệ thuật',
      other: 'Khác'
    };
    return types[type] || 'Khác';
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  };
  
  const formatDateTime = (date) => {
    if (!date) return '';
    
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    const dateStr = new Date(date).toLocaleDateString('vi-VN', dateOptions);
    const timeStr = new Date(date).toLocaleTimeString('vi-VN', timeOptions);
    
    return `${dateStr} ${timeStr}`;
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getDaysRemaining = (date) => {
    const now = new Date();
    const expireDate = new Date(date);
    const diffTime = Math.abs(expireDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Gallery functions
  const openImageGallery = (index) => {
    currentImageIndex.value = index;
    showGallery.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeImageGallery = () => {
    showGallery.value = false;
    document.body.style.overflow = '';
  };
  
  const nextImage = () => {
    if (currentImageIndex.value < job.value.images.length - 1) {
      currentImageIndex.value++;
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  };
  
  // Job actions
  const toggleSaveJob = () => {
    isSaved.value = !isSaved.value;
  };
  
  const shareJob = () => {
    // Implement share functionality
    alert('Chức năng chia sẻ đang được phát triển');
  };
  
  const reportJob = () => {
    // Implement report functionality
    alert('Chức năng báo cáo đang được phát triển');
  };
  
  const viewSimilarJob = (jobId) => {
    // Navigate to similar job
    console.log('View similar job:', jobId);
    // router.push(`/jobs/${jobId}`);
  };
  
  // Application functions
  const applyForJob = () => {
    showApplyModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeApplyModal = () => {
    showApplyModal.value = false;
    document.body.style.overflow = '';
  };
  
  const validateApplication = () => {
    const errors = {};
    
    if (!applicationForm.message.trim()) {
      errors.message = 'Vui lòng nhập lời nhắn';
    } else if (applicationForm.message.length < 50) {
      errors.message = 'Lời nhắn quá ngắn, vui lòng viết ít nhất 50 ký tự';
    }
    
    Object.assign(applicationErrors, errors);
    return Object.keys(errors).length === 0;
  };
  
  const onFileChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        applicationForm.images.push({
          file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (index) => {
    applicationForm.images.splice(index, 1);
  };
  
  const submitApplication = async () => {
    if (!validateApplication()) return;
    
    isSubmitting.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success handling
      closeApplyModal();
      alert('Đơn ứng tuyển của bạn đã được gửi thành công!');
      
      // Reset form
      applicationForm.message = '';
      applicationForm.images = [];
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>