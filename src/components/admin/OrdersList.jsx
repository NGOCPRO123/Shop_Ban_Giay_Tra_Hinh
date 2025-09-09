import React from 'react';
import { Link } from 'react-router-dom';

const OrdersList = ({ orders }) => {
    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Hoạt Động Gần Đây</h2>
            <table className="min-w-full bg-white border">
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
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border">{order._id}</td>
                            <td className="py-2 px-4 border">{order.email}</td>
                            <td className="py-2 px-4 border">{order.productName}</td>
                            <td className="py-2 px-4 border">{order.size}</td>
                            <td className="py-2 px-4 border">{order.quantity}</td>
                            <td className="py-2 px-4 border">{order.totalPrice?.toLocaleString('vi-VN')}đ</td>
                            <td className={`py-2 px-4 border ${
                                order.orderStatus === 'Đã Giao Thành Công' ? 'text-green-600' :
                                order.orderStatus === 'Người Bán Đang Chuẩn Bị Hàng' ? 'text-blue-600' :
                                'text-gray-600'
                            }`}>
                                {order.orderStatus}
                            </td>
                            <td className="py-2 px-4 border">
                                <Link 
                                    to={`/order/${order._id}`}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Xem chi tiết
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersList; 