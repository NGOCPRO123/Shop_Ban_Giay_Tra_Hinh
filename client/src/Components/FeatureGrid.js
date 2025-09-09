import classNames from 'classnames/bind';
import styles from '../Styles/FeatureGrid.module.scss';

const cx = classNames.bind(styles);

function FeatureGrid() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <h2>MÔN THỂ THAO YÊU THÍCH </h2>
                <div className={cx('img-grid')}>
                    <div className={cx('img-item')}>
                        <img
                            src="//supersports.com.vn/cdn/shop/files/HP_SPORT__Running_VN.png?v=1739434552&width=3527"
                            alt=""
                        />
                    </div>

                    <div className={cx('img-item')}>
                        <img
                            src="//supersports.com.vn/cdn/shop/files/HP_SPORT_Fashion_VN.png?v=1731901461&width=632"
                            alt=""
                        />
                    </div>

                    <div className={cx('img-item')}>
                        <img
                            src="//supersports.com.vn/cdn/shop/files/HP_SPORT_Fitness_VN.png?v=1731901461&width=632"
                            alt=""
                        />
                    </div>

                    <div className={cx('img-item')}>
                        <img
                            src="//supersports.com.vn/cdn/shop/files/HP_SPORT_Football_VN.png?v=1732251406&width=632"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureGrid;
