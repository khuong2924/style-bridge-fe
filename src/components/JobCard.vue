<template>
    <BaseCard variant="outlined" hover class="cursor-pointer" @click="$emit('click')">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
            <img 
              :src="job.employer.avatar || '/placeholder-avatar.jpg'" 
              alt="Employer Avatar" 
              class="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">{{ job.employer.name }}</h3>
            <div class="flex items-center text-xs text-gray-500">
              <Clock size="14" class="mr-1" />
              <span>{{ formatDate(job.postedAt) }}</span>
            </div>
          </div>
        </div>
        
        <span 
          :class="[
            'text-xs font-medium px-2 py-1 rounded-full',
            getBadgeClasses(job.makeupType)
          ]"
        >
          {{ getMakeupTypeLabel(job.makeupType) }}
        </span>
      </div>
      
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{{ job.title }}</h2>
        
        <div class="space-y-2">
          <div class="flex items-center text-sm text-gray-600">
            <MapPin size="16" class="mr-2 text-gray-400 flex-shrink-0" />
            <span>{{ job.location }}</span>
          </div>
          
          <div class="flex items-center text-sm text-gray-600">
            <Calendar size="16" class="mr-2 text-gray-400 flex-shrink-0" />
            <span>Hết hạn: {{ formatDate(job.expireDate) }}</span>
          </div>
          
          <div class="flex items-center text-sm text-gray-600">
            <Tag size="16" class="mr-2 text-gray-400 flex-shrink-0" />
            <span>{{ job.hireType === 'package' ? 'Trọn gói' : 'Theo giờ' }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center text-primary font-semibold">
          <DollarSign size="18" class="mr-1" />
          <span>{{ formatPrice(job.price) }}</span>
        </div>
        
        <BaseButton variant="primary" size="sm">
          Xem chi tiết
        </BaseButton>
      </div>
    </BaseCard>
  </template>
  
  <script setup>
  import { Clock, MapPin, Calendar, Tag, DollarSign } from 'lucide-vue-next';
  import BaseCard from '@/components/ui/BaseCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  const props = defineProps({
    job: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['click']);
  
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
  
  const getBadgeClasses = (type) => {
    switch (type) {
      case 'bridal':
        return 'bg-warning/10 text-warning';
      case 'event':
        return 'bg-primary/10 text-primary';
      case 'photoshoot':
        return 'bg-success/10 text-success';
      case 'artistic':
        return 'bg-info/10 text-info';
      default:
        return 'bg-gray-100 text-gray-600';
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
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };
  </script>