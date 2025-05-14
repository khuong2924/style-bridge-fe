<template>
    <MainLayout>
      <div class="container py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch hẹn</h1>
          <p class="text-lg text-gray-600">
            Theo dõi và quản lý các lịch hẹn của bạn
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
            @click="changeTab(tab.value)"
          >
            <component :is="tab.icon" class="mr-2" size="18" />
            <span>{{ tab.label }}</span>
            <span class="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {{ getAppointmentCount(tab.value) }}
            </span>
          </button>
        </div>
        
        <!-- Calendar View -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Lịch của tôi</h2>
            <div class="flex items-center space-x-2">
              <BaseButton 
                variant="outline" 
                size="sm"
                icon="ChevronLeft"
                @click="prevMonth"
              />
              <span class="text-lg font-medium">{{ currentMonthName }} {{ currentYear }}</span>
              <BaseButton 
                variant="outline" 
                size="sm"
                icon="ChevronRight"
                @click="nextMonth"
              />
            </div>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <!-- Calendar Header -->
            <div class="grid grid-cols-7 border-b border-gray-200">
              <div 
                v-for="day in weekDays" 
                :key="day"
                class="py-2 text-center text-sm font-medium text-gray-700"
              >
                {{ day }}
              </div>
            </div>
            
            <!-- Calendar Body -->
            <div class="grid grid-cols-7">
              <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                class="min-h-[100px] border-b border-r border-gray-200 last:border-r-0 p-1 relative"
                :class="[
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  day.isToday ? 'bg-primary/5' : '',
                  index % 7 === 6 ? 'border-r-0' : '',
                  Math.floor(index / 7) === Math.floor(calendarDays.length / 7) - 1 ? 'border-b-0' : ''
                ]"
              >
                <div class="flex justify-between items-start">
                  <span 
                    class="inline-flex items-center justify-center w-6 h-6 text-sm rounded-full"
                    :class="[
                      day.isToday ? 'bg-primary text-white font-medium' : 'text-gray-700',
                      !day.isCurrentMonth ? 'text-gray-400' : ''
                    ]"
                  >
                    {{ day.date.getDate() }}
                  </span>
                  
                  <button 
                    v-if="day.isCurrentMonth"
                    class="text-gray-400 hover:text-primary p-1"
                    @click="createAppointment(day.date)"
                  >
                    <Plus size="14" />
                  </button>
                </div>
                
                <div class="mt-1 space-y-1">
                  <div 
                    v-for="appointment in getAppointmentsForDay(day.date)" 
                    :key="appointment.id"
                    class="text-xs p-1 rounded truncate cursor-pointer"
                    :class="getAppointmentClasses(appointment)"
                    @click="viewAppointment(appointment)"
                  >
                    {{ formatTime(appointment.startTime) }} - {{ appointment.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
          <LoaderCircle class="animate-spin text-primary h-12 w-12 mb-4" />
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredAppointments.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Calendar class="text-gray-300 h-16 w-16 mb-4" />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Không có lịch hẹn</h2>
          <p class="text-gray-600 max-w-md mb-6">
            {{ getEmptyMessage() }}
          </p>
          <BaseButton 
            variant="primary" 
            @click="createAppointment(new Date())"
          >
            Tạo lịch hẹn mới
          </BaseButton>
        </div>
        
        <!-- Appointments List -->
        <div v-else class="space-y-4">
          <div 
            v-for="appointment in filteredAppointments" 
            :key="appointment.id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClasses(appointment.status)"
                >
                  <component :is="getStatusIcon(appointment.status)" size="14" class="mr-1.5" />
                  <span>{{ getStatusText(appointment.status) }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button 
                    class="text-gray-400 hover:text-gray-600 p-1"
                    @click="editAppointment(appointment)"
                  >
                    <Edit size="16" />
                  </button>
                  <button 
                    class="text-gray-400 hover:text-error p-1"
                    @click="confirmDeleteAppointment(appointment)"
                  >
                    <Trash2 size="16" />
                  </button>
                </div>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ appointment.title }}</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                <div class="flex items-center">
                  <Calendar size="14" class="mr-1.5 text-gray-400" />
                  <span>{{ formatDate(appointment.startTime) }}</span>
                </div>
                
                <div class="flex items-center">
                  <Clock size="14" class="mr-1.5 text-gray-400" />
                  <span>{{ formatTime(appointment.startTime) }} - {{ formatTime(appointment.endTime) }}</span>
                </div>
                
                <div class="flex items-center">
                  <MapPin size="14" class="mr-1.5 text-gray-400" />
                  <span>{{ appointment.location }}</span>
                </div>
                
                <div class="flex items-center">
                  <User size="14" class="mr-1.5 text-gray-400" />
                  <span>{{ appointment.client.name }}</span>
                </div>
              </div>
              
              <div v-if="appointment.notes" class="mb-4 p-4 bg-gray-50 rounded-md">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Ghi chú:</h4>
                <p class="text-sm text-gray-600">{{ appointment.notes }}</p>
              </div>
              
              <div class="flex justify-end gap-3">
                <BaseButton 
                  variant="outline" 
                  size="sm"
                  v-if="appointment.status === 'pending'"
                  @click="updateAppointmentStatus(appointment.id, 'cancelled')"
                >
                  Hủy lịch hẹn
                </BaseButton>
                
                <BaseButton 
                  variant="outline" 
                  size="sm"
                  v-if="appointment.status === 'pending'"
                  @click="updateAppointmentStatus(appointment.id, 'confirmed')"
                >
                  Xác nhận
                </BaseButton>
                
                <BaseButton 
                  variant="primary" 
                  size="sm"
                  @click="viewAppointment(appointment)"
                >
                  Xem chi tiết
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Appointment Modal -->
        <div v-if="showAppointmentModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeAppointmentModal"></div>
          <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ isEditingAppointment ? 'Chỉnh sửa lịch hẹn' : 'Tạo lịch hẹn mới' }}
              </h2>
              <button class="text-gray-400 hover:text-gray-500" @click="closeAppointmentModal">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6">
              <form @submit.prevent="saveAppointment" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span class="text-error">*</span>
                  </label>
                  <BaseInput 
                    v-model="appointmentForm.title" 
                    placeholder="Nhập tiêu đề lịch hẹn"
                    :error="appointmentErrors.title"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Ngày <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="appointmentForm.date" 
                      type="date"
                      :error="appointmentErrors.date"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select 
                      v-model="appointmentForm.status"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                    >
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Giờ bắt đầu <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="appointmentForm.startTime" 
                      type="time"
                      :error="appointmentErrors.startTime"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Giờ kết thúc <span class="text-error">*</span>
                    </label>
                    <BaseInput 
                      v-model="appointmentForm.endTime" 
                      type="time"
                      :error="appointmentErrors.endTime"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm <span class="text-error">*</span>
                  </label>
                  <BaseInput 
                    v-model="appointmentForm.location" 
                    placeholder="Nhập địa điểm"
                    :error="appointmentErrors.location"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Khách hàng <span class="text-error">*</span>
                  </label>
                  <BaseInput 
                    v-model="appointmentForm.clientName" 
                    placeholder="Tên khách hàng"
                    :error="appointmentErrors.clientName"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea 
                    v-model="appointmentForm.notes" 
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                    placeholder="Thêm ghi chú về lịch hẹn..."
                  ></textarea>
                </div>
                
                <div class="flex justify-end gap-3 pt-4">
                  <BaseButton 
                    type="button"
                    variant="secondary" 
                    @click="closeAppointmentModal"
                  >
                    Hủy
                  </BaseButton>
                  <BaseButton 
                    type="submit"
                    variant="primary" 
                    :loading="isSavingAppointment"
                  >
                    Lưu
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeDeleteModal"></div>
          <div class="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Xác nhận xóa</h2>
              <button class="text-gray-400 hover:text-gray-500" @click="closeDeleteModal">
                <X size="20" />
              </button>
            </div>
            
            <div class="p-6">
              <div class="flex flex-col items-center text-center mb-6">
                <AlertTriangle class="text-warning h-12 w-12 mb-4" />
                <p class="text-gray-700 mb-4">
                  Bạn có chắc chắn muốn xóa lịch hẹn này không? Hành động này không thể hoàn tác.
                </p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="font-medium text-gray-900 mb-2">{{ selectedAppointment?.title }}</h3>
                <div class="space-y-1 text-sm text-gray-600">
                  <div class="flex items-center">
                    <Calendar size="14" class="mr-2" />
                    <span>{{ selectedAppointment ? formatDate(selectedAppointment.startTime) : '' }}</span>
                  </div>
                  <div class="flex items-center">
                    <Clock size="14" class="mr-2" />
                    <span>
                      {{ selectedAppointment ? formatTime(selectedAppointment.startTime) : '' }} - 
                      {{ selectedAppointment ? formatTime(selectedAppointment.endTime) : '' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end gap-3">
                <BaseButton 
                  variant="secondary" 
                  @click="closeDeleteModal"
                >
                  Hủy
                </BaseButton>
                <BaseButton 
                  variant="danger" 
                  :loading="isDeleting"
                  @click="deleteAppointment"
                >
                  Xóa
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { 
    LoaderCircle, Calendar, Clock, MapPin, User, Edit, Trash2,
    X, AlertTriangle, Plus, Check, XIcon, CheckCircle, AlertCircle,
    ChevronLeft, ChevronRight
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  
  // Tabs
  const tabs = [
    { label: 'Tất cả', value: 'all', icon: Calendar },
    { label: 'Đã hoàn thành', value: 'completed', icon: CheckCircle },
    { label: 'Đã hủy', value: 'cancelled', icon: XIcon }
  ];
  
  // State
  const isLoading = ref(true);
  const appointments = ref([]);
  const activeTab = ref('all');
  const showAppointmentModal = ref(false);
  const showDeleteModal = ref(false);
  const isEditingAppointment = ref(false);
  const selectedAppointment = ref(null);
  const isSavingAppointment = ref(false);
  const isDeleting = ref(false);
  
  // Calendar state
  const currentDate = ref(new Date());
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  // Form state
  const appointmentForm = reactive({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    clientName: '',
    status: 'pending',
    notes: ''
  });
  
  const appointmentErrors = reactive({});
  
  // Computed
  const filteredAppointments = computed(() => {
    if (activeTab.value === 'all') {
      return appointments.value;
    }
    return appointments.value.filter(app => app.status === activeTab.value);
  });
  
  const currentYear = computed(() => {
    return currentDate.value.getFullYear();
  });
  
  const currentMonthName = computed(() => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[currentDate.value.getMonth()];
  });
  
  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: 
          date.getDate() === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear()
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  });
  
  // Methods
  const changeTab = (tabValue) => {
    activeTab.value = tabValue;
    
    // Only scroll when selecting "completed" or "cancelled" tabs
    if (tabValue === 'completed' || tabValue === 'cancelled') {
      // Wait for DOM update
      setTimeout(() => {
        window.scrollTo({
          top: document.querySelector('.space-y-4')?.offsetTop || 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };
  
  const getAppointmentCount = (status) => {
    if (status === 'all') {
      return appointments.value.length;
    }
    return appointments.value.filter(app => app.status === status).length;
  };
  
  const getEmptyMessage = () => {
    switch (activeTab.value) {
      case 'all':
        return 'Bạn chưa có lịch hẹn nào. Tạo lịch hẹn mới để quản lý công việc của bạn!';
      case 'pending':
        return 'Bạn không có lịch hẹn nào đang chờ xác nhận.';
      case 'confirmed':
        return 'Bạn không có lịch hẹn nào đã được xác nhận.';
      case 'completed':
        return 'Bạn chưa có lịch hẹn nào đã hoàn thành.';
      case 'cancelled':
        return 'Bạn không có lịch hẹn nào đã hủy.';
      default:
        return 'Không có lịch hẹn nào.';
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  };
  
  const formatTime = (date) => {
    if (!date) return '';
    
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleTimeString('vi-VN', options);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return AlertCircle;
      case 'confirmed':
        return Check;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XIcon;
      default:
        return AlertCircle;
    }
  };
  
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'confirmed':
        return 'bg-info/10 text-info';
      case 'completed':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getAppointmentClasses = (appointment) => {
    switch (appointment.status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-l-2 border-warning';
      case 'confirmed':
        return 'bg-info/10 text-info border-l-2 border-info';
      case 'completed':
        return 'bg-success/10 text-success border-l-2 border-success';
      case 'cancelled':
        return 'bg-error/10 text-error border-l-2 border-error';
      default:
        return 'bg-gray-100 text-gray-600 border-l-2 border-gray-300';
    }
  };
  
  const getAppointmentsForDay = (date) => {
    return appointments.value.filter(appointment => {
      const appDate = new Date(appointment.startTime);
      return (
        appDate.getDate() === date.getDate() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Calendar navigation
  const prevMonth = () => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    currentDate.value = new Date(year, month - 1, 1);
  };
  
  const nextMonth = () => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    currentDate.value = new Date(year, month + 1, 1);
  };
  
  // Appointment actions
  const createAppointment = (date) => {
    isEditingAppointment.value = false;
    selectedAppointment.value = null;
    
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    Object.assign(appointmentForm, {
      title: '',
      date: formattedDate,
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      clientName: '',
      status: 'pending',
      notes: ''
    });
    
    Object.assign(appointmentErrors, {});
    
    showAppointmentModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const editAppointment = (appointment) => {
    isEditingAppointment.value = true;
    selectedAppointment.value = appointment;
    
    const startDate = new Date(appointment.startTime);
    const formattedDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    
    const startTimeHours = String(startDate.getHours()).padStart(2, '0');
    const startTimeMinutes = String(startDate.getMinutes()).padStart(2, '0');
    
    const endDate = new Date(appointment.endTime);
    const endTimeHours = String(endDate.getHours()).padStart(2, '0');
    const endTimeMinutes = String(endDate.getMinutes()).padStart(2, '0');
    
    Object.assign(appointmentForm, {
      title: appointment.title,
      date: formattedDate,
      startTime: `${startTimeHours}:${startTimeMinutes}`,
      endTime: `${endTimeHours}:${endTimeMinutes}`,
      location: appointment.location,
      clientName: appointment.client.name,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    
    Object.assign(appointmentErrors, {});
    
    showAppointmentModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const viewAppointment = (appointment) => {
    // Navigate to appointment detail
    console.log('View appointment:', appointment.id);
    // router.push(`/appointments/${appointment.id}`);
  };
  
  const closeAppointmentModal = () => {
    showAppointmentModal.value = false;
    document.body.style.overflow = '';
  };
  
  const validateAppointmentForm = () => {
    const errors = {};
    
    if (!appointmentForm.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề';
    }
    
    if (!appointmentForm.date) {
      errors.date = 'Vui lòng chọn ngày';
    }
    
    if (!appointmentForm.startTime) {
      errors.startTime = 'Vui lòng chọn giờ bắt đầu';
    }
    
    if (!appointmentForm.endTime) {
      errors.endTime = 'Vui lòng chọn giờ kết thúc';
    }
    
    if (!appointmentForm.location.trim()) {
      errors.location = 'Vui lòng nhập địa điểm';
    }
    
    if (!appointmentForm.clientName.trim()) {
      errors.clientName = 'Vui lòng nhập tên khách hàng';
    }
    
    Object.assign(appointmentErrors, errors);
    return Object.keys(errors).length === 0;
  };
  
  const saveAppointment = async () => {
    if (!validateAppointmentForm()) return;
    
    isSavingAppointment.value = true;
    
    try {
      // Prepare date objects
      const [year, month, day] = appointmentForm.date.split('-').map(Number);
      const [startHour, startMinute] = appointmentForm.startTime.split(':').map(Number);
      const [endHour, endMinute] = appointmentForm.endTime.split(':').map(Number);
      
      const startTime = new Date(year, month - 1, day, startHour, startMinute);
      const endTime = new Date(year, month - 1, day, endHour, endMinute);
      
      // Create appointment object
      const appointmentData = {
        title: appointmentForm.title,
        startTime,
        endTime,
        location: appointmentForm.location,
        status: appointmentForm.status,
        notes: appointmentForm.notes,
        client: {
          name: appointmentForm.clientName
        }
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditingAppointment.value && selectedAppointment.value) {
        // Update existing appointment
        const index = appointments.value.findIndex(app => app.id === selectedAppointment.value.id);
        if (index !== -1) {
          appointmentData.id = selectedAppointment.value.id;
          appointments.value[index] = appointmentData;
        }
      } else {
        // Add new appointment
        appointmentData.id = Date.now();
        appointments.value.push(appointmentData);
      }
      
      // Close modal
      closeAppointmentModal();
      
      // Show success message
      alert(isEditingAppointment.value ? 'Lịch hẹn đã được cập nhật' : 'Lịch hẹn đã được tạo');
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isSavingAppointment.value = false;
    }
  };
  
  const confirmDeleteAppointment = (appointment) => {
    selectedAppointment.value = appointment;
    showDeleteModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    document.body.style.overflow = '';
  };
  
  const deleteAppointment = async () => {
    if (!selectedAppointment.value) return;
    
    isDeleting.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove appointment from list
      appointments.value = appointments.value.filter(app => app.id !== selectedAppointment.value.id);
      
      // Close modal
      closeDeleteModal();
      
      // Show success message
      alert('Lịch hẹn đã được xóa');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      isDeleting.value = false;
    }
  };
  
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update appointment status
      const index = appointments.value.findIndex(app => app.id === appointmentId);
      if (index !== -1) {
        appointments.value[index].status = newStatus;
      }
      
      // Show success message
      alert(`Trạng thái lịch hẹn đã được cập nhật thành "${getStatusText(newStatus)}"`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };
  
  // Fetch appointments (mock data)
  onMounted(async () => {
    isLoading.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Current date for reference
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Mock data
      appointments.value = [
        
       
        {
          id: 3,
          title: 'Trang điểm chụp ảnh kỷ yếu',
          startTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
          endTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
          location: 'Trường Đại học XYZ, Thủ Đức, TP.HCM',
          status: 'completed',
          notes: 'Trang điểm cho 5 bạn nữ, phong cách trẻ trung, năng động',
          client: {
            name: 'Hồng Nhung',
            phone: '0909123456'
          }
        },
        {
          id: 4,
          title: 'Trang điểm sự kiện công ty',
          startTime: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
          endTime: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
          location: 'Khách sạn ABC, Quận 3, TP.HCM',
          status: 'cancelled',
          notes: 'Khách hàng hủy vì thay đổi kế hoạch',
          client: {
            name: 'Công ty XYZ',
            phone: '0909888777'
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  