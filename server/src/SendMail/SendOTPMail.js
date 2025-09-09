const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

/**
 * Gửi mã OTP qua email sử dụng OAuth2
 * @param {string} email - Email người nhận
 * @param {string} otp - Mã OTP
 * @returns {Promise<boolean>} - Kết quả gửi email
 */
const sendOTPMail = async (email, otp) => {
    try {
        // Validate input
        if (!email || !otp) {
            console.error('Email hoặc OTP không được cung cấp');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Email không hợp lệ:', email);
            return false;
        }

        // Log thông tin cấu hình để debug
        console.log('Đang gửi OTP đến email:', email);
        console.log('OAuth2 Cấu hình:', {
            clientId: CLIENT_ID ? 'Đã cấu hình' : 'Thiếu',
            clientSecret: CLIENT_SECRET ? 'Đã cấu hình' : 'Thiếu',
            redirectUri: REDIRECT_URI,
            refreshToken: REFRESH_TOKEN ? 'Đã cấu hình' : 'Thiếu',
            emailUser: process.env.EMAIL_USER
        });

        // Kiểm tra thông tin cấu hình OAuth2
        if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !process.env.EMAIL_USER) {
            console.error('Thiếu thông tin cấu hình OAuth2 trong file .env');
            throw new Error('Thiếu thông tin cấu hình OAuth2. Vui lòng kiểm tra file .env');
        }

        // Cấu hình OAuth2 client
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        
        // Lấy access token
        try {
            console.log('Đang lấy access token...');
            const accessToken = await oAuth2Client.getAccessToken();
            console.log('Đã lấy được access token');
            
            // Tạo transporter với OAuth2
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.EMAIL_USER,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken.token
                },
                debug: true // Bật debug để theo dõi chi tiết
            });

            // Kiểm tra kết nối SMTP
            try {
                await transport.verify();
                console.log('Kết nối SMTP thành công');
            } catch (verifyError) {
                console.error('Lỗi kết nối SMTP:', verifyError);
                throw new Error('Không thể kết nối với máy chủ SMTP');
            }
            
            // Chuẩn bị nội dung email
            const mailOptions = {
                from: `"Thanh toán GLAB" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Mã OTP Xác Nhận Thanh Toán',
                text: `Mã OTP của bạn là: ${otp}`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #4a4a4a; text-align: center;">Xác Nhận Thanh Toán</h2>
                    <p style="color: #666; font-size: 16px;">Kính gửi Quý khách,</p>
                    <p style="color: #666; font-size: 16px;">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Để hoàn tất quá trình thanh toán, vui lòng sử dụng mã OTP dưới đây:</p>
                    <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #e63946; letter-spacing: 5px; font-size: 32px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">Mã OTP này sẽ hết hạn sau 5 phút.</p>
                    <p style="color: #666; font-size: 14px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay lập tức.</p>
                    <p style="color: #666; font-size: 16px; margin-top: 30px;">Trân trọng,<br />Đội ngũ GLAB</p>
                </div>
                `,
            };

            // Gửi email
            console.log('Đang gửi email OTP...');
            const info = await transport.sendMail(mailOptions);
            console.log('Email đã gửi thành công, ID: %s', info.messageId);
            return true;
        } catch (oauthError) {
            console.error('Lỗi trong quá trình xác thực OAuth2:', oauthError);
            if (oauthError.message && oauthError.message.includes('invalid_grant')) {
                console.error('REFRESH_TOKEN có thể đã hết hạn. Vui lòng tạo mới REFRESH_TOKEN');
            }
            throw oauthError;
        }
    } catch (error) {
        console.error('Lỗi khi gửi email OTP:', error);
        if (error.response) {
            console.error('Chi tiết lỗi SMTP:', error.response.body);
        }
        
        // Thử gửi log chi tiết
        console.error('Loại lỗi:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        return false;
    }
};

module.exports = sendOTPMail; 