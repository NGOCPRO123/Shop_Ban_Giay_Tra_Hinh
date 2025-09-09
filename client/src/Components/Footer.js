import classNames from 'classnames/bind';
import styles from '../Styles/Footer.module.scss';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Footer() {
    const navigate = useNavigate();

    const onPage = (url) => {
        navigate(url);
    };

    return (
        <div className={cx('wrapper')}>
            <main>
                <div className={cx('inner')}>
                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>NHÀ PHÂN PHỐI ĐỘC QUYỀN</li>
                            <li>CÔNG TY CP THỜI TRANG TVVN</li>
                            <li>Trường Đại học Công nghiệp TP.HCM </li>
                            <li>0123456789</li>
                        </ul>
                    </div>

                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>DANH MỤC NỔI BẬT</li>
                            <li>Giới thiệu về TVVN STORE</li>
                            <li onClick={() => onPage('/category/giay-nam')}> Giày Nam</li>
                            <li onClick={() => onPage('/category/giay-nu')}> Giày Nữ</li>
                            <li onClick={() => onPage('/category/giay-tre-em')}>Giày Trẻ Em</li>
                        </ul>
                    </div>

                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>CHÍNH SÁCH CÔNG TY</li>
                            <li>TVVN STORE</li>
                            <li>Trường Đại học Công nghiệp TP.HCM </li>
                            <li>123456789</li>
                        </ul>
                    </div>

                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>NHÓM 5</li>
                            <li>THÀNH VIÊN</li>
                            <li>21000745-Phạm Lê Đức Ngọc</li>
                            <li>21001195-Nguyễn Vũ Hào</li>
                            <li>21003225-Phạm Quốc Phú</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Footer;
