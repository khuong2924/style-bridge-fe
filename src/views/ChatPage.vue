<template>
    <MainLayout>
      <div class="container py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Tin nhắn</h1>
          <p class="text-lg text-gray-600">
            Trò chuyện với khách hàng và đối tác của bạn
          </p>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-250px)]">
            <!-- Danh sách cuộc trò chuyện -->
            <div class="border-r border-gray-200 overflow-hidden">
              <div class="p-4 border-b border-gray-200">
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="Tìm kiếm cuộc trò chuyện..." 
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Search class="absolute left-3 top-2.5 text-gray-400" size="18" />
                </div>
              </div>
              
              <div class="overflow-y-auto h-[calc(100%-65px)]">
                <div 
                  v-for="conversation in filteredConversations" 
                  :key="conversation.id"
                  class="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-primary/5': selectedConversation?.id === conversation.id }"
                  @click="selectConversation(conversation)"
                >
                  <div class="flex items-start">
                    <div class="relative mr-3">
                      <div class="h-12 w-12 rounded-full bg-gray-100 overflow-hidden">
                        <img 
                          :src="conversation.user.avatar || '/placeholder-avatar.jpg'" 
                          alt="User Avatar" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div 
                        v-if="conversation.unreadCount > 0"
                        class="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs flex items-center justify-center rounded-full"
                      >
                        {{ conversation.unreadCount }}
                      </div>
                    </div>
                    
                    <div class="flex-grow min-w-0">
                      <div class="flex justify-between items-baseline">
                        <h3 class="font-medium text-gray-900 truncate">{{ conversation.user.name }}</h3>
                        <span class="text-xs text-gray-500">{{ formatTime(conversation.lastMessage.timestamp) }}</span>
                      </div>
                      
                      <p class="text-sm text-gray-600 truncate">
                        {{ conversation.lastMessage.text }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div v-if="filteredConversations.length === 0" class="p-4 text-center text-gray-500">
                  Không tìm thấy cuộc trò chuyện nào
                </div>
              </div>
            </div>
            
            <!-- Khu vực chat -->
            <div class="col-span-2 flex flex-col h-full">
              <div v-if="!selectedConversation" class="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquare class="text-gray-300 h-16 w-16 mb-4" />
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Chưa chọn cuộc trò chuyện</h2>
                <p class="text-gray-600 max-w-md">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.
                </p>
              </div>
              
              <template v-else>
                <!-- Header -->
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3">
                      <img 
                        :src="selectedConversation.user.avatar || '/placeholder-avatar.jpg'" 
                        alt="User Avatar" 
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ selectedConversation.user.name }}</h3>
                      <p class="text-xs text-gray-500">
                        {{ selectedConversation.user.isOnline ? 'Đang hoạt động' : 'Không hoạt động' }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <Phone size="18" />
                    </button>
                    <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <Video size="18" />
                    </button>
                    <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <MoreVertical size="18" />
                    </button>
                  </div>
                </div>
                
                <!-- Messages -->
                <div
                  ref="messagesContainer"
                  class="flex-grow p-4 overflow-y-auto"
                >\
                  <div v-if="isLoadingMessages" class="flex justify-center py-4">
                    <LoaderCircle class="animate-spin text-primary h-6 w-6" />
                  </div>
                  
                  <div v-else class="space-y-4">
                    <div 
                      v-for="(message, index) in selectedConversation.messages" 
                      :key="index"
                      class="flex"
                      :class="message.isMine ? 'justify-end' : 'justify-start'"
                    >
                      <div 
                        v-if="!message.isMine" 
                        class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden mr-2 flex-shrink-0 self-end"
                      >
                        <img 
                          :src="selectedConversation.user.avatar || '/placeholder-avatar.jpg'" 
                          alt="User Avatar" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div 
                        class="max-w-[70%] rounded-lg px-4 py-2 text-sm"
                        :class="message.isMine 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'"
                      >
                        <p>{{ message.text }}</p>
                        <div 
                          class="text-xs mt-1 text-right"
                          :class="message.isMine ? 'text-white/70' : 'text-gray-500'"
                        >
                          {{ formatTime(message.timestamp) }}
                          <span v-if="message.isMine" class="ml-1">
                            <Check v-if="message.read" size="12" class="inline" />
                            <CheckCheck v-else size="12" class="inline" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Input -->
                <div class="p-4 border-t border-gray-200">
                  <form @submit.prevent="sendMessage" class="flex items-center">
                    <button 
                      type="button"
                      class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 mr-2"
                    >
                      <Paperclip size="18" />
                    </button>
                    
                    <input 
                      type="text" 
                      v-model="newMessage"
                      placeholder="Nhập tin nhắn..." 
                      class="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    
                    <button 
                      type="submit"
                      class="p-2 ml-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!newMessage.trim()"
                    >
                      <Send size="18" />
                    </button>
                  </form>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick, watch } from 'vue';
  import { 
    Search, MessageSquare, Phone, Video, MoreVertical, 
    Paperclip, Send, Check, CheckCheck, LoaderCircle
  } from 'lucide-vue-next';
  import MainLayout from '@/layouts/MainLayout.vue';
  
  // State
  const conversations = ref([]);
  const selectedConversation = ref(null);
  const searchQuery = ref('');
  const newMessage = ref('');
  const isLoadingMessages = ref(false);
  const messagesContainer = ref(null);
  
  // Computed
  const filteredConversations = computed(() => {
    if (!searchQuery.value) return conversations.value;
    
    const query = searchQuery.value.toLowerCase();
    return conversations.value.filter(conversation => 
      conversation.user.name.toLowerCase().includes(query) ||
      conversation.lastMessage.text.toLowerCase().includes(query)
    );
  });
  
  // Methods
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Nếu là hôm nay
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Nếu là hôm qua
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    }
    
    // Nếu là trong tuần này
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[date.getDay()];
    }
    
    // Nếu là cũ hơn
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };
  
  const selectConversation = async (conversation) => {
    isLoadingMessages.value = true;
    selectedConversation.value = conversation;
    
    // Đánh dấu là đã đọc
    conversation.unreadCount = 0;
    
    try {
      // Mô phỏng tải tin nhắn
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Cuộn xuống tin nhắn cuối cùng
      await nextTick();
      scrollToBottom();
    } finally {
      isLoadingMessages.value = false;
    }
  };
  
  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  };
  
  const sendMessage = () => {
    if (!newMessage.value.trim() || !selectedConversation.value) return;
    
    // Thêm tin nhắn mới
    const message = {
      text: newMessage.value,
      timestamp: new Date(),
      isMine: true,
      read: false
    };
    
    selectedConversation.value.messages.push(message);
    selectedConversation.value.lastMessage = message;
    
    // Xóa nội dung tin nhắn
    newMessage.value = '';
    
    // Cuộn xuống tin nhắn cuối cùng
    nextTick(() => {
      scrollToBottom();
    });
    
    // Mô phỏng tin nhắn phản hồi
    setTimeout(() => {
      if (selectedConversation.value) {
        const replyMessage = {
          text: 'Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.',
          timestamp: new Date(),
          isMine: false,
          read: true
        };
        
        selectedConversation.value.messages.push(replyMessage);
        selectedConversation.value.lastMessage = replyMessage;
        
        // Đánh dấu tin nhắn của mình là đã đọc
        selectedConversation.value.messages.forEach(msg => {
          if (msg.isMine) {
            msg.read = true;
          }
        });
        
        // Cuộn xuống tin nhắn cuối cùng
        nextTick(() => {
          scrollToBottom();
        });
      }
    }, 2000);
  };
  
  // Watch
  watch(selectedConversation, () => {
    nextTick(() => {
      scrollToBottom();
    });
  });
  
  // Fetch conversations (mock data)
  onMounted(async () => {
    try {
      // Mô phỏng API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      conversations.value = [
        {
          id: 1,
          user: {
            name: 'Ngọc Anh',
            avatar: null,
            isOnline: true
          },
          lastMessage: {
            text: 'Cảm ơn bạn đã xác nhận lịch hẹn. Tôi sẽ đến đúng giờ.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isMine: false
          },
          unreadCount: 2,
          messages: [
            {
              text: 'Xin chào, tôi muốn đặt lịch trang điểm cho đám cưới vào ngày 15/6.',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              isMine: false,
              read: true
            },
            {
              text: 'Chào bạn, rất vui khi nhận được tin nhắn của bạn. Ngày 15/6 tôi vẫn còn lịch trống. Bạn muốn đặt vào khung giờ nào?',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
              isMine: true,
              read: true
            },
            {
              text: 'Tôi muốn đặt lịch vào buổi sáng, khoảng 7h. Bạn có thể làm trang điểm cho cô dâu và 2 phù dâu không?',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              isMine: false,
              read: true
            },
            {
              text: 'Được chứ, tôi có thể làm trang điểm cho cô dâu và 2 phù dâu. Vậy tôi sẽ đến địa điểm vào lúc 7h sáng ngày 15/6. Bạn có thể cho tôi địa chỉ cụ thể không?',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
              isMine: true,
              read: true
            },
           
            {
              text: 'Địa chỉ là Khách sạn ABC, số 123 đường XYZ, Quận 1, TP.HCM. Tôi sẽ gửi cho bạn bản đồ chi tiết sau.',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
              isMine: false,
              read: true
            },
            {
              text: 'Cảm ơn bạn. Tôi đã xác nhận lịch hẹn vào ngày 15/6 lúc 7h sáng tại địa chỉ bạn cung cấp. Bạn có yêu cầu gì đặc biệt về phong cách trang điểm không?',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
              isMine: true,
              read: true
            },
            {
              text: 'Cảm ơn bạn đã xác nhận lịch hẹn. Tôi sẽ đến đúng giờ.',
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              isMine: false,
              read: false
            }
          ]
        },
        {
          id: 2,
          user: {
            name: 'Minh Tâm',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            isOnline: false
          },
          lastMessage: {
            text: 'Bạn có thể trang điểm theo phong cách Hàn Quốc không?',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            isMine: false
          },
          unreadCount: 0,
          messages: [
            {
              text: 'Chào bạn, tôi muốn hỏi về dịch vụ trang điểm của bạn.',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              isMine: false,
              read: true
            },
            {
              text: 'Chào bạn, rất vui được hỗ trợ. Bạn cần tìm hiểu về dịch vụ nào cụ thể ạ?',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
              isMine: true,
              read: true
            },
            {
              text: 'Bạn có thể trang điểm theo phong cách Hàn Quốc không?',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              isMine: false,
              read: true
            }
          ]
        },
        {
          id: 3,
          user: {
            name: 'Công ty XYZ',
            avatar: null,
            isOnline: true
          },
          lastMessage: {
            text: 'Chúng tôi cần tìm nghệ sĩ trang điểm cho sự kiện công ty vào ngày 20/5.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            isMine: false
          },
          unreadCount: 1,
          messages: [
            {
              text: 'Chúng tôi cần tìm nghệ sĩ trang điểm cho sự kiện công ty vào ngày 20/5.',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              isMine: false,
              read: false
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  });
  </script>
  