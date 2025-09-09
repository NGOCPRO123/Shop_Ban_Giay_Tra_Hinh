import classNames from 'classnames/bind';
import styles from '../Styles/Slider.module.scss';

const cx = classNames.bind(styles);

function Slider() {
    return (
        <div className={cx('wrapper')}>
            <div id={cx('slider')}>
                <img src="https://i1252.photobucket.com/albums/hh579/Shopburin/banner01_zpsddaf983d.jpg" alt="" />
            </div>
            <div className={cx('container')}>
                <div className={cx('box')}>
                    <img
                        src="//theme.hstatic.net/200000940675/1001304908/14/policies_icon_1.png?v=187"
                        alt=""
                    />
                    <div id={cx('info')}>
                        <span style={{ fontWeight: '800' }}>Miễn phí vận chuyển</span>
                        <span>Cho đơn hàng từ 800k</span>
                    </div>
                </div>

                <div className={cx('box')}>
                    <img
                        src="//theme.hstatic.net/200000940675/1001304908/14/policies_icon_2.png?v=187"
                        alt=""
                    />
                    <div id={cx('info')}>
                        <span style={{ fontWeight: '800' }}>Bảo hành 6 tháng</span>
                        <span>15 ngày đổi trả</span>
                    </div>
                </div>

                <div className={cx('box')}>
                    <img
                        src="//theme.hstatic.net/200000940675/1001304908/14/policies_icon_3.png?v=187"
                        alt=""
                    />
                    <div id={cx('info')}>
                        <span style={{ fontWeight: '800' }}>Thanh toán COD</span>
                        <span>Yên tâm mua sắm</span>
                    </div>
                </div>

                <div style={{ borderRight: 'none' }} className={cx('box')}>
                    <img
                        src="//theme.hstatic.net/200000940675/1001304908/14/policies_icon_4.png?v=187"
                        alt=""
                    />
                    <div id={cx('info')}>
                        <span style={{ fontWeight: '800' }}>Hotline: 0123456789</span>
                        <span>Hỗ trợ bạn 24/7</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Slider;
