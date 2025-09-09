import classNames from 'classnames/bind';
import styles from '../Styles/Login.module.scss';
// import Header from '../Components/Header';
import request from '../Config/api';
import { useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const cx = classNames.bind(styles);

function RegisterUser() {
    const [fullname, setFullname] = useState(''); // Tạo state để lưu fullname
    const [email, setEmail] = useState(''); // Tạo state để lưu email
    const [phone, setPhone] = useState(''); // Tạo state để lưu phone
    const [password, setPassword] = useState(''); // Tạo state để lưu password
    const [confirmPassword, setConfirmPassword] = useState(''); // Tạo state để lưu confirmPassword
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang

    const handleRegister = async () => {
        // Hàm xử lý đăng ký
        try {
            // Thực hiện đăng ký
            var pattern = /[A-Z]/; // Kiểm tra xem chuỗi có chứa ký tự viết hoa hay không
            const checkEmail = pattern.test(email);

            if (fullname === '' || email === '' || password === '' || confirmPassword === '') {
                // Kiểm tra xem fullname, email, password, confirmPassword
                toast.error('Vui Lòng Xem Lại Thông Tin !!!'); // Hàm toast.error hiển thị thông báo lỗi
            } else if (checkEmail === true) {
                // Kiểm tra xem email
                toast.error('Email Không Được Viết Hoa !!!'); // Hàm toast.error hiển thị thông báo lỗi
            } else if (password !== confirmPassword) {
                // Kiểm tra xem password, confirmPassword
                toast.error('Mật Khẩu Không Trùng Khớp !!!'); // Hàm toast.error hiển thị thông báo lỗi
            } else {
                // Nếu đăng ký thành công
                const res = await request.post('/api/register', {
                    // Thực hiện đăng ký
                    fullname,
                    email,
                    password,
                    confirmPassword,
                    phone,
                }); // Gửi yêu cầu đăng ký đến server
                toast.success(res.data.message); // Hiển thị thông báo thành công
                
                // Đợi 2 giây sau khi hiển thị thông báo thành công rồi chuyển sang trang đăng nhập
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            // Nếu đăng ký thất bại
            toast.error(error.response.data.message); // Hiển thị thông báo lỗi
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className={cx('body-wrapper')}>
                <ToastContainer />
                {/* <header>
                <Header />
            </header> */}
                <div className={cx('wrapper')}>
                    <div className={cx('inner')}>
                        <div className={cx('header-form-login')}>
                            <span>Đăng ký</span>
                            <p>Đăng ký thành viên để nhận nhiều ưu đãi</p>
                        </div>
                        <div className={cx('input-box')}>
                            <div className={cx('form-input')}>
                                <label>Họ và tên</label>
                                <input placeholder="Nhập họ và tên" onChange={(e) => setFullname(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Email</label>
                                <input placeholder="Nhập email" onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Số điện thoại</label>
                                <input
                                    placeholder="Nhập số điện thoại liên hệ"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Mật khẩu</label>

                                <input
                                    placeholder="Nhập mật khẩu"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className={cx('btn-login')} onClick={handleRegister}>
                            Đăng ký
                        </button>
                        <div className={cx('login-footer')}>
                            <p>
                                Đã có tài khoản ?{' '}
                                <Link id={cx('link')} to="/login">
                                    Đăng nhập
                                </Link>{' '}
                                ngay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterUser;