import classNames from 'classnames/bind';
import styles from '../Styles/Login.module.scss';
// import Header from '../Components/Header';
import request from '../Config/api';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

function LoginUser() {
    const [email, setEmail] = useState(''); // Tạo state để lưu email
    const [password, setPassword] = useState(''); // Tạo state để lưu password
    const navigate = useNavigate(); // Tạo state để lưu password
    const handleLoginUser = async () => {
        try {
            if (!email || !password) {
                toast.error('Vui lòng nhập đầy đủ thông tin!');
                return;
            }
    
            // Regex kiểm tra email hợp lệ
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                toast.error('Email không hợp lệ!');
                return;
            }
    
            // Gửi yêu cầu đăng nhập
            const res = await request.post('/api/login', { email, password });
    
            toast.success(res.data.message || 'Đăng nhập thành công!');
            setTimeout(() => {
                    window.location.reload()
            }, 1000);
            navigate('/')

        } catch (error) {
            console.error("Lỗi đăng nhập:", error); // In lỗi chi tiết ra console
    
            if (error.response) {
                // Lỗi từ phía server (API phản hồi lỗi)
                toast.error(error.response.data.message || 'Lỗi từ máy chủ!');
            }  else {
                // Lỗi khác (có thể do logic phía frontend)
                toast.error('Email Hoặc Mật Không Chính Xác !!!');
            }
        }
    };
    

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
                            <span>Đăng nhập</span>
                            <p>Vui lòng đăng nhập để nhận thêm nhiều ưu đãi</p>
                        </div>
                        <div className={cx('input-box')}>
                            <div className={cx('form-input')}>
                                <label>Tên tài khoản hoặc Email đăng nhập</label>
                                <input
                                    placeholder="Nhập Tài Khoản / Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Mật khẩu</label>
                                <input
                                    placeholder="Nhập Mật Khẩu"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button className={cx('btn-login')} onClick={handleLoginUser}>
                                Đăng nhập
                            </button>

                            <div className={cx('single-input-fields')}>
                                <div>
                                    <input type="checkbox" />
                                    <label>Duy trì đăng nhập</label>
                                </div>
                                <Link to={'/forgotPassword'}>Quên mật khẩu?</Link>
                            </div>
                        </div>
                        <div className={cx('login-footer')}>
                            <p className="mb-0">
                                Bạn chưa có tài khoản ?{' '}
                                <Link id={cx('link')} to="/register">
                                    Đăng ký
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

export default LoginUser;
