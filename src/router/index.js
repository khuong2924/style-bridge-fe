import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

// Trang chủ và trang công khai
import HomeView from "@/views/HomeView.vue"
import JobListings from "@/views/JobListings.vue"
import JobDetail from "@/views/JobDetail.vue"
import LoginView from "@/views/LoginView.vue"
import RegisterView from "@/views/RegisterView.vue"
import ModalTestPage from "@/views/ModalTestPage.vue"

// Trang yêu cầu đăng nhập
import CreateJobPost from "@/views/CreateJobPost.vue"
import ApplicationManagement from "@/views/ApplicationManagement.vue"
import ApplicationDetailView from "@/views/ApplicationDetailView.vue"
import ProfilePage from "@/views/ProfilePage.vue"
import UserProfileView from "@/views/UserProfileView.vue"
import AppointmentManagement from "@/views/AppointmentManagement.vue"
import ChatPage from "@/views/ChatPage.vue"
import ReviewsPage from "@/views/ReviewsPage.vue"
import StatisticsPage from "@/views/StatisticsPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Trang công khai
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Trang chủ" },
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobListings,
      meta: { title: "Danh sách công việc" },
    },
    {
      path: "/jobs/:id",
      name: "job-detail",
      component: JobDetail,
      meta: { title: "Chi tiết công việc" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "Đăng nhập", guest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { title: "Đăng ký", guest: true },
    },
    {
      path: "/modal-test",
      name: "modal-test",
      component: ModalTestPage,
      meta: { title: "Test Modal" },
    },

    // Trang yêu cầu đăng nhập
    {
      path: "/jobs/create",
      name: "create-job",
      component: CreateJobPost,
      meta: { requiresAuth: true, title: "Tạo công việc mới" },
    },
    {
      path: "/applications",
      name: "applications",
      component: ApplicationManagement,
      meta: { requiresAuth: true, title: "Quản lý đơn ứng tuyển" },
    },
    {
      path: "/applications/:id",
      name: "application-detail",
      component: ApplicationDetailView,
      meta: { requiresAuth: true, title: "Chi tiết đơn ứng tuyển" },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
      meta: { requiresAuth: true, title: "Hồ sơ cá nhân" },
    },
    {
      path: "/profile/:userId",
      name: "user-profile",
      component: UserProfileView,
      meta: { title: "Hồ sơ người dùng" },
    },
    {
      path: "/appointments",
      name: "appointments",
      component: AppointmentManagement,
      meta: { requiresAuth: true, title: "Quản lý lịch hẹn" },
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatPage,
      meta: { requiresAuth: true, title: "Tin nhắn" },
    },
    {
      path: "/reviews",
      name: "reviews",
      component: ReviewsPage,
      meta: { requiresAuth: true, title: "Đánh giá" },
    },
    {
      path: "/statistics",
      name: "statistics",
      component: StatisticsPage,
      meta: { requiresAuth: true, title: "Thống kê" },
    },

    // Trang 404
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
      meta: { title: "Không tìm thấy trang" },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Cập nhật tiêu đề trang
  document.title = to.meta.title ? `${to.meta.title} | Makeup Artist Platform` : "Makeup Artist Platform"

  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some((record) => record.meta.guest)

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (requiresAuth && !authStore.isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    next({ name: "login", query: { redirect: to.fullPath } })
  } else if (isGuestOnly && authStore.isAuthenticated) {
    // Nếu đã đăng nhập và cố gắng truy cập trang dành cho khách (như login/register)
    next({ name: "home" })
  } else {
    // Cho phép truy cập
    next()
  }
})

export default router
