import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem("token") || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || "guest")
  const userFullName = computed(() => user.value?.fullName || "")
  const userAvatar = computed(() => user.value?.avatar || "/placeholder-avatar.jpg")

  // Actions
  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      // Mô phỏng API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mô phỏng đăng nhập thành công
      if (email === "demo@example.com" && password === "password") {
        const userData = {
          id: 1,
          email: "demo@example.com",
          fullName: "Nguyễn Thị Makeup",
          role: "artist", // hoặc 'client', 'admin'
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        }

        const authToken = "mock-jwt-token"

        // Lưu thông tin đăng nhập
        user.value = userData
        token.value = authToken
        localStorage.setItem("token", authToken)

        return { success: true }
      } else {
        throw new Error("Email hoặc mật khẩu không chính xác")
      }
    } catch (err) {
      error.value = err.message || "Đã xảy ra lỗi khi đăng nhập"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null

    try {
      // Mô phỏng API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mô phỏng đăng ký thành công
      const newUser = {
        id: Date.now(),
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || "artist",
        avatar: null,
      }

      const authToken = "mock-jwt-token-new-user"

      // Lưu thông tin đăng nhập
      user.value = newUser
      token.value = authToken
      localStorage.setItem("token", authToken)

      return { success: true }
    } catch (err) {
      error.value = err.message || "Đã xảy ra lỗi khi đăng ký"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    // Mô phỏng API call (nếu cần)
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Xóa thông tin đăng nhập
    user.value = null
    token.value = null
    localStorage.removeItem("token")
  }

  async function fetchUserProfile() {
    if (!token.value) return

    loading.value = true
    error.value = null

    try {
      // Mô phỏng API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mô phỏng lấy thông tin người dùng
      user.value = {
        id: 1,
        email: "demo@example.com",
        fullName: "Nguyễn Thị Makeup",
        role: "artist",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        phone: "0912345678",
        address: "Quận 1, TP.HCM",
      }

      return { success: true }
    } catch (err) {
      error.value = err.message || "Không thể lấy thông tin người dùng"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    if (!token.value) return { success: false, error: "Chưa đăng nhập" }

    loading.value = true
    error.value = null

    try {
      // Mô phỏng API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cập nhật thông tin người dùng
      user.value = {
        ...user.value,
        ...profileData,
      }

      return { success: true }
    } catch (err) {
      error.value = err.message || "Không thể cập nhật thông tin"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Khởi tạo - lấy thông tin người dùng nếu đã đăng nhập
  function init() {
    if (token.value) {
      fetchUserProfile()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    userFullName,
    userAvatar,

    // Actions
    login,
    register,
    logout,
    fetchUserProfile,
    updateProfile,
    init,
  }
})
