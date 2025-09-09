const ProductsRoutes = require('./ProductsRoutes');
const UserRoute = require('./RoutesUser');
const ProductRoute = require('./ProductsRoutes');
const CartRoute = require('./RoutesCart');
const PaymentsRoutes = require('./RoutesPayments');

const modelUser = require('../models/ModelUser');
const { jwtDecode } = require('jwt-decode');

function route(app) {
    // products
    app.get('/api/products', ProductsRoutes);
    app.post('/api/addproduct', ProductsRoutes);
    app.get('/api/product', ProductsRoutes);
    app.get('/api/search', ProductsRoutes);
    app.post('/api/editpro', ProductsRoutes);
    app.delete('/api/deleteproduct', ProductsRoutes);
    app.post('/api/editorder', ProductRoute);
    app.get('/api/similarproduct', ProductRoute);
    app.get('/api/refresh-token', UserRoute);
    app.post('/api/edituser', UserRoute);

    // User
    app.post('/api/register', UserRoute);
    app.post('/api/login', UserRoute);
    app.get('/api/auth', UserRoute);
    app.post('/api/logout', UserRoute);
    app.post('/api/forgotpassword', UserRoute);
    app.post('/api/resetpassword', UserRoute);

    // payment
    app.post('/api/payment', PaymentsRoutes);
    app.get('/api/payments', PaymentsRoutes);
    app.get('/api/checkdata', PaymentsRoutes);
    app.get('/api/payment', PaymentsRoutes);
    app.post('/api/paymentcod', PaymentsRoutes);
    app.get('/api/dataorderuser', PaymentsRoutes);
    app.post('/api/cancelorder', PaymentsRoutes);
    app.post('/api/paymentvnpay', PaymentsRoutes);
    app.get('/api/check-payment-vnpay', PaymentsRoutes);
    
    // OTP Payment - Thêm routes mới cho OTP
    app.post('/api/payment/sendotp', PaymentsRoutes);
    app.post('/api/payment/verifyotp', PaymentsRoutes);

    // Cart
    app.post('/api/addtocart', CartRoute);
    app.get('/api/cart', CartRoute);
    app.post('/api/deletecart', CartRoute);
    app.post('/api/update-info-cart', CartRoute);

    //admin
    app.get('/api/getallorder', UserRoute);
    app.get('/api/getalluser', UserRoute);
    app.delete('/api/deleteuser', UserRoute);

    app.get('/api/admin', UserRoute);
}

module.exports = route;
