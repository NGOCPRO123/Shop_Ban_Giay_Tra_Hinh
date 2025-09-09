import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../actions/orderActions';
import Loader from '../layout/Loader';

const Info = () => {
    const dispatch = useDispatch();
    const { loading, orders, error } = useSelector(state => state.myOrders);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Thông tin người dùng */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Thông tin tài khoản</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <img
                                src={user.avatar?.url || '/default-avatar.png'}
                                alt={user.name}
                                className="w-20 h-20 rounded-full"
                            />
                            <div className="ml-4">
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <div>
                            <p><strong>Ngày tham gia:</strong> {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>
                </div>

                {/* Danh sách đơn hàng */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Hoạt Động Gần Đây</h2>
                        {loading ? (
                            <Loader />
                        ) : error ? (
                            <div className="text-center text-red-500 py-4">
                                {error}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="py-2 px-4 border">ID</th>
                                            <th className="py-2 px-4 border">Email Người Dùng</th>
                                            <th className="py-2 px-4 border">Tên Sản Phẩm</th>
                                            <th className="py-2 px-4 border">Size</th>
                                            <th className="py-2 px-4 border">Số Lượng</th>
                                            <th className="py-2 px-4 border">Tổng Tiền</th>
                                            <th className="py-2 px-4 border">Trạng Thái</th>
                                            <th className="py-2 px-4 border">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.map(order => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border">{order._id}</td>
                                                <td className="py-2 px-4 border">{order.email}</td>
                                                <td className="py-2 px-4 border">{order.productName}</td>
                                                <td className="py-2 px-4 border">{order.size}</td>
                                                <td className="py-2 px-4 border">{order.quantity}</td>
                                                <td className="py-2 px-4 border">{order.totalPrice?.toLocaleString('vi-VN')}đ</td>
                                                <td className="py-2 px-4 border">
                                                    <span className={`${
                                                        order.orderStatus === 'Đã Giao Thành Công' ? 'text-green-600' :
                                                        order.orderStatus === 'Người Bán Đang Chuẩn Bị Hàng' ? 'text-blue-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4 border text-center">
                                                    <Link 
                                                        to={`/order/${order._id}`}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
                                                    >
                                                        Xem chi tiết
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {(!orders || orders.length === 0) && (
                                    <p className="text-center text-gray-500 py-4">
                                        Bạn chưa có đơn hàng nào
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Info; 