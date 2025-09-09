import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrderDetails } from '../../actions/orderActions';
import Loader from '../layout/Loader';
import OrderReviewButton from './OrderReviewButton';

const OrderDetails = ({ match }) => {
    const dispatch = useDispatch();
    const { loading, order = {} } = useSelector(state => state.orderDetails);
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;

    useEffect(() => {
        dispatch(getOrderDetails(match.params.id));
    }, [dispatch, match.params.id]);

    const isDelivered = orderStatus === 'Delivered';

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded';

    return (
        <>
            {loading ? <Loader /> : (
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">
                        Đơn hàng #{order._id}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                <h2 className="text-xl font-semibold mb-4">Thông tin vận chuyển</h2>
                                <p><strong>Tên:</strong> {user && user.name}</p>
                                <p><strong>SĐT:</strong> {shippingInfo && shippingInfo.phoneNo}</p>
                                <p><strong>Địa chỉ:</strong> {shippingDetails}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
                                <p className={isPaid ? "text-green-600" : "text-red-600"}>
                                    <strong>{isPaid ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}</strong>
                                </p>
                                <p><strong>Tổng tiền:</strong> {totalPrice?.toLocaleString('vi-VN')}đ</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>
                            <div className="space-y-4">
                                {orderItems && orderItems.map(item => (
                                    <div key={item.product} className="flex items-center border-b pb-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="ml-4 flex-grow">
                                            <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">
                                                {item.name}
                                            </Link>
                                            <p>Giá: {item.price.toLocaleString('vi-VN')}đ</p>
                                            <p>Số lượng: {item.quantity}</p>
                                            <OrderReviewButton
                                                productId={item.product}
                                                orderId={order._id}
                                                isDelivered={isDelivered}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className={`text-lg font-semibold ${
                            orderStatus === 'Delivered' ? 'text-green-600' :
                            orderStatus === 'Processing' ? 'text-blue-600' :
                            'text-red-600'
                        }`}>
                            Trạng thái đơn hàng: {orderStatus}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetails; 