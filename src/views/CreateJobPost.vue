<template>
    <MainLayout>
      <div class="container py-8">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Tạo bài đăng tuyển dụng</h1>
            <p class="text-lg text-gray-600">
              Đăng tải thông tin công việc trang điểm của bạn để tìm kiếm nghệ sĩ trang điểm phù hợp
            </p>
          </div>
          
          <form @submit.prevent="submitForm">
            <BaseCard class="mb-6">
              <template #header>
                <h2 class="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
              </template>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <BaseInput
                  v-model="form.title"
                  label="Tiêu đề"
                  placeholder="Ví dụ: Cần tìm nghệ sĩ trang điểm cho sự kiện cưới"
                  required
                  :error="errors.title"
                />
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Loại trang điểm <span class="text-error">*</span>
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <label 
                      v-for="type in makeupTypes" 
                      :key="type.value" 
                      :class="[
                        'flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-colors',
                        form.makeupType === type.value 
                          ? 'border-primary bg-primary-lighter/10 text-primary' 
                          : 'border-gray-200 hover:border-primary-light hover:bg-primary-lighter/5'
                      ]"
                    >
                      <input 
                        type="radio" 
                        :value="type.value" 
                        v-model="form.makeupType" 
                        class="sr-only"
                      />
                      <component :is="type.icon" size="24" />
                      <span class="mt-2 text-sm">{{ type.label }}</span>
                    </label>
                  </div>
                  <p v-if="errors.makeupType" class="mt-1 text-xs text-error">{{ errors.makeupType }}</p>
                </div>
                
                <BaseInput
                  v-model="form.startTime"
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  required
                  :error="errors.startTime"
                />
                
                <BaseInput
                  v-model="form.duration"
                  label="Thời lượng dự kiến (giờ)"
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  :error="errors.duration"
                />
                
                <BaseInput
                  v-model="form.location"
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ làm việc"
                  required
                  :error="errors.location"
                  :icon-left="MapPin"
                />
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Hình thức thuê <span class="text-error">*</span>
                  </label>
                  <div class="flex gap-4">
                    <label 
                      v-for="type in hireTypes" 
                      :key="type.value" 
                      :class="[
                        'flex-1 flex justify-center p-3 border rounded-md cursor-pointer transition-colors',
                        form.hireType === type.value 
                          ? 'border-primary bg-primary-lighter/10 text-primary' 
                          : 'border-gray-200 hover:border-primary-light hover:bg-primary-lighter/5'
                      ]"
                    >
                      <input 
                        type="radio" 
                        :value="type.value" 
                        v-model="form.hireType" 
                        class="sr-only"
                      />
                      <span>{{ type.label }}</span>
                    </label>
                  </div>
                  <p v-if="errors.hireType" class="mt-1 text-xs text-error">{{ errors.hireType }}</p>
                </div>
                
                <BaseInput
                  v-model="form.price"
                  label="Thù lao (VNĐ)"
                  type="number"
                  min="0"
                  step="50000"
                  required
                  :error="errors.price"
                />
                
                <BaseInput
                  v-model="form.quantity"
                  label="Số lượng tuyển"
                  type="number"
                  min="1"
                  step="1"
                  required
                  :error="errors.quantity"
                />
                
                <div class="col-span-1 sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả thêm <span class="text-error">*</span>
                  </label>
                  <textarea 
                    v-model="form.description" 
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                    placeholder="Mô tả chi tiết về công việc, yêu cầu kỹ năng, phong cách trang điểm..."
                    rows="5"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-xs text-error">{{ errors.description }}</p>
                </div>
                
                <BaseInput
                  v-model="form.expireDate"
                  label="Thời hạn bài đăng"
                  type="date"
                  required
                  :error="errors.expireDate"
                />
              </div>
            </BaseCard>
            
            <BaseCard class="mb-6">
              <template #header>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Hình ảnh tham khảo</h2>
                  <p class="text-sm text-gray-500 mt-1">
                    Tải lên hình ảnh tham khảo về phong cách trang điểm bạn mong muốn
                  </p>
                </div>
              </template>
              
              <div>
                <div 
                  class="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors"
                  :class="[
                    isDragging ? 'border-primary bg-primary-lighter/5' : 'border-gray-300 hover:border-primary',
                  ]"
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
                  <Upload size="48" class="text-gray-400 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 mb-1">Kéo thả hoặc nhấp để tải lên</h3>
                  <p class="text-sm text-gray-500 mb-4">Hỗ trợ JPG, PNG hoặc GIF (Tối đa 5MB/ảnh)</p>
                  <BaseButton 
                    variant="outline" 
                    type="button" 
                    @click="$refs.fileInput.click()"
                  >
                    Chọn ảnh
                  </BaseButton>
                </div>
                
                <div v-if="form.images.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div 
                    v-for="(image, index) in form.images" 
                    :key="index"
                    class="relative aspect-square rounded-md overflow-hidden group"
                  >
                    <img :src="image.preview" alt="Preview" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button 
                        type="button" 
                        class="p-1.5 bg-white rounded-full text-error hover:bg-gray-100 transition-colors"
                        @click="removeImage(index)"
                      >
                        <Trash2 size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <div class="flex justify-end gap-4">
              <BaseButton 
                variant="secondary" 
                type="button" 
                @click="$router.push('/dashboard')"
              >
                Hủy
              </BaseButton>
              <BaseButton 
                variant="primary" 
                type="submit" 
                :loading="isSubmitting"
              >
                Đăng tuyển
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { 
    MapPin, Upload, Trash2, Palette, Camera, 
    Users, Gift, Sparkles, Award
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  const makeupTypes = [
    { label: 'Cô dâu', value: 'bridal', icon: Gift },
    { label: 'Sự kiện', value: 'event', icon: Sparkles },
    { label: 'Chụp ảnh', value: 'photoshoot', icon: Camera },
    { label: 'Nghệ thuật', value: 'artistic', icon: Palette },
    { label: 'Khác', value: 'other', icon: Award }
  ];
  
  const hireTypes = [
    { label: 'Trọn gói', value: 'package' },
    { label: 'Theo giờ', value: 'hourly' }
  ];
  
  const form = reactive({
    title: '',
    makeupType: '',
    startTime: '',
    duration: 2,
    location: '',
    hireType: 'package',
    price: 1000000,
    quantity: 1,
    description: '',
    expireDate: '',
    images: []
  });
  
  const errors = reactive({});
  const isSubmitting = ref(false);
  const isDragging = ref(false);
  const fileInput = ref(null);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!form.makeupType) newErrors.makeupType = 'Vui lòng chọn loại trang điểm';
    if (!form.startTime) newErrors.startTime = 'Vui lòng chọn thời gian bắt đầu';
    if (!form.duration) newErrors.duration = 'Vui lòng nhập thời lượng dự kiến';
    if (!form.location.trim()) newErrors.location = 'Vui lòng nhập địa chỉ';
    if (!form.hireType) newErrors.hireType = 'Vui lòng chọn hình thức thuê';
    if (!form.price) newErrors.price = 'Vui lòng nhập thù lao';
    if (!form.quantity) newErrors.quantity = 'Vui lòng nhập số lượng tuyển';
    if (!form.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
    if (!form.expireDate) newErrors.expireDate = 'Vui lòng chọn thời hạn bài đăng';
    
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
  
  const submitForm = async () => {
    if (!validateForm()) return;
    
    isSubmitting.value = true;
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Xử lý thành công
      alert('Đăng tuyển thành công!');
      // Chuyển hướng đến trang quản lý bài đăng
      // router.push('/dashboard/job-posts');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>