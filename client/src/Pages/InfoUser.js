import classNames from 'classnames/bind';
import styles from '../Styles/InfoUser.module.scss';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import request from '../Config/api';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faMoneyCheckDollar, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function InfoUser() {
    const [dataUser, setDataUser] = useState({});
    const [dataPayments, setDataPayments] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        if (document.cookie) {
            request.get('/api/auth').then((res) => setDataUser(res.data));
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (document.cookie) {
            request.get('/api/payments').then((res) => setDataPayments(res.data));
        }
    }, []);

    const handleLogOut = () => {
        request.post('/api/logout').then((res) => {});
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <main className={cx('main')}>
                <div className={cx('info-user')}>
                    <div className={cx('inner')}>
                        <div className={cx('column-left')}>
                            <img
                                src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                alt=""
                            />
                            <div>
                                <ul>
                                    <li id={cx('name')}>{dataUser?.fullname}</li>
                                    <li>
                                        <FontAwesomeIcon id={cx('icons')} icon={faEnvelope} />
                                        {dataUser?.email}
                                    </li>
                                    <li>
                                        <FontAwesomeIcon id={cx('icons')} icon={faLock} />
                                        **********
                                    </li>
                                    <li>
                                        <FontAwesomeIcon id={cx('icons')} icon={faPhone} />0{dataUser?.phone}
                                    </li>
                                    <li>
                                        <FontAwesomeIcon id={cx('icons')} icon={faMoneyCheckDollar} />
                                        {dataUser?.surplus?.toLocaleString()} đ
                                    </li>
                                </ul>
                            </div>
                            <button onClick={handleLogOut} type="button" className="btn btn-danger">
                                Đăng Xuất
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }} className="table-responsive">
                            <h2>Hoạt Động Gần Đây</h2>
                            <table
                                style={{ marginTop: '20px', minWidth: '800px' }}
                                className="table table-bordered border-primary"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Email Người Dùng</th>
                                        <th scope="col">Tên Sản Phẩm</th>
                                        <th scope="col">Size</th>
                                        <th scope="col">Số Lượng</th>
                                        <th scope="col">Tổng Tiền</th>
                                        <th scope="col">Trạng Thái</th>
                                        <th scope="col">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPayments.map((item) => (
                                        item.products.map((item2, index) => (
                                            <tr key={`${item._id}-${index}`}>
                                                {index === 0 && (
                                                    <>
                                                        <td
                                                            style={{
                                                                overflow: 'hidden',
                                                            }}
                                                            rowSpan={item.products.length}
                                                        >
                                                            {item._id.slice(0, 7)}
                                                        </td>
                                                        <td rowSpan={item.products.length}>{item.user}</td>
                                                    </>
                                                )}
                                                <td>{item2.nameProduct}</td>
                                                <td>{item2.size}</td>
                                                <td>{item2.quantity}</td>
                                                {index === 0 && (
                                                    <>
                                                        <td rowSpan={item.products.length}>
                                                            {item.sumprice.toLocaleString()} đ
                                                        </td>
                                                        <td rowSpan={item.products.length}>
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <span className={item.tinhtrang ? 'text-success' : 'text-primary'}>
                                                                    {item.tinhtrang
                                                                        ? 'Đã Giao Thành Công'
                                                                        : 'Người Bán Đang Chuẩn Bị Hàng'}
                                                                </span>
                                                                <Link 
                                                                    to={`/order/${item._id}`}
                                                                    className="btn btn-sm btn-info ms-2"
                                                                >
                                                                    Chi tiết
                                                                </Link>
                                                            </div>
                                                        </td>
                                                        <td rowSpan={item.products.length}>
                                                            <Link 
                                                                to={`/order/${item._id}`}
                                                                className="btn btn-primary"
                                                            >
                                                                Xem chi tiết
                                                            </Link>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default InfoUser;
