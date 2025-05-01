<template>
    <MainLayout>
      <div class="container py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Thống kê</h1>
          <p class="text-lg text-gray-600">
            Theo dõi hiệu suất và doanh thu của bạn
          </p>
        </div>
        
        <!-- Date Range Selector -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div class="p-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center space-x-4">
                <button 
                  v-for="period in timePeriods" 
                  :key="period.value"
                  class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  :class="selectedPeriod === period.value 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  @click="selectedPeriod = period.value"
                >
                  {{ period.label }}
                </button>
              </div>
              
              <div class="flex items-center space-x-2">
                <BaseButton 
                  variant="outline" 
                  size="sm"
                  icon="ChevronLeft"
                  @click="navigatePeriod(-1)"
                />
                <span class="text-lg font-medium">{{ currentPeriodLabel }}</span>
                <BaseButton 
                  variant="outline" 
                  size="sm"
                  icon="ChevronRight"
                  @click="navigatePeriod(1)"
                  :disabled="isCurrentPeriod"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div 
            v-for="(card, index) in summaryCards" 
            :key="index"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-6"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ card.label }}</p>
                <h3 class="text-2xl font-bold text-gray-900">{{ card.value }}</h3>
              </div>
              <div 
                class="p-3 rounded-full"
                :class="card.iconBg"
              >
                <component :is="card.icon" size="20" :class="card.iconColor" />
              </div>
            </div>
            
            <div class="flex items-center mt-4">
              <div 
                class="flex items-center text-sm"
                :class="card.trend > 0 ? 'text-success' : card.trend < 0 ? 'text-error' : 'text-gray-500'"
              >
                <component 
                  :is="card.trend > 0 ? TrendingUp : card.trend < 0 ? TrendingDown : Minus" 
                  size="16" 
                  class="mr-1"
                />
                <span>{{ Math.abs(card.trend) }}% {{ card.trend > 0 ? 'tăng' : card.trend < 0 ? 'giảm' : 'không đổi' }}</span>
              </div>
              <span class="text-xs text-gray-500 ml-2">so với kỳ trước</span>
            </div>
          </div>
        </div>
        
        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Revenue Chart -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Doanh thu</h2>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-primary mr-1"></div>
                    <span class="text-xs text-gray-500">Kỳ này</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                    <span class="text-xs text-gray-500">Kỳ trước</span>
                  </div>
                </div>
              </div>
              
              <div class="h-64">
                <!-- Chart would be rendered here -->
                <div class="w-full h-full flex items-center justify-center text-gray-500">
                  <BarChart2 size="48" class="text-gray-300 mr-2" />
                  <span>Biểu đồ doanh thu sẽ được hiển thị ở đây</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Jobs Chart -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Công việc</h2>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-success mr-1"></div>
                    <span class="text-xs text-gray-500">Hoàn thành</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-warning mr-1"></div>
                    <span class="text-xs text-gray-500">Đang thực hiện</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-error mr-1"></div>
                    <span class="text-xs text-gray-500">Đã hủy</span>
                  </div>
                </div>
              </div>
              
              <div class="h-64">
                <!-- Chart would be rendered here -->
                <div class="w-full h-full flex items-center justify-center text-gray-500">
                  <PieChart size="48" class="text-gray-300 mr-2" />
                  <span>Biểu đồ công việc sẽ được hiển thị ở đây</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Transactions -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Giao dịch gần đây</h2>
              <BaseButton 
                variant="ghost" 
                size="sm"
                @click="$router.push('/transactions')"
              >
                Xem tất cả
              </BaseButton>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giao dịch</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th class="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr 
                    v-for="transaction in recentTransactions" 
                    :key="transaction.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="py-4 px-4 text-sm text-gray-900">{{ transaction.id }}</td>
                    <td class="py-4 px-4 text-sm text-gray-500">{{ formatDate(transaction.date) }}</td>
                    <td class="py-4 px-4 text-sm text-gray-900">{{ transaction.customer }}</td>
                    <td class="py-4 px-4 text-sm text-gray-500">{{ transaction.service }}</td>
                    <td class="py-4 px-4">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClasses(transaction.status)"
                      >
                        {{ getStatusText(transaction.status) }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-sm text-right font-medium" :class="transaction.amount > 0 ? 'text-success' : 'text-error'">
                      {{ formatPrice(transaction.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Popular Services -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Dịch vụ phổ biến</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="(service, index) in popularServices" 
                :key="index"
                class="flex items-center p-4 border border-gray-200 rounded-lg"
              >
                <div class="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden mr-4">
                  <img 
                    :src="service.image" 
                    :alt="service.name" 
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex-grow">
                  <h3 class="font-medium text-gray-900 mb-1">{{ service.name }}</h3>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center text-warning">
                      <Star v-for="i in Math.floor(service.rating)" :key="`star-${i}`" size="14" fill="currentColor" />
                      <StarHalf v-if="service.rating % 1 >= 0.5" size="14" fill="currentColor" />
                      <Star v-for="i in 5 - Math.ceil(service.rating)" :key="`empty-star-${i}`" size="14" class="text-gray-300" />
                      <span class="ml-1 text-xs text-gray-500">{{ service.rating.toFixed(1) }}</span>
                    </div>
                    <span class="text-sm font-medium text-primary">{{ formatPrice(service.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { 
    ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus,
    DollarSign, Users, Calendar, Star, StarHalf, BarChart2, PieChart,
    Briefcase
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  // Time periods
  const timePeriods = [
    { label: '7 ngày', value: 'week' },
    { label: '30 ngày', value: 'month' },
    { label: '3 tháng', value: 'quarter' },
    { label: '1 năm', value: 'year' }
  ];
  
  // State
  const selectedPeriod = ref('month');
  const currentPeriodOffset = ref(0);
  const recentTransactions = ref([]);
  const popularServices = ref([]);
  
  // Computed
  const currentPeriodLabel = computed(() => {
    const now = new Date();
    
    switch (selectedPeriod.value) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + (currentPeriodOffset.value * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`;
      
      case 'month':
        const monthDate = new Date(now);
        monthDate.setMonth(now.getMonth() + currentPeriodOffset.value);
        return `Tháng ${monthDate.getMonth() + 1}/${monthDate.getFullYear()}`;
      
      case 'quarter':
        const quarterDate = new Date(now);
        quarterDate.setMonth(now.getMonth() + (currentPeriodOffset.value * 3));
        const quarter = Math.floor(quarterDate.getMonth() / 3) + 1;
        return `Quý ${quarter}/${quarterDate.getFullYear()}`;
      
      case 'year':
        const yearDate = new Date(now);
        yearDate.setFullYear(now.getFullYear() + currentPeriodOffset.value);
        return `Năm ${yearDate.getFullYear()}`;
      
      default:
        return '';
    }
  });
  
  const isCurrentPeriod = computed(() => {
    return currentPeriodOffset.value === 0;
  });
  
  const summaryCards = computed(() => {
    return [
      {
        label: 'Tổng doanh thu',
        value: formatPrice(8500000),
        icon: DollarSign,
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        trend: 12
      },
      {
        label: 'Công việc hoàn thành',
        value: '24',
        icon: Briefcase,
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
        trend: 5
      },
      {
        label: 'Khách hàng mới',
        value: '18',
        icon: Users,
        iconBg: 'bg-info/10',
        iconColor: 'text-info',
        trend: -3
      },
      {
        label: 'Lịch hẹn',
        value: '32',
        icon: Calendar,
        iconBg: 'bg-warning/10',
        iconColor: 'text-warning',
        trend: 8
      }
    ];
  });
  
  // Methods
  const formatShortDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };
  
  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const navigatePeriod = (direction) => {
    currentPeriodOffset.value += direction;
  };
  
  // Fetch data (mock)
  onMounted(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock transactions data
      recentTransactions.value = [
        {
          id: 'TRX-001',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          customer: 'Ngọc Anh',
          service: 'Trang điểm cô dâu',
          status: 'completed',
          amount: 2500000
        },
        {
          id: 'TRX-002',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          customer: 'Minh Tâm',
          service: 'Trang điểm dự tiệc',
          status: 'completed',
          amount: 1800000
        },
        {
          id: 'TRX-003',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          customer: 'Công ty XYZ',
          service: 'Trang điểm sự kiện',
          status: 'pending',
          amount: 3500000
        },
        {
          id: 'TRX-004',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          customer: 'Hoàng Thị E',
          service: 'Trang điểm dự tiệc cưới',
          status: 'cancelled',
          amount: -500000 // Hoàn tiền
        },
        {
          id: 'TRX-005',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          customer: 'Lê Thị B',
          service: 'Trang điểm kỷ yếu',
          status: 'completed',
          amount: 1200000
        }
      ];
      
      // Mock popular services
      popularServices.value = [
        {
          name: 'Trang điểm cô dâu',
          rating: 4.8,
          price: 2500000,
          image: 'https://images.unsplash.com/photo-1560577953-53a1a4e2bc1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJpZGFsJTIwbWFrZXVwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
        },
        {
          name: 'Trang điểm dự tiệc',
          rating: 4.6,
          price: 1800000,
          image: 'https://images.unsplash.com/photo-1595994195565-d5670ad4e74b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
        },
        {
          name: 'Trang điểm kỷ yếu',
          rating: 4.5,
          price: 1200000,
          image: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
        },
        {
          name: 'Trang điểm sự kiện',
          rating: 4.7,
          price: 2000000,
          image: 'https://images.unsplash.com/photo-1581309553233-52c066fec8c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJyaWRhbCUyMG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
        }
      ];
    } catch (error) {
      console.error('Error fetching statistics data:', error);
    }
  });
  </script>
  