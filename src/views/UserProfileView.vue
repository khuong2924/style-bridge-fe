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
                    :src="userProfile.avatarUrl || '/placeholder-avatar.jpg'" 
                    alt="Profile Avatar" 
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ userProfile.fullName }}</h2>
              <p class="text-gray-500 mb-4">{{ userProfile.username }}</p>
              
              <div v-if="userProfile.rating" class="flex items-center justify-center mb-4">
                <div class="flex items-center text-warning">
                  <Star v-for="i in Math.floor(userProfile.rating)" :key="`star-${i}`" size="16" fill="currentColor" />
                  <StarHalf v-if="userProfile.rating % 1 >= 0.5" size="16" fill="currentColor" />
                  <Star v-for="i in 5 - Math.ceil(userProfile.rating)" :key="`empty-star-${i}`" size="16" class="text-gray-300" />
                </div>
                <span class="ml-2 text-sm text-gray-600">{{ userProfile.rating.toFixed(1) }} ({{ userProfile.reviewCount || 0 }} đánh giá)</span>
              </div>
              
              <div class="w-full flex space-x-2">
                <BaseButton 
                  variant="primary" 
                  block
                  @click="contactUser"
                >
                  Liên hệ
                </BaseButton>
                
                <BaseButton 
                  variant="outline" 
                  icon="Share2"
                  @click="shareProfile"
                >
                  Chia sẻ
                </BaseButton>
              </div>
              
              <div class="w-full mt-2">
                <BaseButton 
                  variant="success" 
                  block
                  @click="hireUser"
                  class="bg-success hover:bg-success/90 text-white"
                >
                  <Briefcase size="16" class="mr-2" />
                  Thuê dịch vụ
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
                  <a :href="`mailto:${userProfile.email}`" class="font-medium hover:underline">{{ userProfile.email }}</a>
                </div>
              </div>
              
              <div v-if="userProfile.phone" class="flex items-start">
                <Phone size="18" class="text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p class="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <a :href="`tel:${userProfile.phone}`" class="font-medium hover:underline">{{ userProfile.phone }}</a>
                </div>
              </div>
              
              <div v-if="userProfile.address" class="flex items-start">
                <MapPin size="18" class="text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p class="text-sm text-gray-500 mb-1">Địa chỉ</p>
                  <p class="font-medium">{{ userProfile.address }}</p>
                </div>
              </div>
            </div>
          </BaseCard>
          
          <!-- Skills (if available) -->
          <BaseCard v-if="userProfile.skills && userProfile.skills.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Kỹ năng</h3>
            </template>
            
            <div class="space-y-4">
              <div v-for="(skill, index) in userProfile.skills" :key="index" class="space-y-2">
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
          
          <!-- Social Links (if available) -->
          <BaseCard v-if="userProfile.socialLinks && userProfile.socialLinks.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Liên kết mạng xã hội</h3>
            </template>
            
            <div class="space-y-3">
              <a 
                v-for="(social, index) in userProfile.socialLinks" 
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
          <!-- Bio -->
          <BaseCard v-if="userProfile.bio">
            <template #header>
              <h3 class="text-xl font-semibold text-gray-900">Giới thiệu</h3>
            </template>
            
            <div class="prose max-w-none">
              <p v-for="(paragraph, index) in userProfile.bio.split('\n')" :key="index" class="mb-4">
                {{ paragraph }}
              </p>
            </div>
          </BaseCard>
          
          <!-- Portfolio (if available) -->
          <BaseCard v-if="userProfile.portfolio && userProfile.portfolio.length > 0">
            <template #header>
              <h3 class="text-xl font-semibold text-gray-900">Bộ sưu tập</h3>
            </template>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div 
                v-for="(image, index) in userProfile.portfolio" 
                :key="index"
                class="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                @click="openGallery(index)"
              >
                <img :src="image.url" :alt="`Portfolio ${index + 1}`" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </BaseCard>
          
          <!-- Experience (if available) -->
          <BaseCard v-if="userProfile.experience && userProfile.experience.length > 0">
            <template #header>
              <h3 class="text-xl font-semibold text-gray-900">Kinh nghiệm làm việc</h3>
            </template>
            
            <div class="space-y-6">
              <div 
                v-for="(exp, index) in userProfile.experience" 
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
        <div class="relative z-10 w-full max-w-4xl px-4">
          <button 
            class="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 z-20"
            @click="closeGallery"
          >
            <X size="24" />
          </button>
          
          <div class="flex items-center justify-center h-[70vh]">
            <img 
              :src="galleryImages[currentImageIndex]?.url" 
              alt="Gallery Image" 
              class="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div class="flex items-center justify-center space-x-4 mt-4">
            <button 
              class="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentImageIndex === 0"
              @click="prevImage"
            >
              <ChevronLeft size="24" />
            </button>
            
            <div class="text-white text-sm">
              {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
            </div>
            
            <button 
              class="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentImageIndex === galleryImages.length - 1"
              @click="nextImage"
            >
              <ChevronRight size="24" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Contact Modal -->
      <div v-if="showContactModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeContactModal"></div>
        <div class="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md transform motion-scale-in-[0.95] motion-duration-[0.53s]/scale motion-ease-spring-bouncy">
          <div class="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Liên hệ với {{ userProfile.fullName }}</h2>
            <button class="text-gray-400 hover:text-gray-500 hover:rotate-90 transition-transform duration-300" @click="closeContactModal">
              <X size="20" />
            </button>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="submitContactForm" class="space-y-4">
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  id="subject"
                  v-model="contactForm.subject"
                  type="text"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  placeholder="Nhập tiêu đề"
                  required
                />
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                <textarea
                  id="message"
                  v-model="contactForm.message"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  placeholder="Nhập nội dung tin nhắn..."
                  required
                ></textarea>
              </div>
              
              <div class="pt-2 flex justify-end gap-3">
                <BaseButton 
                  type="button"
                  variant="secondary" 
                  @click="closeContactModal"
                >
                  Hủy
                </BaseButton>
                <BaseButton 
                  type="submit"
                  variant="primary" 
                  :loading="isSendingMessage"
                >
                  Gửi tin nhắn
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Hire Modal -->
      <div v-if="showHireModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeHireModal"></div>
        <div class="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md transform motion-scale-in-[0.95] motion-duration-[0.53s]/scale motion-ease-spring-bouncy">
          <div class="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Thuê dịch vụ</h2>
            <button class="text-gray-400 hover:text-gray-500 hover:rotate-90 transition-transform duration-300" @click="closeHireModal">
              <X size="20" />
            </button>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="submitHireRequest" class="space-y-4">
              <div>
                <label for="service" class="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</label>
                <select
                  id="service"
                  v-model="hireForm.service"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  required
                >
                  <option value="Trang điểm cô dâu">Trang điểm cô dâu</option>
                  <option value="Trang điểm sự kiện">Trang điểm sự kiện</option>
                  <option value="Trang điểm chụp ảnh">Trang điểm chụp ảnh</option>
                  <option value="Trang điểm dạ hội">Trang điểm dạ hội</option>
                  <option value="Trang điểm nghệ thuật">Trang điểm nghệ thuật</option>
                  <option value="Làm tóc">Làm tóc</option>
                  <option value="Gói combo">Gói combo trang điểm và làm tóc</option>
                </select>
              </div>
              
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                <input
                  id="date"
                  v-model="hireForm.date"
                  type="date"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  required
                />
              </div>
              
              <div>
                <label for="time" class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                <input
                  id="time"
                  v-model="hireForm.time"
                  type="time"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  required
                />
              </div>
              
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                <input
                  id="location"
                  v-model="hireForm.location"
                  type="text"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  placeholder="Nhập địa điểm"
                  required
                />
              </div>
              
              <div>
                <label for="details" class="block text-sm font-medium text-gray-700 mb-1">Chi tiết</label>
                <textarea
                  id="details"
                  v-model="hireForm.details"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  placeholder="Nhập chi tiết"
                  required
                ></textarea>
              </div>
              
              <div class="pt-2 flex justify-end gap-3">
                <BaseButton 
                  type="button"
                  variant="secondary" 
                  @click="closeHireModal"
                >
                  Hủy
                </BaseButton>
                <BaseButton 
                  type="submit"
                  variant="primary" 
                  :loading="isSubmittingHireRequest"
                >
                  Gửi yêu cầu
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { 
  LoaderCircle, Star, StarHalf, Mail, Phone, MapPin, 
  Calendar, ChevronLeft, ChevronRight, X,
  Facebook, Instagram, Twitter, Youtube, User, Briefcase
} from 'lucide-vue-next';
import MainLayout from '@/layouts/MainLayout.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State
const isLoading = ref(true);
const userProfile = ref({});
const showGallery = ref(false);
const currentImageIndex = ref(0);
const galleryImages = ref([]);
const showContactModal = ref(false);
const showHireModal = ref(false);
const isSendingMessage = ref(false);
const isSubmittingHireRequest = ref(false);
const currentWeekStart = ref(getStartOfWeek(new Date()));
const weekDays = ref([]);

// Forms
const contactForm = ref({
  subject: '',
  message: ''
});

const hireForm = ref({
  service: 'Trang điểm cô dâu',
  date: '',
  time: '10:00',
  location: '',
  details: ''
});

// Fetch user profile
const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    const userId = route.params.userId;
    const response = await axios.get(`http://localhost:8081/auth/users/${userId}`);
    
    // Map API response to our profile structure
    const userData = response.data;
    
    // Combine API data with mock additional data
    userProfile.value = {
      id: userData.id,
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      gender: userData.gender,
      avatarUrl: userData.avatarUrl,
      bio: "Tôi là chuyên gia trang điểm với hơn 5 năm kinh nghiệm, chuyên về trang điểm cô dâu và sự kiện.\n\nVới niềm đam mê làm đẹp và sự tỉ mỉ trong từng chi tiết, tôi luôn mang đến cho khách hàng vẻ đẹp tự nhiên nhưng vẫn nổi bật trong ngày trọng đại của họ.\n\nTôi đã từng hợp tác với nhiều studio ảnh cưới lớn và nhận được nhiều phản hồi tích cực từ khách hàng.",
      rating: 4.8,
      reviewCount: 56,
      
      // Mock skills data
      skills: [
        { name: 'Trang điểm cô dâu', level: 5 },
        { name: 'Trang điểm sự kiện', level: 4 },
        { name: 'Tạo kiểu tóc', level: 4 },
        { name: 'Trang điểm nghệ thuật', level: 3 }
      ],
      
      // Mock social links
      socialLinks: [
        { platform: 'facebook', username: userData.username, url: `https://facebook.com/${userData.username}` },
        { platform: 'instagram', username: userData.username, url: `https://instagram.com/${userData.username}` },
        { platform: 'tiktok', username: userData.username, url: `https://tiktok.com/@${userData.username}` }
      ],
      
      // Mock portfolio images
      portfolio: [
        { url: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?q=80&w=3270&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=3280&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=3271&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=3270&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=3270&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=3270&auto=format&fit=crop' }
      ],
      
      // Mock experience data
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
      
      // Mock reviews
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
    
    // Customize the bio based on gender
    if (userData.gender === 'Male') {
      userProfile.value.bio = userProfile.value.bio.replace('Tôi là chuyên gia', 'Tôi là chuyên gia nam');
    } else if (userData.gender === 'Female') {
      userProfile.value.bio = userProfile.value.bio.replace('Tôi là chuyên gia', 'Tôi là chuyên gia nữ');
    }
    
    // Update document title with user's name
    document.title = `${userProfile.value.fullName} | Hồ sơ StyleBridge`;
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Redirect to 404 page if user not found
    if (error.response && error.response.status === 404) {
      router.push('/not-found');
    }
  } finally {
    isLoading.value = false;
  }
};

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

// Actions
const openGallery = (index) => {
  currentImageIndex.value = index;
  galleryImages.value = userProfile.value.portfolio;
  showGallery.value = true;
};

const closeGallery = () => {
  showGallery.value = false;
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

const showAllReviews = () => {
  // Redirect to reviews page with user ID filter
  router.push(`/reviews?userId=${userProfile.value.id}`);
};

const shareProfile = () => {
  // Implementation for sharing the profile
  alert('Chức năng chia sẻ đang được phát triển');
};

const contactUser = () => {
  if (!authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }
  
  // Reset form and show modal
  contactForm.value = {
    subject: '',
    message: ''
  };
  showContactModal.value = true;
};

const closeContactModal = () => {
  showContactModal.value = false;
};

const submitContactForm = async () => {
  if (!contactForm.value.subject.trim() || !contactForm.value.message.trim()) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }
  
  isSendingMessage.value = true;
  try {
    // Here you would implement the actual message sending logic
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Tin nhắn đã được gửi thành công!');
    closeContactModal();
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
  } finally {
    isSendingMessage.value = false;
  }
};

const hireUser = () => {
  if (!authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }
  
  // Reset form and show modal
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  hireForm.value = {
    service: 'Trang điểm cô dâu',
    date: formattedDate,
    time: '10:00',
    location: '',
    details: ''
  };
  showHireModal.value = true;
};

const closeHireModal = () => {
  showHireModal.value = false;
};

const submitHireRequest = async () => {
  if (!hireForm.value.service || !hireForm.value.date || !hireForm.value.time || !hireForm.value.location) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }
  
  isSubmittingHireRequest.value = true;
  try {
    // Here you would implement the actual booking API call
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Yêu cầu thuê dịch vụ đã được gửi thành công!');
    closeHireModal();
  } catch (error) {
    console.error('Error submitting hire request:', error);
    alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
  } finally {
    isSubmittingHireRequest.value = false;
  }
};

// Helper functions
function getStartOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDateRange(start, end) {
  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('vi-VN', options)} - ${end.toLocaleDateString('vi-VN', options)}`;
}

// Calendar functions
function generateWeekDays() {
  const days = [];
  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart.value);
    date.setDate(date.getDate() + i);
    
    // Generate random available slots
    const slots = [];
    const timeSlots = ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    timeSlots.forEach(time => {
      slots.push({
        time,
        available: Math.random() > 0.3 // 70% chance of availability
      });
    });
    
    days.push({
      date: date.getDate(),
      dayName: dayNames[i],
      fullDate: new Date(date),
      slots
    });
  }
  
  weekDays.value = days;
}

function prevWeek() {
  const newStart = new Date(currentWeekStart.value);
  newStart.setDate(newStart.getDate() - 7);
  currentWeekStart.value = newStart;
  generateWeekDays();
}

function nextWeek() {
  const newStart = new Date(currentWeekStart.value);
  newStart.setDate(newStart.getDate() + 7);
  currentWeekStart.value = newStart;
  generateWeekDays();
}

function selectTimeSlot(day, time) {
  // Prefill the hire form with the selected date and time
  const selectedDate = day.fullDate;
  hireForm.value.date = selectedDate.toISOString().split('T')[0];
  hireForm.value.time = time;
  
  // Open the hire modal
  hireUser();
}

// Fetch data on mount
onMounted(() => {
  fetchUserProfile();
  generateWeekDays();
});
</script> 