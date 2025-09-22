const axios = require('axios');
const crypto = require('crypto');
const ModelCart = require('../models/ModelCart');
const ModelPayment = require('../models/ModelPayment');
const ModelUser = require('../models/ModelUser');
const { jwtDecode } = require('jwt-decode');

const { sendOrderConfirmationMail, sendDeliveryConfirmationMail } = require('../SendMail/SendMailOrder');
const sendOTPMail = require('../SendMail/SendOTPMail');
const { generateOTP, verifyOTP } = require('../utils/otpHelper');

require('dotenv').config();

class ControllerPayments {
    async getPayment(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelPayment.findOne({ user: decoded.email })
            .sort({ _id: 'desc' })
            .then((data) => res.status(200).json([data]));
    }

    // Tạo và gửi OTP cho thanh toán
    async sendPaymentOTP(req, res) {
        try {
            console.log('Bắt đầu xử lý yêu cầu gửi OTP');

            const { email } = req.body;
            if (!email) {
                console.log('Không tìm thấy email trong request');
                return res.status(400).json({ message: 'Email không được cung cấp' });
            }

            const token = req.cookies.Token;
            if (!token) {
                console.log('Không tìm thấy token trong cookie');
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded) {
                console.log('Token không hợp lệ:', decoded);
                return res.status(400).json({ message: 'Invalid token' });
            }

            console.log('Đang kiểm tra giỏ hàng cho email:', decoded.email);
            const cart = await ModelCart.findOne({ user: decoded.email });

            if (!cart) {
                console.log('Không tìm thấy giỏ hàng cho người dùng:', decoded.email);
                return res.status(404).json({ message: 'Giỏ hàng trống' });
            }

            if (cart.products.length === 0) {
                console.log('Giỏ hàng không có sản phẩm');
                return res.status(404).json({ message: 'Giỏ hàng trống' });
            }

            console.log('Kiểm tra thông tin giỏ hàng:', {
                hasAddress: !!cart.address,
                hasName: !!cart.name,
                hasPhone: !!cart.phone,
            });

            if (!cart.address || !cart.name || !cart.phone) {
                console.log('Thiếu thông tin thanh toán');
                return res.status(403).json({
                    message:
                        'Bạn đang thiếu thông tin thanh toán. Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.',
                });
            }

            // Tạo mã OTP và gửi qua email
            console.log('Tạo mã OTP cho email:', email);
            const otp = generateOTP(email);
            console.log('Đang gửi email OTP...');

            try {
                const emailSent = await sendOTPMail(email, otp);
                if (emailSent) {
                    console.log('Đã gửi OTP thành công đến email:', email);
                    return res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn' });
                } else {
                    console.log('Không thể gửi email OTP');
                    return res.status(500).json({ message: 'Không thể gửi mã OTP, vui lòng thử lại' });
                }
            } catch (emailError) {
                console.error('Lỗi khi gửi email OTP:', emailError);
                return res.status(500).json({ message: 'Lỗi gửi email: ' + emailError.message });
            }
        } catch (error) {
            console.error('Lỗi xử lý yêu cầu OTP:', error);
            res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
        }
    }

    // Xác thực OTP và thực hiện thanh toán
    async verifyPaymentOTP(req, res) {
        try {
            const { otp, email } = req.body;
            const token = req.cookies.Token;

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded || !decoded.email) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Sử dụng email từ request body thay vì từ token để đảm bảo tính nhất quán
            const emailToVerify = email || decoded.email;
            console.log(`Xác thực OTP cho email: ${emailToVerify}, OTP: ${otp}`);

            // Xác thực OTP
            const isValid = verifyOTP(emailToVerify, otp);
            if (!isValid) {
                console.log(`OTP không hợp lệ cho email: ${emailToVerify}`);
                return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
            }

            // Nếu OTP hợp lệ, tiến hành thanh toán
            const cart = await ModelCart.findOne({ user: decoded.email });
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ message: 'Giỏ hàng trống' });
            }

            const sumprice = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);

            const newPayment = new ModelPayment({
                products: cart.products.map((product) => ({
                    nameProduct: product.nameProduct,
                    quantity: product.quantity,
                    price: product.price,
                    size: product.size,
                    img: product.img,
                    type: product.type,
                })),
                sumprice: sumprice,
                tinhtrang: false,
                trangthai: false,
                user: decoded.email,
                address: cart.address,
                phone: cart.phone,
                username: cart.name,
            });

            // Gửi email xác nhận đơn hàng
            await sendOrderConfirmationMail(decoded.email);

            await newPayment.save();
            await ModelCart.deleteOne({ user: decoded.email });

            res.status(200).json({ message: 'Đặt hàng thành công! Vui lòng kiểm tra email của bạn.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    async PaymentCod(req, res) {
        try {
            const token = req.cookies.Token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded || !decoded.email) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const cart = await ModelCart.findOne({ user: decoded.email });
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty' });
            }
            if (!cart.address || !cart.name || !cart.phone) {
                return res.status(403).json({ message: 'Bạn đang thiếu thông tin' });
            }

            const sumprice = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);

            const newPayment = new ModelPayment({
                products: cart.products.map((product) => ({
                    nameProduct: product.nameProduct,
                    quantity: product.quantity,
                    price: product.price,
                    size: product.size,
                    img: product.img,
                    type: product.type,
                })),
                sumprice: sumprice,
                tinhtrang: false,
                trangthai: false,
                user: decoded.email,
                address: cart.address,
                phone: cart.phone,
                username: cart.name,
            });

            await sendOTPMail(decoded.email);
            await newPayment.save();
            await ModelCart.deleteOne({ user: decoded.email });
            res.status(200).json({ message: 'Thanh Toán Thành Công !!!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getPayments(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelPayment.find({ user: decoded.email }).then((data) => res.status(200).json(data));
    }

    async GetOrderUser(req, res) {
        ModelPayment.find({}).then((data) => {
            const newData = data.map((item) => item.products);
            return res.status(200).json(newData);
        });
    }

    async CancelOrder(req, res) {
        const { id } = req.body;
        ModelPayment.deleteOne({ _id: id }).then((data) => {
            return res.status(200).json({ message: 'Hủy đơn hàng thành công !!!' });
        });
    }

    async editOrder(req, res) {
        try {
            console.log('Bắt đầu xử lý yêu cầu xác nhận đơn hàng');
            const { valueOption, id } = req.body;
            console.log('Thông tin request:', { valueOption, id });

            const order = await ModelPayment.findById(id);
            if (!order) {
                console.log('Không tìm thấy đơn hàng với id:', id);
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            console.log('Tìm thấy đơn hàng:', {
                id: order._id,
                user: order.user,
                tinhtrang: order.tinhtrang,
                trangthai: order.trangthai,
            });

            try {
                // valueOption: 0 = Đang vận chuyển, 1 = Đã Giao Hàng
                if (valueOption === '1' || valueOption === 1) {
                    // Cập nhật trạng thái đã giao hàng
                    order.tinhtrang = true;
                    order.trangthai = true;
                    await order.save();

                    // Gửi mail xác nhận giao hàng cho khách
                    console.log('Chuẩn bị gửi mail xác nhận giao hàng đến:', order.user);
                    await sendDeliveryConfirmationMail(order.user);
                    console.log('Đã gửi mail xác nhận giao hàng thành công');

                    return res.status(200).json({ message: 'Đã xác nhận giao hàng và gửi email cho khách!' });
                } else {
                    // Cập nhật trạng thái đang vận chuyển
                    order.tinhtrang = false; // Chưa giao hàng
                    order.trangthai = true; // Đang vận chuyển
                    await order.save();

                    // Gửi mail thông báo đang vận chuyển
                    console.log('Chuẩn bị gửi mail thông báo đang vận chuyển đến:', order.user);
                    await sendOrderConfirmationMail(order.user, true); // true = isShipping
                    console.log('Đã gửi mail thông báo đang vận chuyển thành công');

                    return res
                        .status(200)
                        .json({ message: 'Đã cập nhật trạng thái đang vận chuyển và gửi email thông báo!' });
                }
            } catch (emailError) {
                console.error('Lỗi khi gửi email:', emailError);
                // Vẫn trả về thành công vì đã cập nhật được trạng thái đơn hàng
                return res.status(200).json({
                    message: 'Đã cập nhật trạng thái đơn hàng nhưng không gửi được email thông báo',
                    error: emailError.message,
                });
            }
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý editOrder:', error);
            res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' });
        }
    }

    async paymentMomo(req, res) {
        try {
            const token = req.cookies.Token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded || !decoded.email) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const cart = await ModelCart.findOne({ user: decoded.email });
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty' });
            }

            if (!cart.address || !cart.name || !cart.phone) {
                return res.status(403).json({ message: 'Bạn đang thiếu thông tin thanh toán' });
            }

            // Kiểm tra các biến môi trường
            const partnerCode = process.env.MOMO_PARTNER_CODE;
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretKey = process.env.MOMO_SECRET_KEY;

            if (!partnerCode || !accessKey || !secretKey) {
                console.error('Thiếu thông tin cấu hình Momo:', { partnerCode, accessKey, secretKey });
                return res.status(500).json({ message: 'Chưa cấu hình đầy đủ thông tin thanh toán Momo' });
            }

            const sumprice = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);

            // Tạo đơn hàng mới
            const newPayment = new ModelPayment({
                products: cart.products.map((product) => ({
                    nameProduct: product.nameProduct,
                    quantity: product.quantity,
                    price: product.price,
                    size: product.size,
                    img: product.img,
                    type: product.type,
                })),
                sumprice: sumprice,
                tinhtrang: false,
                trangthai: false, // Sẽ cập nhật thành true khi thanh toán Momo thành công
                user: decoded.email,
                address: cart.address,
                phone: cart.phone,
                username: cart.name,
            });

            // Tạo thông tin thanh toán Momo
            const requestId = partnerCode + new Date().getTime();
            const orderId = requestId;
            const orderInfo = 'Thanh toán đơn hàng TVVN Store';
            const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/paymentsuccess`;
            const ipnUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/momo-ipn`;
            const amount = sumprice.toString();
            const requestType = 'captureWallet';
            const extraData = Buffer.from(
                JSON.stringify({
                    orderId: newPayment._id.toString(),
                }),
            ).toString('base64');

            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            const crypto = require('crypto');
            const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            const requestBody = {
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                extraData: extraData,
                requestType: requestType,
                signature: signature,
                lang: 'vi',
            };

            console.log('Gửi yêu cầu thanh toán Momo:', {
                ...requestBody,
                signature: '***hidden***',
            });

            // Gọi API Momo test environment
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);

            console.log('Kết quả từ Momo:', response.data);

            if (response.data.resultCode === 0) {
                // Lưu đơn hàng tạm thời
                await newPayment.save();

                // Trả về URL thanh toán Momo
                return res.json({
                    payUrl: response.data.payUrl,
                    message: 'Đang chuyển hướng đến trang thanh toán Momo',
                });
            } else {
                return res.status(400).json({
                    message: 'Không thể tạo giao dịch Momo: ' + response.data.message,
                });
            }
        } catch (error) {
            console.error('Lỗi thanh toán Momo:', error);
            res.status(500).json({ message: 'Lỗi máy chủ khi xử lý thanh toán Momo' });
        }
    }

    // Xử lý callback từ Momo
    async momoIPN(req, res) {
        try {
            const {
                partnerCode,
                orderId,
                requestId,
                amount,
                orderInfo,
                orderType,
                transId,
                resultCode,
                message,
                payType,
                responseTime,
                extraData,
                signature,
            } = req.body;

            // Xác thực chữ ký từ Momo
            const secretKey = process.env.MOMO_SECRET_KEY;
            const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

            const crypto = require('crypto');
            const checkSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            if (checkSignature !== signature) {
                return res.status(400).json({ message: 'Invalid signature' });
            }

            // Kiểm tra kết quả thanh toán
            if (resultCode === 0) {
                // Lấy orderId từ extraData
                const decodedExtraData = JSON.parse(Buffer.from(extraData, 'base64').toString());
                const paymentId = decodedExtraData.orderId;

                // Cập nhật trạng thái đơn hàng
                const order = await ModelPayment.findById(paymentId);
                if (order) {
                    order.trangthai = true; // Đánh dấu đã thanh toán
                    await order.save();

                    // Xóa giỏ hàng
                    await ModelCart.deleteOne({ user: order.user });

                    // Gửi email xác nhận đơn hàng
                    await sendOrderConfirmationMail(order.user);
                }
            }

            // Trả về cho Momo
            return res.json({ message: 'Processed' });
        } catch (error) {
            console.error('Lỗi xử lý IPN Momo:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async GetOrderDetails(req, res) {
        try {
            const orderId = req.params.id;
            const order = await ModelPayment.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            res.status(200).json(order);
        } catch (error) {
            console.error('Error in GetOrderDetails:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = new ControllerPayments();
