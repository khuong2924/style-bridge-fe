<template>
    <MainLayout>
      <div class="container py-8">
        <div class="max-w-3xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Tạo bài đăng tuyển dụng</h1>
            <p class="text-lg text-gray-600">
              Đăng tải thông tin công việc trang điểm của bạn để tìm kiếm nghệ sĩ trang điểm phù hợp
            </p>
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
              <div class="p-6 text-white">
                <h2 class="text-2xl font-bold mb-2 flex items-center">
                  <Briefcase class="mr-2" />
                  Tạo bài đăng mới
                </h2>
                <p class="text-gray-300 mb-4">Điền đầy đủ thông tin để tạo bài đăng tuyển dụng chất lượng</p>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <!-- Tiêu đề -->
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Tiêu đề <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.title"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Cần tìm nghệ sĩ trang điểm..."
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FileText class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.title" class="mt-1 text-xs text-red-400">{{ errors.title }}</p>
                  </div>
                  
                  <!-- Loại trang điểm -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Loại trang điểm <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <select
                        v-model="form.makeupType"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="" disabled>Chọn loại trang điểm</option>
                        <option value="Trang điểm cô dâu">Trang điểm cô dâu</option>
                        <option value="Trang điểm sự kiện">Trang điểm sự kiện</option>
                        <option value="Trang điểm nghệ thuật">Trang điểm nghệ thuật</option>
                        <option value="Trang điểm kỷ yếu">Trang điểm kỷ yếu</option>
                      </select>
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Palette class="h-5 w-5 text-gray-400" />
                      </div>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.makeupType" class="mt-1 text-xs text-red-400">{{ errors.makeupType }}</p>
                  </div>
                  
                  <!-- Thời gian bắt đầu -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Thời gian bắt đầu <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.startTime"
                        type="datetime-local"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.startTime" class="mt-1 text-xs text-red-400">{{ errors.startTime }}</p>
                  </div>
                  
                  <!-- Thời lượng dự kiến -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Thời lượng dự kiến <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.expectedDuration"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ví dụ: 3 giờ"
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Timer class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.expectedDuration" class="mt-1 text-xs text-red-400">{{ errors.expectedDuration }}</p>
                  </div>
                  
                  <!-- Địa chỉ -->
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Địa chỉ <span class="text-red-400">*</span>
                    </label>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <!-- Tỉnh/Thành phố -->
                      <div class="relative">
                        <select
                          v-model="form.province"
                          class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          @change="onProvinceChange"
                        >
                          <option value="" disabled>Chọn Tỉnh/Thành phố</option>
                          <option v-for="province in provinces" :key="province.code" :value="province.code">
                            {{ province.name }}
                          </option>
                        </select>
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin class="h-5 w-5 text-gray-400" />
                        </div>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown class="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <!-- Quận/Huyện -->
                      <div class="relative">
                        <select
                          v-model="form.district"
                          class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          :disabled="!form.province"
                        >
                          <option value="" disabled>Chọn Quận/Huyện</option>
                          <option v-for="district in districts" :key="district.code" :value="district.code">
                            {{ district.name }}
                          </option>
                        </select>
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Map class="h-5 w-5 text-gray-400" />
                        </div>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown class="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Chi tiết địa chỉ -->
                    <div class="relative">
                      <input
                        v-model="form.addressDetail"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Số nhà, tên đường, phường/xã..."
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Home class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.address" class="mt-1 text-xs text-red-400">{{ errors.address }}</p>
                  </div>
                  
                  <!-- Hình thức tuyển dụng -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Hình thức tuyển dụng <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <select
                        v-model="form.hiringType"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="" disabled>Chọn hình thức</option>
                        <option value="Trọn gói">Trọn gói</option>
                        <option value="Theo giờ">Theo giờ</option>
                      </select>
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Briefcase class="h-5 w-5 text-gray-400" />
                      </div>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.hiringType" class="mt-1 text-xs text-red-400">{{ errors.hiringType }}</p>
                  </div>
                  
                  <!-- Thù lao -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Thù lao (VNĐ) <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.compensation"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ví dụ: 1,500,000 VND"
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.compensation" class="mt-1 text-xs text-red-400">{{ errors.compensation }}</p>
                  </div>
                  
                  <!-- Số lượng -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Số lượng <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.quantity"
                        type="number"
                        min="1"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Users class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.quantity" class="mt-1 text-xs text-red-400">{{ errors.quantity }}</p>
                  </div>
                  
                  <!-- Mô tả -->
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Mô tả <span class="text-red-400">*</span>
                    </label>
                    <textarea 
                      v-model="form.description" 
                      class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Cần tìm nghệ sĩ trang điểm có kinh nghiệm..."
                      rows="4"
                      required
                    ></textarea>
                    <p v-if="errors.description" class="mt-1 text-xs text-red-400">{{ errors.description }}</p>
                  </div>
                  
                  <!-- Deadline -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Hạn chót <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.deadline"
                        type="datetime-local"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p v-if="errors.deadline" class="mt-1 text-xs text-red-400">{{ errors.deadline }}</p>
                  </div>
                  
                  <!-- Hình ảnh -->
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                      Hình ảnh
                    </label>
                    <div 
                      class="relative border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center transition-colors hover:border-primary-light"
                      :class="[isDragging ? 'border-primary bg-gray-700/50' : '']"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="onDrop"
                    >
                      <input 
                        type="file" 
                        ref="fileInput" 
                        multiple 
                        accept="image/*" 
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        @change="onFileChange"
                      />
                      <Upload size="40" class="text-gray-400 mb-3" />
                      <h3 class="text-lg font-medium text-white mb-1">Kéo thả hoặc nhấp để tải lên</h3>
                      <p class="text-sm text-gray-400 mb-4">Hỗ trợ JPG, PNG (Tối đa 5MB/ảnh)</p>
                      <button 
                        type="button"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        @click="$refs.fileInput.click()"
                      >
                        Chọn ảnh
                      </button>
                    </div>
                    
                    <div v-if="form.images.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div 
                        v-for="(image, index) in form.images" 
                        :key="index"
                        class="relative aspect-square rounded-md overflow-hidden group"
                      >
                        <img :src="image.preview" alt="Preview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button 
                            type="button" 
                            class="p-1.5 bg-white rounded-full text-red-500 hover:bg-gray-100 transition-colors"
                            @click="removeImage(index)"
                          >
                            <Trash2 size="16" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-4">
                <button 
                  type="button" 
                  class="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  @click="$router.push('/jobs')"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  class="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-colors shadow-lg flex items-center"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="flex items-center">
                    <LoaderCircle class="animate-spin mr-2 h-5 w-5" />
                    Đang đăng...
                  </span>
                  <span v-else class="flex items-center">
                    <Send class="mr-2 h-5 w-5" />
                    Đăng bài
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { 
    MapPin, Upload, Trash2, Palette, Camera, Calendar, Clock, Timer,
    Users, Gift, Sparkles, Award, Briefcase, DollarSign, FileText,
    ChevronDown, Send, LoaderCircle, Map, Home
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import { useAuthStore } from '@/stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Provinces data
  const provinces = ref([
    { code: '79', name: 'TP. Hồ Chí Minh' },
    { code: '74', name: 'Bình Dương' },
    { code: '75', name: 'Đồng Nai' }
  ]);
  
  // Districts data by province code
  const allDistricts = {
    '79': [ // TP. Hồ Chí Minh
      { code: '760', name: 'Quận 1' },
      { code: '761', name: 'Quận 12' },
      { code: '762', name: 'Quận Thủ Đức' },
      { code: '763', name: 'Quận 9' },
      { code: '764', name: 'Quận Gò Vấp' },
      { code: '765', name: 'Quận Bình Thạnh' },
      { code: '766', name: 'Quận Tân Bình' },
      { code: '767', name: 'Quận Tân Phú' },
      { code: '768', name: 'Quận Phú Nhuận' },
      { code: '769', name: 'Quận 2' },
      { code: '770', name: 'Quận 3' },
      { code: '771', name: 'Quận 10' },
      { code: '772', name: 'Quận 11' },
      { code: '773', name: 'Quận 4' },
      { code: '774', name: 'Quận 5' },
      { code: '775', name: 'Quận 6' },
      { code: '776', name: 'Quận 8' },
      { code: '777', name: 'Quận Bình Tân' },
      { code: '778', name: 'Quận 7' },
      { code: '783', name: 'Huyện Củ Chi' },
      { code: '784', name: 'Huyện Hóc Môn' },
      { code: '785', name: 'Huyện Bình Chánh' },
      { code: '786', name: 'Huyện Nhà Bè' },
      { code: '787', name: 'Huyện Cần Giờ' }
    ],
    '74': [ // Bình Dương
      { code: '718', name: 'Thành phố Thủ Dầu Một' },
      { code: '719', name: 'Huyện Bàu Bàng' },
      { code: '720', name: 'Huyện Dầu Tiếng' },
      { code: '721', name: 'Thị xã Bến Cát' },
      { code: '722', name: 'Huyện Phú Giáo' },
      { code: '723', name: 'Thành phố Tân Uyên' },
      { code: '724', name: 'Thành phố Dĩ An' },
      { code: '725', name: 'Thành phố Thuận An' },
      { code: '726', name: 'Huyện Bắc Tân Uyên' }
    ],
    '75': [ // Đồng Nai
      { code: '731', name: 'Thành phố Biên Hòa' },
      { code: '732', name: 'Thành phố Long Khánh' },
      { code: '734', name: 'Huyện Tân Phú' },
      { code: '735', name: 'Huyện Vĩnh Cửu' },
      { code: '736', name: 'Huyện Định Quán' },
      { code: '737', name: 'Huyện Trảng Bom' },
      { code: '738', name: 'Huyện Thống Nhất' },
      { code: '739', name: 'Huyện Cẩm Mỹ' },
      { code: '740', name: 'Huyện Long Thành' },
      { code: '741', name: 'Huyện Xuân Lộc' },
      { code: '742', name: 'Huyện Nhơn Trạch' }
    ]
  };
  
  const districts = ref([]);
  
  const form = reactive({
    title: 'Cần tìm nghệ sĩ',
    makeupType: 'Trang điểm cô dâu',
    startTime: '',
    expectedDuration: '3 giờ',
    address: '12 Nguyễn Huệ, Quận 1, TP.HCM',
    hiringType: 'Trọn gói',
    compensation: '1,500,000 VND',
    quantity: 2,
    description: 'Cần tìm nghệ sĩ trang điểm có kinh nghiệm...',
    deadline: '',
    images: [],
    province: '',
    district: '',
    addressDetail: ''
  });
  
  // Set default province and district based on the address
  const setDefaultAddress = () => {
    if (form.address.includes('TP.HCM') || form.address.includes('Hồ Chí Minh')) {
      form.province = '79'; // TP. Hồ Chí Minh
      onProvinceChange();
      
      // Try to find matching district
      if (form.address.includes('Quận 1')) {
        form.district = '760';
      } else if (form.address.includes('Quận 2')) {
        form.district = '769';
      } else if (form.address.includes('Quận 3')) {
        form.district = '770';
      }
      
      // Set address detail
      const addressParts = form.address.split(',');
      if (addressParts.length > 0) {
        form.addressDetail = addressParts[0].trim();
      }
    }
  };
  
  // Handle province change
  const onProvinceChange = () => {
    form.district = ''; // Reset district when province changes
    districts.value = allDistricts[form.province] || [];
  };
  
  // Computed property for full address
  const fullAddress = computed(() => {
    let address = '';
    
    if (form.addressDetail) {
      address += form.addressDetail;
    }
    
    if (form.district) {
      const districtObj = districts.value.find(d => d.code === form.district);
      if (districtObj && address) {
        address += ', ' + districtObj.name;
      } else if (districtObj) {
        address += districtObj.name;
      }
    }
    
    if (form.province) {
      const provinceObj = provinces.value.find(p => p.code === form.province);
      if (provinceObj && address) {
        address += ', ' + provinceObj.name;
      } else if (provinceObj) {
        address += provinceObj.name;
      }
    }
    
    return address;
  });
  
  const errors = reactive({});
  const isSubmitting = ref(false);
  const isDragging = ref(false);
  const fileInput = ref(null);
  
  // Set default dates and address
  onMounted(() => {
    // Set startTime to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0);
    form.startTime = tomorrow.toISOString().slice(0, 16);
    
    // Set deadline to next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 59);
    form.deadline = nextWeek.toISOString().slice(0, 16);
    
    // Set default address values
    setDefaultAddress();
  });
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!form.makeupType) newErrors.makeupType = 'Vui lòng chọn loại trang điểm';
    if (!form.startTime) newErrors.startTime = 'Vui lòng chọn thời gian bắt đầu';
    if (!form.expectedDuration) newErrors.expectedDuration = 'Vui lòng nhập thời lượng dự kiến';
    if (!form.province) newErrors.address = 'Vui lòng chọn Tỉnh/Thành phố';
    else if (!form.district) newErrors.address = 'Vui lòng chọn Quận/Huyện';
    else if (!form.addressDetail.trim()) newErrors.address = 'Vui lòng nhập chi tiết địa chỉ';
    if (!form.hiringType) newErrors.hiringType = 'Vui lòng chọn hình thức tuyển dụng';
    if (!form.compensation) newErrors.compensation = 'Vui lòng nhập thù lao';
    if (!form.quantity) newErrors.quantity = 'Vui lòng nhập số lượng';
    if (!form.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
    if (!form.deadline) newErrors.deadline = 'Vui lòng chọn hạn chót';
    
    Object.assign(errors, newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const onFileChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    addFiles(files);
  };
  
  const onDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer.files;
    if (!files.length) return;
    
    addFiles(files);
  };
  
  const addFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        form.images.push({
          file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (index) => {
    form.images.splice(index, 1);
  };
  
  const getToken = () => {
    // Try to get token from multiple sources
    return authStore.token || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('token') || 
           (axios.defaults.headers.common['Authorization'] || '').replace('Bearer ', '');
  };
  
  const submitForm = async () => {
    if (!validateForm()) return;
    
    isSubmitting.value = true;
    
    try {
      // Get authentication token
      const token = getToken();
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
      }
      
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add text fields to FormData
      formData.append('title', form.title);
      formData.append('makeupType', form.makeupType);
      formData.append('startTime', form.startTime);
      formData.append('expectedDuration', form.expectedDuration);
      formData.append('address', fullAddress.value); // Use the computed full address
      formData.append('hiringType', form.hiringType);
      formData.append('compensation', form.compensation);
      formData.append('quantity', form.quantity);
      formData.append('description', form.description);
      formData.append('deadline', form.deadline);
      
      // Add images to FormData
      form.images.forEach((image, index) => {
        formData.append('images', image.file);
      });
      
      // Make API request with bearer token
      const response = await axios.post(`${window.API_URL}${window.POSTING_API_PATH}/posts/with-images`, formData, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          // Don't set Content-Type when using FormData
        }
      });
      
      // Handle success
      console.log('Post created successfully:', response.data);
      alert('Đăng bài thành công!');
      
      // Redirect to jobs page
      router.push('/jobs');
      
    } catch (error) {
      console.error('Error creating post:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi đăng bài. Vui lòng thử lại sau.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
        
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles for dark theme */
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.6;
  }
  
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    opacity: 0.6;
  }
  </style>