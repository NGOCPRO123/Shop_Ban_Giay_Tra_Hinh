const express = require('express');
const router = express.Router();

const ControllerPayments = require('../controllers/ControllerPayments');
const ControllerJWT = require('../jwt/ControllerJWT');

// Route để admin xác nhận đơn hàng (gửi email)
router.post('/api/editorder', ControllerJWT.verifyTokenAdmin, ControllerPayments.editOrder);

// Thêm các route khác liên quan đến payment
router.get('/api/payment', ControllerPayments.getPayment);
router.get('/api/payments', ControllerJWT.verifyToken, ControllerPayments.getPayments);
router.get('/api/dataorderuser', ControllerPayments.GetOrderUser);
router.post('/api/cancelorder', ControllerPayments.CancelOrder);
router.get('/api/order/:id', ControllerJWT.verifyToken, ControllerPayments.GetOrderDetails);

// API cho thanh toán Momo
router.post('/api/payment/momo', ControllerPayments.paymentMomo);
router.post('/api/momo-ipn', ControllerPayments.momoIPN);

// API cho thanh toán COD
router.post('/api/paymentcod', ControllerPayments.PaymentCod);

// API cho OTP
router.post('/api/payment/sendotp', ControllerPayments.sendPaymentOTP);
router.post('/api/payment/verifyotp', ControllerPayments.verifyPaymentOTP);

module.exports = router;
