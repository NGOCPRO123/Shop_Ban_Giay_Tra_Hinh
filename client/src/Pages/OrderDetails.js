import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import request from '../Config/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderDetails() {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await request.get(`/api/order/${id}`);
                setOrderDetails(response.data);
                setLoading(false);
            } catch (error) {
                toast.error('Không thể tải thông tin đơn hàng');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return <div className="text-center">Không tìm thấy thông tin đơn hàng</div>;
    }

    return (
        <div className="container my-4">
            <h2 className="mb-4">Chi Tiết Đơn Hàng</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Thông Tin Đơn Hàng #{orderDetails._id}</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Người Đặt:</strong> {orderDetails.username}</p>
                            <p><strong>Số Điện Thoại:</strong> {orderDetails.phone}</p>
                            <p><strong>Địa Chỉ:</strong> {orderDetails.address}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Tổng Tiền:</strong> {orderDetails.sumprice?.toLocaleString()} đ</p>
                            <p><strong>Trạng Thái:</strong> {
                                orderDetails.tinhtrang 
                                    ? 'Đã Giao Thành Công'
                                    : orderDetails.trangthai
                                        ? 'Đang Vận Chuyển'
                                        : 'Chuẩn Bị Hàng'
                            }</p>
                        </div>
                    </div>

                    <h6 className="mt-4">Sản Phẩm Đã Đặt</h6>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Size</th>
                                    <th>Số Lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.products?.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.nameProduct}</td>
                                        <td>{product.size}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price?.toLocaleString()} đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails; 