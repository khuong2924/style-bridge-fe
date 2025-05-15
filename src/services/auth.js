import apiClient from './axios-config';

const authService = {
  /**
   * Đăng nhập người dùng
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   * @returns {Promise} - Promise trả về thông tin người dùng
   */
  login(username, password) {
    return apiClient.post('https://truongvinhkhuong.io.vn/auth/auth/signin', {
      username,
      password
    });
  },

  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Dữ liệu người dùng
   * @returns {Promise} - Promise trả về kết quả đăng ký
   */
  register(userData) {
    return apiClient.post('/auth/signup', userData);
  },

  /**
   * Đăng xuất người dùng
   */
  logout() {
    localStorage.removeItem('user');
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise} - Promise trả về thông tin người dùng
   */
  getCurrentUser() {
    return apiClient.get('/auth/user');
  },

  /**
   * Lấy thông tin người dùng từ localStorage
   * @returns {Object|null} - Thông tin người dùng hoặc null nếu chưa đăng nhập
   */
  getUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
   */
  isAuthenticated() {
    const user = this.getUserFromStorage();
    return !!user && !!user.token;
  }
};

export default authService; 