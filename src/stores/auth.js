import { defineStore } from 'pinia'
import authService from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  
  getters: {
    userFullName() {
      if (!this.user) return '';
      return this.user.fullName || this.user.username || '';
    },
    
    userAvatar() {
      if (!this.user) return '';
      return this.user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrtQBXGauSHMKNR-H7uIGq5k7Par8k4scPw&s';
    },
    
    userRole() {
      if (!this.user || !this.user.roles) return '';
      return this.user.roles[0] || '';
    },
    
    isAdmin() {
      if (!this.user || !this.user.roles) return false;
      return this.user.roles.includes('ROLE_ADMIN');
    }
  },
  
  actions: {
    init() {
      // Check for existing auth in localStorage
      const user = authService.getUserFromStorage();
      if (user) {
        this.user = user;
        this.isAuthenticated = true;
      }
    },
    
    async login(username, password) {
      try {
        const response = await authService.login(username, password);
        const userData = response.data;
        this.user = userData;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    logout() {
      authService.logout();
      this.user = null;
      this.isAuthenticated = false;
    },
    
    async fetchCurrentUser() {
      try {
        const response = await authService.getCurrentUser();
        const userData = response.data;
        this.user = userData;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.logout();
        throw error;
      }
    }
  }
})