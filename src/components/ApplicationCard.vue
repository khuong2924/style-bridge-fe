<template>
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ application.job.title }}</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm text-gray-600">
            <div class="flex items-center">
              <User size="14" class="mr-1.5 text-gray-400" />
              <span>{{ application.job.employer.name }}</span>
            </div>
            
            <div class="flex items-center">
              <MapPin size="14" class="mr-1.5 text-gray-400" />
              <span>{{ application.job.location }}</span>
            </div>
            
            <div class="flex items-center text-primary font-medium">
              <DollarSign size="14" class="mr-1.5" />
              <span>{{ formatPrice(application.job.price) }}</span>
            </div>
          </div>
        </div>
        
        <div class="mb-4 p-4 bg-gray-50 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Lời nhắn của bạn:</h4>
          <p class="text-sm text-gray-600 line-clamp-2">{{ application.message }}</p>
        </div>
        
        <div v-if="application.status === 'accepted'" class="mb-4 p-4 bg-success/5 rounded-md flex items-start">
          <CheckCircle size="18" class="text-success mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm text-gray-700">
              Đơn ứng tuyển của bạn đã được chấp nhận vào {{ formatDate(application.acceptedAt) }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              Vui lòng kiểm tra email hoặc liên hệ với nhà tuyển dụng để biết thêm chi tiết.
            </p>
          </div>
        </div>
        
        <div v-if="application.status === 'rejected'" class="mb-4 p-4 bg-error/5 rounded-md flex items-start">
          <XCircle size="18" class="text-error mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm text-gray-700">
              Đơn ứng tuyển của bạn đã bị từ chối vào {{ formatDate(application.rejectedAt) }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              Đừng nản lòng! Hãy tiếp tục tìm kiếm các cơ hội khác phù hợp với bạn.
            </p>
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <BaseButton 
            variant="outline" 
            size="sm"
            v-if="application.status === 'pending'"
            @click="$emit('withdraw', application)"
          >
            Rút đơn
          </BaseButton>
          
          <BaseButton 
            variant="primary" 
            size="sm"
            @click="$emit('view', application.id)"
          >
            Xem chi tiết
          </BaseButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Clock, User, MapPin, DollarSign, CheckCircle, XCircle, Send } from 'lucide-vue-next';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  const props = defineProps({
    application: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['view', 'withdraw']);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return Send;
      case 'accepted':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Send;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ phản hồi';
      case 'accepted':
        return 'Đã chấp nhận';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };
  
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'accepted':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-error/10 text-error';
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
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };
  </script>
  