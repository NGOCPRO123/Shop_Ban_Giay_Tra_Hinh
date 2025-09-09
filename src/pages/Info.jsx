import React from 'react';
import { Link } from 'react-router-dom';

const Info = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Hoạt Động Gần Đây</h2>
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
                            {/* Dòng 1 */}
                            <tr className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">682ff95</td>
                                <td className="py-2 px-4 border">phamcongthe12345@gmail.com</td>
                                <td className="py-2 px-4 border">Giày Chạy Bộ Trẻ Em HOKA Clifton 9 Youth - Trắng</td>
                                <td className="py-2 px-4 border">36</td>
                                <td className="py-2 px-4 border">1</td>
                                <td className="py-2 px-4 border">2.650.000đ</td>
                                <td className="py-2 px-4 border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-600">Đã Giao Thành Công</span>
                                        <Link 
                                            to={`/order/682ff95`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-2"
                                        >
                                            Chi tiết
                                        </Link>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border text-center">
                                    <Link 
                                        to={`/order/682ff95`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>

                            {/* Dòng 2 */}
                            <tr className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">682ffcc</td>
                                <td className="py-2 px-4 border">phamcongthe12345@gmail.com</td>
                                <td className="py-2 px-4 border">Giày Sneaker Nữ Puma Rebound V6 Low - Hồng</td>
                                <td className="py-2 px-4 border">36</td>
                                <td className="py-2 px-4 border">1</td>
                                <td className="py-2 px-4 border">1.700.000đ</td>
                                <td className="py-2 px-4 border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600">Người Bán Đang Chuẩn Bị Hàng</span>
                                        <Link 
                                            to={`/order/682ffcc`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-2"
                                        >
                                            Chi tiết
                                        </Link>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border text-center">
                                    <Link 
                                        to={`/order/682ffcc`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>

                            {/* Dòng 3 */}
                            <tr className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">6830170</td>
                                <td className="py-2 px-4 border">phamcongthe12345@gmail.com</td>
                                <td className="py-2 px-4 border">Giày Sneaker Nam Nike Court Vision Low Next Nature - Trắng</td>
                                <td className="py-2 px-4 border">40</td>
                                <td className="py-2 px-4 border">1</td>
                                <td className="py-2 px-4 border">2.099.000đ</td>
                                <td className="py-2 px-4 border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-600">Đã Giao Thành Công</span>
                                        <Link 
                                            to={`/order/6830170`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-2"
                                        >
                                            Chi tiết
                                        </Link>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border text-center">
                                    <Link 
                                        to={`/order/6830170`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Info; 