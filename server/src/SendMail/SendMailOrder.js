const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { OAuth2 } = google.auth;

const {
    EMAIL_USER,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    REDIRECT_URI,
} = process.env;

const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Hàm gửi email xác nhận đơn hàng mới và đang vận chuyển
const sendOrderConfirmationMail = async (email, isShipping = false) => {
    try {
        console.log(`SendOrderConfirmationMail: Bắt đầu gửi email ${isShipping ? 'đang vận chuyển' : 'xác nhận đơn hàng'} đến`, email);
        
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const subject = isShipping 
            ? '📦 Đơn hàng của bạn đang được vận chuyển!'
            : '🎉 Xác nhận đơn hàng của bạn!';

        const statusMessage = isShipping
            ? `<p>Đơn hàng của bạn đã được <b>BÀN GIAO CHO ĐƠN VỊ VẬN CHUYỂN</b>! 🚚</p>`
            : `<p>Đơn hàng của bạn đã được <b>XÁC NHẬN</b> tại <b>TVVN STORE</b>! 🚀</p>`;

        const statusDetail = isShipping
            ? `<p>✅ Đã bàn giao cho đơn vị vận chuyển</p>
               <p>🚚 Đang trên đường giao đến bạn</p>`
            : `<p>✅ Đã xác nhận đơn hàng</p>
               <p>⏳ Đang chuẩn bị hàng</p>`;

        const importantInfo = isShipping
            ? `<p>- Đơn vị vận chuyển sẽ liên hệ với bạn trong thời gian sớm nhất</p>
               <p>- Vui lòng chuẩn bị số tiền thanh toán khi nhận hàng (nếu bạn chọn COD)</p>
               <p>- Bạn sẽ nhận được email thông báo khi đơn hàng được giao thành công</p>`
            : `<p>- Chúng tôi sẽ sớm bắt đầu chuẩn bị đơn hàng của bạn</p>
               <p>- Bạn sẽ nhận được email thông báo khi đơn hàng bắt đầu vận chuyển</p>
               <p>- Vui lòng chuẩn bị số tiền thanh toán khi nhận hàng (nếu bạn chọn COD)</p>`;

        const info = await transport.sendMail({
            from: `"TVVN STORE 🎉" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: 'Cảm ơn bạn đã đặt hàng tại TVVN STORE!',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2E86C1;">📦 Thông báo về đơn hàng của bạn!</h2>
                ${statusMessage}
                
                <h3 style="color: #28B463;">📦 Trạng thái đơn hàng:</h3>
                ${statusDetail}

                <h3 style="color: #D68910;">💡 Thông tin quan trọng:</h3>
                ${importantInfo}

                <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại <b><a href="mailto:${process.env.EMAIL_USER}" style="color: #2980B9;">liên hệ với chúng tôi</a></b>.</p>

                <p>Cảm ơn bạn đã tin tưởng <b>TVVN STORE</b>! 💖</p>

                <p style="color: #2E86C1; font-weight: bold;">Trân trọng,<br> Đội ngũ TVVN STORE</p>
            </div>
            `,
        });
        
        console.log(`SendOrderConfirmationMail: Đã gửi email ${isShipping ? 'đang vận chuyển' : 'xác nhận đơn hàng'} thành công, message ID:`, info.messageId);
        return true;
    } catch (error) {
        console.error('SendOrderConfirmationMail: Lỗi gửi email:', error);
        if (error.response) {
            console.error('Chi tiết lỗi:', error.response.body);
        }
        return false;
    }
};

// Hàm gửi email xác nhận giao hàng thành công
const sendDeliveryConfirmationMail = async (email) => {
    try {
        console.log('SendDeliveryConfirmationMail: Bắt đầu gửi email xác nhận giao hàng đến', email);
        
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const info = await transport.sendMail({
            from: `"TVVN STORE 🎉" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 Đơn hàng đã được giao thành công!',
            text: 'Cảm ơn bạn đã đặt hàng tại TVVN STORE!',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2E86C1;">🎉 Xin chúc mừng!</h2>
                <p>Đơn hàng của bạn đã được <b>GIAO THÀNH CÔNG</b>! 🚀</p>
                
                <h3 style="color: #28B463;">📦 Trạng thái đơn hàng:</h3>
                <p>✅ Đã giao hàng thành công</p>

                <h3 style="color: #D68910;">💡 Chăm sóc sản phẩm:</h3>
                <p>- Vui lòng kiểm tra kỹ sản phẩm sau khi nhận</p>
                <p>- Thực hiện các hướng dẫn chăm sóc đi kèm với sản phẩm</p>
                <p>- Nếu có bất kỳ khiếu nại nào, vui lòng liên hệ với chúng tôi trong vòng 7 ngày</p>

                <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại <b><a href="mailto:${process.env.EMAIL_USER}" style="color: #2980B9;">liên hệ với chúng tôi</a></b>.</p>

                <p>Cảm ơn bạn đã tin tưởng <b>TVVN STORE</b>! 💖</p>

                <p style="color: #2E86C1; font-weight: bold;">Trân trọng,<br> Đội ngũ TVVN STORE</p>
            </div>
            `,
        });
        
        console.log('SendDeliveryConfirmationMail: Đã gửi email xác nhận giao hàng thành công, message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('SendDeliveryConfirmationMail: Lỗi gửi email:', error);
        if (error.response) {
            console.error('Chi tiết lỗi:', error.response.body);
        }
        return false;
    }
};

module.exports = {
    sendOrderConfirmationMail,
    sendDeliveryConfirmationMail
};
