const crypto = require('crypto');

// Lưu trữ tạm thời OTP (trong thực tế nên lưu vào database)
const otpStorage = new Map();

/**
 * Tạo mã OTP ngẫu nhiên và lưu trữ
 * @param {string} email - Email của người dùng
 * @param {number} expiryMinutes - Thời gian hết hạn tính bằng phút
 * @returns {string} - Mã OTP đã tạo
 */
const generateOTP = (email, expiryMinutes = 5) => {
  // Kiểm tra input
  if (!email) {
    console.error('generateOTP: Email không được cung cấp');
    throw new Error('Email không được để trống');
  }
  
  // Tạo OTP ngẫu nhiên 6 chữ số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Lưu trữ OTP với thời gian hết hạn
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
  
  console.log(`OTP đã tạo cho ${email}: ${otp} (hết hạn sau ${expiryMinutes} phút)`);
  
  otpStorage.set(email, {
    otp,
    expiryTime,
  });
  
  return otp;
};

/**
 * Xác thực OTP của người dùng
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP cần xác thực
 * @returns {boolean} - Kết quả xác thực
 */
const verifyOTP = (email, otp) => {
  console.log(`Đang xác thực OTP ${otp} cho ${email}`);
  
  // Kiểm tra input
  if (!email || !otp) {
    console.error('verifyOTP: Email hoặc OTP không được cung cấp');
    return false;
  }
  
  const otpData = otpStorage.get(email);
  
  // Kiểm tra OTP có tồn tại không
  if (!otpData) {
    console.log(`Không tìm thấy OTP cho ${email}`);
    return false;
  }
  
  // Kiểm tra OTP có hết hạn không
  const now = new Date();
  if (now > otpData.expiryTime) {
    console.log(`OTP cho ${email} đã hết hạn (${otpData.expiryTime})`);
    otpStorage.delete(email); // Xóa OTP hết hạn
    return false;
  }
  
  // Kiểm tra OTP có khớp không
  if (otpData.otp !== otp) {
    console.log(`OTP không khớp cho ${email}: Nhập ${otp}, Thực tế ${otpData.otp}`);
    return false;
  }
  
  // Xóa OTP sau khi xác thực thành công
  console.log(`Xác thực OTP thành công cho ${email}`);
  otpStorage.delete(email);
  return true;
};

// Hàm debug để xem tất cả OTP đang lưu trữ
const listAllOTPs = () => {
  console.log("Danh sách OTP hiện tại:");
  otpStorage.forEach((value, key) => {
    console.log(`Email: ${key}, OTP: ${value.otp}, Hết hạn: ${value.expiryTime}`);
  });
};

module.exports = {
  generateOTP,
  verifyOTP,
  listAllOTPs
}; 