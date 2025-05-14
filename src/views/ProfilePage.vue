<template>
    <MainLayout>
      <div class="container py-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
          <LoaderCircle class="animate-spin text-primary h-12 w-12 mb-4" />
          <p class="text-gray-600">Đang tải thông tin hồ sơ...</p>
        </div>
        
        <!-- Content -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Profile Card -->
            <BaseCard>
              <div class="flex flex-col items-center text-center">
                <div class="relative mb-4">
                  <div class="h-32 w-32 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-md">
                    <img 
                      :src="profile.avatar || '/placeholder-avatar.jpg'" 
                      alt="Profile Avatar" 
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <button 
                    class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition-colors"
                    @click="openAvatarUpload"
                  >
                    <Camera size="16" />
                  </button>
                  <input 
                    type="file" 
                    ref="avatarInput" 
                    class="hidden" 
                    accept="image/*"
                    @change="onAvatarChange"
                  />
                </div>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ profile.fullName }}</h2>
                <p class="text-gray-500 mb-4">{{ profile.role }}</p>
                
                <div class="flex items-center justify-center mb-4">
                  <div class="flex items-center text-warning">
                    <Star v-for="i in Math.floor(profile.rating)" :key="`star-${i}`" size="16" fill="currentColor" />
                    <StarHalf v-if="profile.rating % 1 >= 0.5" size="16" fill="currentColor" />
                    <Star v-for="i in 5 - Math.ceil(profile.rating)" :key="`empty-star-${i}`" size="16" class="text-gray-300" />
                  </div>
                  <span class="ml-2 text-sm text-gray-600">{{ profile.rating.toFixed(1) }} ({{ profile.reviewCount }} đánh giá)</span>
                </div>
                
                <div class="w-full flex space-x-2">
                  <BaseButton 
                    variant="primary" 
                    block
                    @click="isEditMode = true"
                  >
                    Chỉnh sửa hồ sơ
                  </BaseButton>
                  
                  <BaseButton 
                    variant="outline" 
                    icon="Share2"
                    @click="shareProfile"
                  >
                    Chia sẻ
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
            
            <!-- Contact Info -->
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Thông tin liên hệ</h3>
              </template>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <Mail size="18" class="text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Email</p>
                    <p class="font-medium">{{ profile.email }}</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <Phone size="18" class="text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p class="font-medium">{{ profile.phone }}</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <MapPin size="18" class="text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Địa chỉ</p>
                    <p class="font-medium">{{ profile.address }}</p>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Skills -->
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Kỹ năng</h3>
              </template>
              
              <div class="space-y-4">
                <div v-for="(skill, index) in profile.skills" :key="index" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">{{ skill.name }}</span>
                    <span class="text-xs text-gray-500">{{ skill.level }}/5</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary h-2 rounded-full" 
                      :style="{ width: `${(skill.level / 5) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Social Links -->
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Liên kết mạng xã hội</h3>
              </template>
              
              <div class="space-y-3">
                <a 
                  v-for="(social, index) in profile.socialLinks" 
                  :key="index"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <component :is="getSocialIcon(social.platform)" size="18" class="mr-3" :class="getSocialIconClass(social.platform)" />
                  <span class="text-gray-700">{{ social.username }}</span>
                </a>
              </div>
            </BaseCard>
          </div>
          
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Edit Profile Form -->
            <BaseCard v-if="isEditMode">
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-xl font-semibold text-gray-900">Chỉnh sửa hồ sơ</h3>
                  <button 
                    class="text-gray-400 hover:text-gray-500"
                    @click="isEditMode = false"
                  >
                    <X size="20" />
                  </button>
                </div>
              </template>
              
              <form @submit.prevent="saveProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="editForm.fullName" 
                      placeholder="Nhập họ và tên"
                      :error="formErrors.fullName"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="editForm.role" 
                      placeholder="Ví dụ: Chuyên gia trang điểm cô dâu"
                      :error="formErrors.role"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Email <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="editForm.email" 
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      :error="formErrors.email"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="editForm.phone" 
                      placeholder="Nhập số điện thoại"
                      :error="formErrors.phone"
                    />
                  </div>
                  
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="editForm.address" 
                      placeholder="Nhập địa chỉ"
                      :error="formErrors.address"
                    />
                  </div>
                  
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Giới thiệu bản thân
                    </label>
                    <textarea 
                      v-model="editForm.bio" 
                      rows="4"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                      placeholder="Viết giới thiệu ngắn về bản thân..."
                    ></textarea>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Kỹ năng</h4>
                  <div class="space-y-4">
                    <div 
                      v-for="(skill, index) in editForm.skills" 
                      :key="index"
                      class="flex items-center gap-4"
                    >
                      <div class="flex-grow">
                        <BaseInput 
                          v-model="skill.name" 
                          placeholder="Tên kỹ năng"
                        />
                      </div>
                      <div class="w-24">
                        <select 
                          v-model="skill.level"
                          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        >
                          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                        </select>
                      </div>
                      <button 
                        type="button"
                        class="text-gray-400 hover:text-error"
                        @click="removeSkill(index)"
                      >
                        <Trash2 size="18" />
                      </button>
                    </div>
                    
                    <BaseButton 
                      type="button"
                      variant="outline" 
                      size="sm"
                      icon="Plus"
                      @click="addSkill"
                    >
                      Thêm kỹ năng
                    </BaseButton>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Liên kết mạng xã hội</h4>
                  <div class="space-y-4">
                    <div 
                      v-for="(social, index) in editForm.socialLinks" 
                      :key="index"
                      class="flex items-center gap-4"
                    >
                      <div class="w-32">
                        <select 
                          v-model="social.platform"
                          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="youtube">YouTube</option>
                        </select>
                      </div>
                      <div class="flex-grow">
                        <BaseInput 
                          v-model="social.username" 
                          placeholder="Tên người dùng"
                        />
                      </div>
                      <div class="flex-grow">
                        <BaseInput 
                          v-model="social.url" 
                          placeholder="URL"
                        />
                      </div>
                      <button 
                        type="button"
                        class="text-gray-400 hover:text-error"
                        @click="removeSocial(index)"
                      >
                        <Trash2 size="18" />
                      </button>
                    </div>
                    
                    <BaseButton 
                      type="button"
                      variant="outline" 
                      size="sm"
                      icon="Plus"
                      @click="addSocial"
                    >
                      Thêm liên kết
                    </BaseButton>
                  </div>
                </div>
                
                <div class="flex justify-end gap-3 pt-4">
                  <BaseButton 
                    type="button"
                    variant="secondary" 
                    @click="isEditMode = false"
                  >
                    Hủy
                  </BaseButton>
                  <BaseButton 
                    type="submit"
                    variant="primary" 
                    :loading="isSaving"
                  >
                    Lưu thay đổi
                  </BaseButton>
                </div>
              </form>
            </BaseCard>
            
            <!-- Bio -->
            <BaseCard v-else>
              <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Giới thiệu</h3>
              </template>
              
              <div class="prose max-w-none">
                <p v-for="(paragraph, index) in profile.bio.split('\n')" :key="index" class="mb-4">
                  {{ paragraph }}
                </p>
              </div>
            </BaseCard>
            
            <!-- Portfolio -->
            <BaseCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-xl font-semibold text-gray-900">Bộ sưu tập</h3>
                  <BaseButton 
                    variant="outline" 
                    size="sm"
                    icon="Plus"
                    @click="openPortfolioUpload"
                  >
                    Thêm ảnh
                  </BaseButton>
                  <input 
                    type="file" 
                    ref="portfolioInput" 
                    class="hidden" 
                    accept="image/*"
                    multiple
                    @change="onPortfolioChange"
                  />
                </div>
              </template>
              
              <div v-if="profile.portfolio.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
                <ImageIcon class="text-gray-300 h-16 w-16 mb-4" />
                <h4 class="text-lg font-medium text-gray-900 mb-2">Chưa có ảnh nào</h4>
                <p class="text-gray-600 max-w-md mb-4">
                  Thêm ảnh vào bộ sưu tập để giới thiệu tác phẩm của bạn với khách hàng tiềm năng.
                </p>
                <BaseButton 
                  variant="primary" 
                  icon="Upload"
                  @click="openPortfolioUpload"
                >
                  Tải ảnh lên
                </BaseButton>
              </div>
              
              <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div 
                  v-for="(image, index) in profile.portfolio" 
                  :key="index"
                  class="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                  @click="openGallery(index)"
                >
                  <img :src="image.url" :alt="`Portfolio ${index + 1}`" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      class="p-2 bg-white rounded-full text-error shadow-sm"
                      @click.stop="removePortfolioImage(index)"
                    >
                      <Trash2 size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Experience -->
            <BaseCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-xl font-semibold text-gray-900">Kinh nghiệm làm việc</h3>
                  <BaseButton 
                    variant="outline" 
                    size="sm"
                    icon="Plus"
                    @click="addExperience"
                  >
                    Thêm kinh nghiệm
                  </BaseButton>
                </div>
              </template>
              
              <div v-if="profile.experience.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
                <Briefcase class="text-gray-300 h-16 w-16 mb-4" />
                <h4 class="text-lg font-medium text-gray-900 mb-2">Chưa có kinh nghiệm nào</h4>
                <p class="text-gray-600 max-w-md mb-4">
                  Thêm kinh nghiệm làm việc để giúp khách hàng hiểu rõ hơn về năng lực của bạn.
                </p>
                <BaseButton 
                  variant="primary" 
                  icon="Plus"
                  @click="addExperience"
                >
                  Thêm kinh nghiệm
                </BaseButton>
              </div>
              
              <div v-else class="space-y-6">
                <div 
                  v-for="(exp, index) in profile.experience" 
                  :key="index"
                  class="relative border-l-2 border-gray-200 pl-6 pb-6"
                  :class="{ 'border-primary': index === 0 }"
                >
                  <div class="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-white border-2" :class="index === 0 ? 'border-primary' : 'border-gray-200'"></div>
                  
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900">{{ exp.position }}</h4>
                      <p class="text-primary font-medium">{{ exp.company }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button 
                        class="text-gray-400 hover:text-gray-600"
                        @click="editExperience(index)"
                      >
                        <Edit size="16" />
                      </button>
                      <button 
                        class="text-gray-400 hover:text-error"
                        @click="removeExperience(index)"
                      >
                        <Trash2 size="16" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex items-center text-sm text-gray-500 mt-1 mb-2">
                    <Calendar size="14" class="mr-2" />
                    <span>{{ formatExperienceDate(exp.startDate) }} - {{ exp.endDate ? formatExperienceDate(exp.endDate) : 'Hiện tại' }}</span>
                  </div>
                  
                  <p class="text-gray-600">{{ exp.description }}</p>
                </div>
              </div>
            </BaseCard>
            
            
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
                :src="profile.portfolio[currentImageIndex].url" 
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
                {{ currentImageIndex + 1 }} / {{ profile.portfolio.length }}
              </div>
              
              <button 
                class="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="nextImage"
                :disabled="currentImageIndex === profile.portfolio.length - 1"
              >
                <ChevronRight size="24" />
              </button>
            </div>
            
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
              <div 
                v-for="(image, index) in profile.portfolio" 
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
        
        <!-- Experience Modal -->
        <div v-if="showExperienceModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeExperienceModal"></div>
          <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ editingExperienceIndex === -1 ? 'Thêm kinh nghiệm' : 'Chỉnh sửa kinh nghiệm' }}
              </h2>
              <button class="text-gray-400 hover:text-gray-500" @click="closeExperienceModal">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6">
              <form @submit.prevent="saveExperience" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí <span class="text-error">*</span>
                  </label>
                  <BaseInput 
                    v-model="experienceForm.position" 
                    placeholder="Ví dụ: Chuyên gia trang điểm"
                    :error="experienceErrors.position"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Công ty/Studio <span class="text-error">*</span>
                  </label>
                  <BaseInput 
                    v-model="experienceForm.company" 
                    placeholder="Tên công ty hoặc studio"
                    :error="experienceErrors.company"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="experienceForm.startDate" 
                      type="date"
                      :error="experienceErrors.startDate"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <BaseInput 
                      v-model="experienceForm.endDate" 
                      type="date"
                      :disabled="experienceForm.current"
                    />
                  </div>
                </div>
                
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="current-job" 
                    v-model="experienceForm.current"
                    class="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label for="current-job" class="ml-2 text-sm text-gray-700">
                    Tôi hiện đang làm việc ở đây  class="ml-2 text-sm text-gray-700">
                    Tôi hiện đang làm việc ở đây
                  </label>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả công việc
                  </label>
                  <textarea 
                    v-model="experienceForm.description" 
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                    placeholder="Mô tả ngắn về công việc và trách nhiệm của bạn..."
                  ></textarea>
                </div>
                
                <div class="flex justify-end gap-3 pt-4">
                  <BaseButton 
                    type="button"
                    variant="secondary" 
                    @click="closeExperienceModal"
                  >
                    Hủy
                  </BaseButton>
                  <BaseButton 
                    type="submit"
                    variant="primary" 
                    :loading="isSavingExperience"
                  >
                    Lưu
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { 
    LoaderCircle, Camera, Star, StarHalf, Mail, Phone, MapPin, 
    Facebook, Instagram, Twitter, Youtube, X, Trash2, ImageIcon,
    Briefcase, Calendar, Edit, MessageSquare, ChevronLeft, ChevronRight,
    Share2, User
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  
  // State
  const isLoading = ref(true);
  const profile = ref(null);
  const isEditMode = ref(false);
  const isSaving = ref(false);
  const showGallery = ref(false);
  const currentImageIndex = ref(0);
  const showExperienceModal = ref(false);
  const editingExperienceIndex = ref(-1);
  const isSavingExperience = ref(false);
  
  // Form state
  const editForm = reactive({
    fullName: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: [],
    socialLinks: []
  });
  
  const formErrors = reactive({});
  
  const experienceForm = reactive({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  
  const experienceErrors = reactive({});
  
  // File inputs refs
  const avatarInput = ref(null);
  const portfolioInput = ref(null);
  
  // Mock data fetch
  onMounted(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock profile data
      profile.value = {
        id: 1,
        fullName: 'Nguyễn Thị A',
        role: 'Chuyên gia trang điểm cô dâu',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s',
        email: 'nguyenthi.ail.com',
        phone: '0912345678',
        address: 'Quận 1, TP.HCM',
        bio: 'Tôi là chuyên gia trang điểm với hơn 5 năm kinh nghiệm, chuyên về trang điểm cô dâu và sự kiện.\n\nVới niềm đam mê làm đẹp và sự tỉ mỉ trong từng chi tiết, tôi luôn mang đến cho khách hàng vẻ đẹp tự nhiên nhưng vẫn nổi bật trong ngày trọng đại của họ.\n\nTôi đã từng hợp tác với nhiều studio ảnh cưới lớn tại TP.HCM và nhận được nhiều phản hồi tích cực từ khách hàng.',
        rating: 4.8,
        reviewCount: 56,
        skills: [
          { name: 'Trang điểm cô dâu', level: 5 },
          { name: 'Trang điểm sự kiện', level: 4 },
          { name: 'Tạo kiểu tóc', level: 4 },
          { name: 'Trang điểm nghệ thuật', level: 3 }
        ],
        socialLinks: [
          { platform: 'facebook', username: 'nguyenthi.a', url: 'https://facebook.com/nguyenthi.a' },
          { platform: 'instagram', username: 'nguyenthi.a', url: 'https://instagram.com/nguyenthi.a' },
          { platform: 'tiktok', username: 'nguyenthi.a', url: 'https://tiktok.com/@nguyenthi.a' }
        ],
        portfolio: [
          { url: 'https://file.hstatic.net/200000692621/article/tri-mun-tcham_aad6c0d3c3c740ddb5fb2f5e966139d6.jpg' },
          { url: 'https://file.hstatic.net/200000692621/article/tri-mun-tcham_aad6c0d3c3c740ddb5fb2f5e966139d6.jpg' },
          { url: 'https://file.hstatic.net/200000692621/article/tri-mun-tcham_aad6c0d3c3c740ddb5fb2f5e966139d6.jpg' }
        ],
        experience: [
          {
            position: 'Chuyên gia trang điểm cô dâu',
            company: 'Wedding Studio',
            startDate: '2021-06-01',
            endDate: null,
            current: true,
            description: 'Trang điểm cho cô dâu và phù dâu, tạo kiểu tóc, tư vấn phong cách trang điểm phù hợp với từng khách hàng.'
          },
          {
            position: 'Nghệ sĩ trang điểm',
            company: 'Beauty Center',
            startDate: '2019-03-01',
            endDate: '2021-05-30',
            current: false,
            description: 'Trang điểm cho khách hàng trong các sự kiện, chụp ảnh thời trang, và dạy các khóa học trang điểm cơ bản.'
          }
        ],
        recentReviews: [
          {
            id: 1,
            rating: 5,
            comment: 'Chị trang điểm rất tỉ mỉ và chuyên nghiệp. Mình rất hài lòng với kết quả và nhận được nhiều lời khen trong ngày cưới.',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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
            user: {
              name: 'Phạm Thị C',
              avatar: null
            }
          }
        ]
      };
      
      // Initialize edit form with profile data
      Object.assign(editForm, {
        fullName: profile.value.fullName,
        role: profile.value.role,
        email: profile.value.email,
        phone: profile.value.phone,
        address: profile.value.address,
        bio: profile.value.bio,
        skills: JSON.parse(JSON.stringify(profile.value.skills)),
        socialLinks: JSON.parse(JSON.stringify(profile.value.socialLinks))
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      isLoading.value = false;
    }
  });
  
  // Helper functions
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
  
  const formatExperienceDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return `${month}/${year}`;
  };
  
  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'twitter':
        return Twitter;
      case 'youtube':
        return Youtube;
      case 'tiktok':
        return User; // Using User as a placeholder for TikTok
      default:
        return User;
    }
  };
  
  const getSocialIconClass = (platform) => {
    switch (platform) {
      case 'facebook':
        return 'text-blue-600';
      case 'instagram':
        return 'text-pink-600';
      case 'twitter':
        return 'text-blue-400';
      case 'youtube':
        return 'text-red-600';
      case 'tiktok':
        return 'text-black';
      default:
        return 'text-gray-600';
    }
  };
  
  // Profile actions
  const shareProfile = () => {
    // Implement share functionality
    alert('Chức năng chia sẻ đang được phát triển');
  };
  
  // Form actions
  const validateForm = () => {
    const errors = {};
    
    if (!editForm.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }
    
    if (!editForm.role.trim()) {
      errors.role = 'Vui lòng nhập vai trò';
    }
    
    if (!editForm.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^\S+@\S+\.\S+$/.test(editForm.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!editForm.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    }
    
    if (!editForm.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ';
    }
    
    Object.assign(formErrors, errors);
    return Object.keys(errors).length === 0;
  };
  
  const saveProfile = async () => {
    if (!validateForm()) return;
    
    isSaving.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update profile with form data
      Object.assign(profile.value, {
        fullName: editForm.fullName,
        role: editForm.role,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        bio: editForm.bio,
        skills: JSON.parse(JSON.stringify(editForm.skills)),
        socialLinks: JSON.parse(JSON.stringify(editForm.socialLinks))
      });
      
      // Exit edit mode
      isEditMode.value = false;
      
      // Show success message
      alert('Hồ sơ đã được cập nhật thành công');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isSaving.value = false;
    }
  };
  
  // Skills actions
  const addSkill = () => {
    editForm.skills.push({ name: '', level: 3 });
  };
  
  const removeSkill = (index) => {
    editForm.skills.splice(index, 1);
  };
  
  // Social links actions
  const addSocial = () => {
    editForm.socialLinks.push({ platform: 'facebook', username: '', url: '' });
  };
  
  const removeSocial = (index) => {
    editForm.socialLinks.splice(index, 1);
  };
  
  // Avatar actions
  const openAvatarUpload = () => {
    avatarInput.value.click();
  };
  
  const onAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Portfolio actions
  const openPortfolioUpload = () => {
    portfolioInput.value.click();
  };
  
  const onPortfolioChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        profile.value.portfolio.push({
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removePortfolioImage = (index) => {
    profile.value.portfolio.splice(index, 1);
  };
  
  // Gallery functions
  const openGallery = (index) => {
    currentImageIndex.value = index;
    showGallery.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeGallery = () => {
    showGallery.value = false;
    document.body.style.overflow = '';
  };
  
  const nextImage = () => {
    if (currentImageIndex.value < profile.value.portfolio.length - 1) {
      currentImageIndex.value++;
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  };
  
  // Experience actions
  const addExperience = () => {
    editingExperienceIndex.value = -1;
    Object.assign(experienceForm, {
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    showExperienceModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const editExperience = (index) => {
    editingExperienceIndex.value = index;
    const exp = profile.value.experience[index];
    Object.assign(experienceForm, {
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      description: exp.description
    });
    showExperienceModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const removeExperience = (index) => {
    if (confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này không?')) {
      profile.value.experience.splice(index, 1);
    }
  };
  
  const closeExperienceModal = () => {
    showExperienceModal.value = false;
    document.body.style.overflow = '';
  };
  
  const validateExperience = () => {
    const errors = {};
    
    if (!experienceForm.position.trim()) {
      errors.position = 'Vui lòng nhập vị trí';
    }
    
    if (!experienceForm.company.trim()) {
      errors.company = 'Vui lòng nhập tên công ty';
    }
    
    if (!experienceForm.startDate) {
      errors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }
    
    Object.assign(experienceErrors, errors);
    return Object.keys(errors).length === 0;
  };
  
  const saveExperience = async () => {
    if (!validateExperience()) return;
    
    isSavingExperience.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExperience = {
        position: experienceForm.position,
        company: experienceForm.company,
        startDate: experienceForm.startDate,
        endDate: experienceForm.current ? null : experienceForm.endDate,
        current: experienceForm.current,
        description: experienceForm.description
      };
      
      if (editingExperienceIndex.value === -1) {
        // Add new experience
        profile.value.experience.unshift(newExperience);
      } else {
        // Update existing experience
        profile.value.experience[editingExperienceIndex.value] = newExperience;
      }
      
      // Close modal
      closeExperienceModal();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isSavingExperience.value = false;
    }
  };
  </script>
  