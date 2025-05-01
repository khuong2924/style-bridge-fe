<template>
    <MainLayout>
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div class="container">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl font-bold mb-4">Tìm kiếm công việc trang điểm</h1>
            <p class="text-xl opacity-90 mb-8">
              Khám phá các cơ hội làm việc trang điểm hấp dẫn từ các nhà tuyển dụng hàng đầu
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="relative flex-grow">
                <Search size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Tìm kiếm theo tiêu đề, địa điểm..." 
                  class="w-full pl-10 pr-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-white/50 shadow-lg"
                  @keyup.enter="applyFilters"
                />
              </div>
              <BaseButton 
                variant="secondary" 
                class="py-3 px-6 bg-white text-primary hover:bg-gray-100 shadow-lg"
                @click="applyFilters"
              >
                Tìm kiếm
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="container py-12">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Filters Sidebar -->
          <aside class="lg:col-span-1">
            <BaseCard class="sticky top-24">
              <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-900">Bộ lọc</h2>
                
                <div class="space-y-2">
                  <h3 class="text-sm font-medium text-gray-700">Loại trang điểm</h3>
                  <div class="space-y-2">
                    <label v-for="type in makeupTypes" :key="type.value" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :value="type.value" 
                        v-model="filters.makeupTypes"
                        class="rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ type.label }}</span>
                    </label>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <h3 class="text-sm font-medium text-gray-700">Hình thức thuê</h3>
                  <div class="space-y-2">
                    <label v-for="type in hireTypes" :key="type.value" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :value="type.value" 
                        v-model="filters.hireTypes"
                        class="rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ type.label }}</span>
                    </label>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <h3 class="text-sm font-medium text-gray-700">Mức thù lao</h3>
                  <div class="space-y-2">
                    <label v-for="range in priceRanges" :key="range.value" class="flex items-center">
                      <input 
                        type="radio" 
                        :value="range.value" 
                        v-model="filters.priceRange"
                        name="priceRange"
                        class="border-gray-300 text-primary focus:ring-primary" 
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ range.label }}</span>
                    </label>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <h3 class="text-sm font-medium text-gray-700">Địa điểm</h3>
                  <BaseInput
                    v-model="filters.location"
                    placeholder="Nhập địa điểm"
                    :icon-left="MapPin"
                  />
                </div>
                
                <div class="flex gap-3">
                  <BaseButton 
                    variant="outline" 
                    block 
                    @click="resetFilters"
                  >
                    Đặt lại
                  </BaseButton>
                  <BaseButton 
                    variant="primary" 
                    block 
                    @click="applyFilters"
                  >
                    Áp dụng
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </aside>
          
          <!-- Job Listings -->
          <div class="lg:col-span-3">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ filteredJobs.length }} công việc</h2>
                <p class="text-sm text-gray-500">Hiển thị kết quả phù hợp nhất</p>
              </div>
              
              <div class="mt-3 sm:mt-0 flex items-center">
                <label for="sortBy" class="text-sm text-gray-700 mr-2">Sắp xếp theo:</label>
                <select 
                  id="sortBy" 
                  v-model="sortBy" 
                  class="rounded-md border-gray-300 text-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                  @change="applyFilters"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highestPay">Thù lao cao nhất</option>
                  <option value="lowestPay">Thù lao thấp nhất</option>
                </select>
              </div>
            </div>
            
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
              <LoaderCircle class="animate-spin text-primary h-12 w-12 mb-4" />
              <p class="text-gray-600">Đang tải dữ liệu...</p>
            </div>
            
            <div v-else-if="filteredJobs.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <SearchX size="64" class="text-gray-300 mb-4" />
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p class="text-gray-600 max-w-md mb-6">
                Không có công việc nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với các tiêu chí khác.
              </p>
              <BaseButton 
                variant="outline" 
                @click="resetFilters"
              >
                Xóa bộ lọc
              </BaseButton>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <JobCard 
                v-for="job in filteredJobs" 
                :key="job.id" 
                :job="job"
                @click="viewJobDetails(job.id)"
              />
            </div>
            
            <div v-if="filteredJobs.length > 0" class="flex justify-center mt-10">
              <nav class="flex items-center gap-1">
                <button 
                  class="flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                >
                  <ChevronLeft size="16" class="mr-1" />
                  <span>Trước</span>
                </button>
                
                <div class="flex">
                  <button 
                    v-for="page in totalPages" 
                    :key="page"
                    class="w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors"
                    :class="page === currentPage 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button 
                  class="flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                >
                  <span>Tiếp</span>
                  <ChevronRight size="16" class="ml-1" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { 
    Search, MapPin, ChevronLeft, ChevronRight, 
    LoaderCircle, SearchX
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import JobCard from '@/components/JobCard.vue';
  
  // Mock data
  const makeupTypes = [
    { label: 'Cô dâu', value: 'bridal' },
    { label: 'Sự kiện', value: 'event' },
    { label: 'Chụp ảnh', value: 'photoshoot' },
    { label: 'Nghệ thuật', value: 'artistic' },
    { label: 'Khác', value: 'other' }
  ];
  
  const hireTypes = [
    { label: 'Trọn gói', value: 'package' },
    { label: 'Theo giờ', value: 'hourly' }
  ];
  
  const priceRanges = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới 500.000đ', value: 'under500k' },
    { label: '500.000đ - 1.000.000đ', value: '500kto1m' },
    { label: '1.000.000đ - 2.000.000đ', value: '1mto2m' },
    { label: 'Trên 2.000.000đ', value: 'over2m' }
  ];
  
  // State
  const searchQuery = ref('');
  const filters = ref({
    makeupTypes: [],
    hireTypes: [],
    priceRange: 'all',
    location: ''
  });
  const sortBy = ref('newest');
  const currentPage = ref(1);
  const itemsPerPage = 6;
  const isLoading = ref(true);
  const jobs = ref([]);
  
  // Fetch jobs (mock data)
  onMounted(async () => {
    isLoading.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      jobs.value = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Tìm nghệ sĩ trang điểm cho ${['sự kiện cưới', 'chụp ảnh kỷ yếu', 'sự kiện công ty', 'show diễn thời trang'][i % 4]}`,
        makeupType: makeupTypes[i % 5].value,
        location: `${['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh'][i % 5]}, TP.HCM`,
        hireType: hireTypes[i % 2].value,
        price: Math.floor(Math.random() * 3000000) + 500000,
        postedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        expireDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        employer: {
          name: `Công ty ${String.fromCharCode(65 + i % 26)}`,
          avatar: null
        },
        imageUrl: null
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      isLoading.value = false;
    }
  });
  
  // Computed
  const filteredJobs = computed(() => {
    let result = [...jobs.value];
    
    // Apply search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.location.toLowerCase().includes(query)
      );
    }
    
    // Apply makeup type filter
    if (filters.value.makeupTypes.length > 0) {
      result = result.filter(job => filters.value.makeupTypes.includes(job.makeupType));
    }
    
    // Apply hire type filter
    if (filters.value.hireTypes.length > 0) {
      result = result.filter(job => filters.value.hireTypes.includes(job.hireType));
    }
    
    // Apply price range filter
    if (filters.value.priceRange !== 'all') {
      switch (filters.value.priceRange) {
        case 'under500k':
          result = result.filter(job => job.price < 500000);
          break;
        case '500kto1m':
          result = result.filter(job => job.price >= 500000 && job.price <= 1000000);
          break;
        case '1mto2m':
          result = result.filter(job => job.price > 1000000 && job.price <= 2000000);
          break;
        case 'over2m':
          result = result.filter(job => job.price > 2000000);
          break;
      }
    }
    
    // Apply location filter
    if (filters.value.location) {
      const locationQuery = filters.value.location.toLowerCase();
      result = result.filter(job => job.location.toLowerCase().includes(locationQuery));
    }
    
    // Apply sorting
    switch (sortBy.value) {
      case 'newest':
        result.sort((a, b) => b.postedAt - a.postedAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.postedAt - b.postedAt);
        break;
      case 'highestPay':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'lowestPay':
        result.sort((a, b) => a.price - b.price);
        break;
    }
    
    return result;
  });
  
  const paginatedJobs = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredJobs.value.slice(startIndex, endIndex);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(filteredJobs.value.length / itemsPerPage);
  });
  
  // Methods
  const applyFilters = () => {
    currentPage.value = 1;
  };
  
  const resetFilters = () => {
    searchQuery.value = '';
    filters.value = {
      makeupTypes: [],
      hireTypes: [],
      priceRange: 'all',
      location: ''
    };
    sortBy.value = 'newest';
    currentPage.value = 1;
  };
  
  const changePage = (page) => {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const viewJobDetails = (jobId) => {
    // Navigate to job details page
    console.log('View job details:', jobId);
    // router.push(`/jobs/${jobId}`);
  };
  </script>