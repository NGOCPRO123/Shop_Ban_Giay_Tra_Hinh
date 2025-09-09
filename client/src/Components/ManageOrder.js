import classNames from 'classnames/bind';
import styles from '../Styles/ManageOrder.module.scss';
import Pagination from './Pagination';

import { useEffect, useState, useCallback } from 'react';
import request from '../Config/api';
import ModalEditOrder from '../utils/Modal/ModalEditOrder';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCancelOrder from '../utils/Modal/CancelOrder';

import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Import locale tiếng Việt
import relativeTime from 'dayjs/plugin/relativeTime'; // Plugin để hiển thị thời gian tương đối
import utc from 'dayjs/plugin/utc'; // Plugin để xử lý UTC
import timezone from 'dayjs/plugin/timezone'; // Plugin để xử lý timezone

// Cấu hình dayjs
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // Sử dụng locale tiếng Việt
dayjs.tz.setDefault('Asia/Ho_Chi_Minh'); // Đặt timezone mặc định là Việt Nam

const cx = classNames.bind(styles);

function ManageOrder() {
    const [dataCart, setDataCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [idPro, setIdPro] = useState(0);
    const [address, setAddress] = useState('');
    const [showModalCancelOrder, setShowModalCancelOrder] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Tách hàm fetchData ra để có thể tái sử dụng
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const cartResponse = await request.get('api/getallorder');
            setDataCart(cartResponse.data);
            setFilteredOrders(cartResponse.data);
        } catch (error) {
            toast.error('Không thể tải dữ liệu đơn hàng');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Thêm useEffect để lọc đơn hàng theo số điện thoại
    useEffect(() => {
        const filtered = dataCart.filter(order => {
            const orderPhone = order.phone ? order.phone.toString() : '';
            const searchTermCleaned = searchTerm.replace(/^0+/, ''); // Bỏ số 0 ở đầu nếu có
            return orderPhone.includes(searchTermCleaned);
        });
        setFilteredOrders(filtered);
        setPage(1); // Reset về trang 1 khi tìm kiếm
    }, [searchTerm, dataCart]);

    const [page, setPage] = useState(1);
    const productsPerPage = 5;
    const startIndex = (page - 1) * productsPerPage;
    const totalPages = Math.ceil(filteredOrders.length / productsPerPage);
    const currentProducts = filteredOrders.slice(startIndex, startIndex + productsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleShowModalEdit = (id, address1) => {
        setShowModal(true);
        setIdPro(id);
        setAddress(address1);
    };

    const handleShowModalCancelOrder = (item) => {
        setSelectedProduct(item);
        setShowModalCancelOrder(true);
    };

    const handleOrderSuccess = () => {
        fetchData(); // Refresh dữ liệu sau khi cập nhật thành công
    };

    // Hàm format thời gian
    const formatOrderTime = (timestamp) => {
        const orderTime = dayjs(timestamp).tz('Asia/Ho_Chi_Minh');
        const now = dayjs().tz('Asia/Ho_Chi_Minh');
        
        // Nếu là ngày hôm nay
        if (orderTime.isSame(now, 'day')) {
            return `Hôm nay, ${orderTime.format('HH:mm')}`;
        }
        
        // Nếu là ngày hôm qua
        if (orderTime.isSame(now.subtract(1, 'day'), 'day')) {
            return `Hôm qua, ${orderTime.format('HH:mm')}`;
        }
        
        // Các ngày khác
        return orderTime.format('HH:mm, DD/MM/YYYY');
    };

    return (
        <div className={cx('manage-product')}>
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontSize: '25px' }}>Quản Lý Đơn Hàng</h2>
                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => {
                            // Chỉ cho phép nhập số
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setSearchTerm(value);
                        }}
                    />
                    {searchTerm && (
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered border-primary">
                        <thead style={{ border: 'inherit' }} className="table-light">
                            <tr>
                                <th scope="col">Người Dùng</th>
                                <th scope="col">Số Điện Thoại</th>
                                <th scope="col">Địa Chỉ</th>
                                <th scope="col">Tên Đơn Hàng</th>
                                <th scope="col">Size</th>
                                <th scope="col">Số Lượng</th>
                                <th scope="col">Tổng Giá Tiền</th>
                                <th scope="col">Thời gian đặt hàng</th>
                                <th scope="col">Tình Trạng</th>
                                <th scope="col">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((item) =>
                                item.products.map((item2, index) => (
                                    <tr key={item2._id}>
                                        {index === 0 && (
                                            <td rowSpan={item.products.length}>{item.username}</td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={item.products.length}>{item.phone}</td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={item.products.length}>{item.address}</td>
                                        )}
                                        <td>{item2.nameProduct}</td>
                                        <td>{item2.size}</td>
                                        <td>{item2.quantity}</td>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={item.products.length}>{item.sumprice.toLocaleString()} đ</td>
                                                <td rowSpan={item.products.length}>
                                                    {formatOrderTime(item.createdAt)}
                                                </td>
                                                <td rowSpan={item.products.length}>
                                                    {item.tinhtrang 
                                                        ? 'Đã Giao Thành Công' 
                                                        : item.trangthai 
                                                            ? 'Đang Vận Chuyển'
                                                            : 'Chuẩn Bị Hàng'}
                                                </td>
                                                <td rowSpan={item.products.length}>
                                                    <button
                                                        onClick={() => handleShowModalEdit(item._id, item.address)}
                                                        className="btn btn-primary"
                                                        style={{ marginRight: '10px' }}
                                                        disabled={item.tinhtrang} // Disable nút nếu đã giao hàng
                                                    >
                                                        Xác Nhận
                                                    </button>
                                                    <button
                                                        onClick={() => handleShowModalCancelOrder(item._id)}
                                                        className="btn btn-danger"
                                                        disabled={item.tinhtrang} // Disable nút nếu đã giao hàng
                                                    >
                                                        Hủy
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="text-center mt-3">
                            <p>Không tìm thấy đơn hàng nào</p>
                        </div>
                    )}
                    <div className={cx('pagination')}>
                        <Pagination page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
                    </div>
                </div>
            )}
            <ModalEditOrder 
                show={showModal} 
                setShow={setShowModal} 
                id={idPro} 
                address={address} 
                onSuccess={handleOrderSuccess}
            />
            <ModalCancelOrder 
                show={showModalCancelOrder} 
                setShow={setShowModalCancelOrder} 
                item={selectedProduct}
                onSuccess={handleOrderSuccess}
            />
        </div>
    );
}

export default ManageOrder;
