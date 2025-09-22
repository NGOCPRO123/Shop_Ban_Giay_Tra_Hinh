import classNames from 'classnames/bind';
import styles from '../Styles/Payments.module.scss';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import axios from 'axios';
import request, { requestPaymentVNPAY, requestUpdateInfoCart, requestSendOTP, requestVerifyOTP } from '../Config/api';
import OTPModal from '../Components/OTPModal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const cx = classNames.bind(styles);

function Payments() {
    const [dataCart, setDataCart] = useState([]);
    const [tinhthanh, setTinhThanh] = useState([]);
    const [idTinhThanh, setIdTinhThanh] = useState(0);
    const [selectedTinhThanh, setSelectedTinhThanh] = useState('');
    const [huyen, setHuyen] = useState([]);
    const [idHuyen, setIdHuyen] = useState(0);
    const [selectedHuyen, setSelectedHuyen] = useState('');
    const [xa, setXa] = useState([]);
    const [selectedXa, setSelectedXa] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [dataProducts, setDataProducts] = useState([]);
    const [dataLengthProducts, setDataLengthProducts] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // State cho OTP Modal
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Nếu có ít nhất một trường thông tin, mới tiến hành gửi request
                if (name || phone || address) {
                    console.log('Đang cập nhật thông tin giỏ hàng:', { name, phone, address });
                    const data = {
                        name,
                        phone,
                        address,
                    };
                    const res = await requestUpdateInfoCart(data);
                    console.log('Kết quả cập nhật:', res);
                }
            } catch (error) {
                console.log('Lỗi cập nhật thông tin giỏ hàng:', error?.response?.data || error);
            }
        };

        // Thêm một khoảng thời gian debounce để tránh gửi quá nhiều request
        const debounceTimeout = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [name, phone, address]);

    const navigate = useNavigate();

    const { getCart } = useStore();

    const totalProduct = useMemo(() => {
        const total = dataCart.map((item) => item.sumprice);
        return total[0];
    }, [dataCart]);

    useEffect(() => {
        axios.get('https://esgoo.net/api-tinhthanh/1/0.htm').then((res) => setTinhThanh(res.data.data));
    }, []);

    useEffect(() => {
        if (idTinhThanh !== 0) {
            axios.get(`https://esgoo.net/api-tinhthanh/2/${idTinhThanh}.htm`).then((res) => setHuyen(res.data.data));
        }
    }, [idTinhThanh]);

    useEffect(() => {
        if (idHuyen !== 0) {
            axios.get(`https://esgoo.net/api-tinhthanh/3/${idHuyen}.htm`).then((res) => setXa(res.data.data));
        }
    }, [idHuyen]);

    useEffect(() => {
        const newDataProducts = dataCart?.map((item) => item.products);
        setDataProducts(newDataProducts[0]);
    }, [dataCart]);

    useEffect(() => {
        // Combine address components when any part changes
        const fullAddress = [specificAddress, selectedXa, selectedHuyen, selectedTinhThanh].filter(Boolean).join(', ');

        if (fullAddress) {
            setAddress(fullAddress);
            console.log('Full address:', fullAddress); // For debugging
        }
    }, [specificAddress, selectedXa, selectedHuyen, selectedTinhThanh]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    useEffect(() => {
        request.get('/api/cart').then((res) => setDataCart(res.data));
    }, []);

    // Kiểm tra thông tin đầy đủ trước khi thanh toán
    const validatePaymentInfo = () => {
        if (!name) {
            toast.error('Vui lòng nhập họ tên');
            return false;
        }
        if (!phone) {
            toast.error('Vui lòng nhập số điện thoại');
            return false;
        }
        if (!email) {
            toast.error('Vui lòng nhập email');
            return false;
        }
        if (!address || !selectedTinhThanh || !selectedHuyen || !selectedXa || !specificAddress) {
            toast.error('Vui lòng nhập đầy đủ địa chỉ');
            return false;
        }
        return true;
    };

    // Gửi OTP đến email người dùng
    const handleSendOTP = async () => {
        if (!validatePaymentInfo()) {
            return;
        }

        try {
            setIsOtpVerifying(true);
            const response = await requestSendOTP({ email });
            toast.info(response.message);
            setShowOTPModal(true);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Không thể gửi OTP, vui lòng thử lại');
        } finally {
            setIsOtpVerifying(false);
        }
    };

    // Xác thực OTP và tiến hành thanh toán
    const handleVerifyOTP = async (otp) => {
        try {
            setIsOtpVerifying(true);
            const paymentData = {
                otp,
                email, // Thêm email vào request để đảm bảo tính nhất quán
                name,
                phone,
                address,
                paymentMethod,
                products: dataProducts,
                totalAmount: totalProduct,
            };
            const response = await requestVerifyOTP(paymentData);
            toast.success(response.message);
            setShowOTPModal(false);

            // Chuyển hướng đến trang thành công sau khi xác thực OTP
            await getCart();
            navigate('/paymentsuccess');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Mã OTP không hợp lệ');
        } finally {
            setIsOtpVerifying(false);
        }
    };

    const handlePayment = async () => {
        if (!validatePaymentInfo()) {
            return;
        }

        try {
            if (paymentMethod === 'Momo') {
                const res = await request.post('/api/payment/momo', {
                    dataProducts,
                    address,
                    name,
                    phone,
                    email,
                });
                if (res.data.payUrl) {
                    window.location.href = res.data.payUrl;
                } else {
                    toast.error('Không thể tạo liên kết thanh toán Momo');
                }
            } else if (paymentMethod === 'VNPAY') {
                const res = await requestPaymentVNPAY();
                window.open(res.vnpayResponse);
                console.log(res);
            } else if (paymentMethod === 'COD') {
                // Thay vì gọi API thanh toán trực tiếp, bây giờ gửi OTP trước
                handleSendOTP();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán');
        }
    };

    useEffect(() => {
        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = dataCart?.reduce((total, cartItem) => {
            return total + cartItem.products.reduce((sum, product) => sum + product.quantity, 0);
        }, 0);

        // Cập nhật lại số lượng sản phẩm
        setDataLengthProducts(totalQuantity);
    }, [dataCart]); // Chạy lại khi dataCart thay đổi

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header>
                <Header />
            </header>

            <main className={cx('main')}>
                <h2>Thanh toán</h2>
                <div className={cx('form-payments')}>
                    <div className={cx('column-left')}>
                        <h3>THÔNG TIN THANH TOÁN</h3>
                        <div className={cx('form-1')}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingName"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="floatingName">Họ và tên *</label>
                            </div>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingPassword"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <label htmlFor="floatingPassword">Số điện thoại *</label>
                            </div>
                        </div>

                        <div>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingEmail"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="floatingEmail">Địa chỉ email *</label>
                            </div>
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setIdTinhThanh(value);
                                    if (value !== '0') {
                                        const selected = tinhthanh.find((item) => item.id.toString() === value);
                                        setSelectedTinhThanh(selected ? selected.name : '');
                                        console.log('Selected tinh/thanh:', selected?.name); // For debugging
                                    } else {
                                        setSelectedTinhThanh('');
                                    }
                                }}
                            >
                                <option value="0">Tỉnh/Thành</option>
                                {tinhthanh.map((item) => (
                                    <option key={item.id} value={item.id.toString()}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setIdHuyen(value);
                                    if (value !== '0') {
                                        const selected = huyen.find((item) => item.id.toString() === value);
                                        setSelectedHuyen(selected ? selected.name : '');
                                        console.log('Selected huyen:', selected?.name); // For debugging
                                    } else {
                                        setSelectedHuyen('');
                                    }
                                }}
                                className="form-select mt-3"
                                aria-label="Default select example"
                            >
                                <option value="0">Quận/Huyện</option>
                                {huyen.map((item) => (
                                    <option key={item.id} value={item.id.toString()}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select mt-3"
                                aria-label="Default select example"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value !== '0') {
                                        const selected = xa.find((item) => item.id.toString() === value);
                                        setSelectedXa(selected ? selected.name : '');
                                        console.log('Selected xa:', selected?.name); // For debugging
                                    } else {
                                        setSelectedXa('');
                                    }
                                }}
                            >
                                <option value="0">Xã/Phường/Thị trấn</option>
                                {xa.map((item) => (
                                    <option key={item.id} value={item.id.toString()}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="form-floating mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingAddress"
                                    onChange={(e) => setSpecificAddress(e.target.value)}
                                />
                                <label htmlFor="floatingAddress">Địa Chỉ *</label>
                            </div>
                        </div>

                        <div className="form-floating mt-3">
                            <textarea
                                style={{ height: '100px' }}
                                className="form-control"
                                placeholder="Leave a comment here"
                                id="floatingTextarea"
                            ></textarea>
                            <label htmlFor="floatingTextarea">Ghi Chú Đơn Hàng</label>
                        </div>

                        <div className={cx('select-payment')}>
                            <h4>PHƯƠNG THỨC THANH TOÁN</h4>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    id="flexRadioDefault1"
                                    onChange={handlePaymentMethodChange}
                                    checked={paymentMethod === 'COD'}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Thanh Toán Khi Nhận Hàng
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    value="Momo"
                                    id="flexRadioDefault2"
                                    onChange={handlePaymentMethodChange}
                                    checked={paymentMethod === 'Momo'}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Thanh Toán Qua Ví MoMo
                                </label>
                            </div>

                            <div onClick={handlePayment} className={cx('btn-payment')}>
                                <button id={cx('btn-buy')} disabled={isOtpVerifying}>
                                    {isOtpVerifying ? 'Đang xử lý...' : 'Hoàn Tất Đơn Hàng'}
                                </button>
                            </div>
                        </div>

                        <div></div>
                    </div>
                    <div className={cx('total-product')}>
                        <h3>TỔNG CỘNG | {dataLengthProducts} SẢN PHẨM</h3>
                        <div>
                            <table className="table table-bordered border-primary">
                                <thead>
                                    <tr>
                                        <th scope="col">Tạm tính</th>
                                        <th scope="col">{totalProduct?.toLocaleString()}đ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Phí Vận Chuyển</td>
                                        <td>Miễn phí vận chuyển</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng Cộng</td>
                                        <th>{totalProduct?.toLocaleString()}đ</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={cx('img-product')}>
                            <h4>SẢN PHẨM ĐÃ ĐẶT HÀNG</h4>
                            <div className={cx('img')}>
                                {dataProducts?.map((item) => (
                                    <img
                                        key={item._id}
                                        src={`${process.env.REACT_APP_IMG}/${item.img}`}
                                        alt={item.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>

            {/* Modal xác thực OTP */}
            <OTPModal
                show={showOTPModal}
                onHide={() => setShowOTPModal(false)}
                onVerify={handleVerifyOTP}
                resendOTP={handleSendOTP}
            />
        </div>
    );
}

export default Payments;
