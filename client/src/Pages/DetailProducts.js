import classNames from 'classnames/bind';
import styles from '../Styles/DetailProducts.module.scss';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import request from '../Config/api';

import { useEffect, useState } from 'react';
import addToCartProduct from '../utils/HandleCart/AddToCart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Navbar';

import CardBody from '../Components/CardBody';
import Slider from 'react-slick';
import SelectSize from '../utils/SelectSize/SelectSize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faRulerHorizontal } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

import cookies from 'js-cookie';

const cx = classNames.bind(styles);

function DetailProducts() {
    const location = useLocation();

    const id = location.pathname.split('/')[2];
    const nameProduct = window.location.pathname.split('/')[3];

    const [dataProduct, setDataProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectImg, setSelectImg] = useState(0);
    const [selectSize, setSelectSize] = useState('');
    const [checkType, setCheckType] = useState(0);
    const [lengthCart, setLengthCart] = useState(0);

    const token = cookies.get('logged');

    const [show, setShow] = useState(false);

    const [similarProduct, setSimilarProduct] = useState([]);

    const { getCart } = useStore();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                return;
            }

            const res = await request.get('/api/cart');
            res.data.map((item) => setLengthCart(item.products.length));
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        const newNameProduct = nameProduct.slice(0, 16);
        request
            .get('/api/similarproduct', { params: { nameProduct: newNameProduct } })
            .then((res) => setSimilarProduct(res.data));
    }, [dataProduct, nameProduct]);

    useEffect(() => {
        dataProduct.map((item) =>
            item.type === 1 ? setCheckType(1) : item.type === 2 ? setCheckType(2) : setCheckType(3),
        );
    }, [dataProduct]);

    useEffect(() => {
        request
            .get('/api/product', {
                params: { id },
            })
            .then((res) => setDataProduct(res.data));
    }, [id]);

    useEffect(() => {
        if (quantity < 1) {
            setQuantity(1);
        }
    }, [quantity]);

    const handleImgClick = (index) => {
        setSelectImg(index);
    };

    const handleAddProduct = async (props) => {
        if (token !== "1") {
            return toast.error('Bạn Cần Đăng Nhập Trước !!!');
        }
        try {
            const data = await addToCartProduct(props, quantity, selectSize);
          
            
            await getCart();
            toast.success(data.message);

        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 0,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0,
                    centerMode: true,
                    centerPadding: '20px',
                },
            },
        ],
    };

    const handleShowSelectSzie = () => {
        setShow(!show);
    };

    const onNextImg = () => {
        if (selectImg < dataProduct[0].img.length - 1) {
            setSelectImg(selectImg + 1);
        } else {
            setSelectImg(0);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header>
                <Header lengthCart={lengthCart} />
            </header>

            <main className={cx('main')}>
                <Navbar props={dataProduct} />
                {dataProduct.map((item) => (
                    <div key={item.id} className={cx('form-product')}>
                        <div className={cx('img-product')}>
                            <div className={cx('img-small')}>
                                {item.img.map((item2, index) => (
                                    <img
                                        className={cx({ active: index === selectImg })}
                                        key={index}
                                        onClick={() => handleImgClick(index)}
                                        src={`${process.env.REACT_APP_IMG}/${item2}`}
                                        alt=""
                                    />
                                ))}
                            </div>

                            <img
                                className={cx('img')}
                                src={`${process.env.REACT_APP_IMG}/${item.img[selectImg]}`}
                                alt=""
                            />
                            <button onClick={onNextImg} id={cx('btn-1')}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>
                            <button onClick={onNextImg} id={cx('btn-2')}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </button>
                        </div>
                        <div className={cx('info-product')}>
                            <div className={cx('title-product')}>
                                <h2>{item.name}</h2>
                                <span>{item.price.toLocaleString()} đ</span>
                            </div>
                            <div className={cx('select-size')}>
                                <div onClick={handleShowSelectSzie} className={cx('btn-select')}>
                                    <button>
                                        <FontAwesomeIcon icon={faRulerHorizontal} /> HƯỚNG DẪN CHỌN SIZE
                                    </button>
                                    <div>
                                        <SelectSize dataProduct={dataProduct} show={show} setShow={setShow} />
                                    </div>
                                </div>
                                {checkType === 1 ? (
                                    <div className={cx('select-size')}>
                                        <span>Kích Cỡ : {selectSize}</span>
                                        <div className={cx('form-size')}>
                                            <div
                                                onClick={() => setSelectSize('39')}
                                                className={cx(selectSize === '39' ? 'active' : '')}
                                            >
                                                <button>39</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('40')}
                                                className={cx(selectSize === '40' ? 'active' : '')}
                                            >
                                                <button>40</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('41')}
                                                className={cx(selectSize === '41' ? 'active' : '')}
                                            >
                                                <button>41</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('42')}
                                                className={cx(selectSize === '42' ? 'active' : '')}
                                            >
                                                <button>42</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('43')}
                                                className={cx(selectSize === '43' ? 'active' : '')}
                                            >
                                                <button>43</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('44')}
                                                className={cx(selectSize === '44' ? 'active' : '')}
                                            >
                                                <button>44</button>
                                            </div>

                                            <div
                                                onClick={() => setSelectSize('45')}
                                                className={cx(selectSize === '45' ? 'active' : '')}
                                            >
                                                <button>45</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : checkType === 2 ? (
                                    <div className={cx('select-size')}>
                                        <span>Kích Cỡ : {selectSize}</span>
                                        <div className={cx('form-size')}>
                                            <div
                                                onClick={() => setSelectSize('35')}
                                                className={cx(selectSize === '35' ? 'active' : '')}
                                            >
                                                <button>35</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('36')}
                                                className={cx(selectSize === '36' ? 'active' : '')}
                                            >
                                                <button>36</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('37')}
                                                className={cx(selectSize === '37' ? 'active' : '')}
                                            >
                                                <button>37</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('38')}
                                                className={cx(selectSize === '38' ? 'active' : '')}
                                            >
                                                <button>38</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('39')}
                                                className={cx(selectSize === '39' ? 'active' : '')}
                                            >
                                                <button>39</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={cx('select-size')}>
                                        <span>Kích Cỡ : {selectSize}</span>
                                        <div className={cx('form-size')}>
                                            <div
                                                onClick={() => setSelectSize('34')}
                                                className={cx(selectSize === '34' ? 'active' : '')}
                                            >
                                                <button>34</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('35')}
                                                className={cx(selectSize === '35' ? 'active' : '')}
                                            >
                                                <button>35</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('36')}
                                                className={cx(selectSize === '36' ? 'active' : '')}
                                            >
                                                <button>36</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('37')}
                                                className={cx(selectSize === '37' ? 'active' : '')}
                                            >
                                                <button>37</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('38')}
                                                className={cx(selectSize === '38' ? 'active' : '')}
                                            >
                                                <button>38</button>
                                            </div>
                                            <div
                                                onClick={() => setSelectSize('39')}
                                                className={cx(selectSize === '39' ? 'active' : '')}
                                            >
                                                <button>39</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className={cx('form-quantity')}>
                                    <button onClick={() => setQuantity(quantity - 1)}>-</button>
                                    <input id={cx('quantity')} value={quantity} />
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            </div>
                            {token === '1' &&
                            <div className={cx('btn-add-cart')}>
                            <button onClick={() => handleAddProduct(item)}>Thêm Vào Giỏ Hàng</button>
                            </div>
                            }
                           
                            <div className={cx('container')}>
                                <div className={cx('box')}>
                                    <img
                                        src="https://i0.wp.com/peaksport.vn/wp-content/uploads/2023/11/icon-3.png?resize=40%2C41&ssl=1"
                                        alt=""
                                    />
                                    <div id={cx('info')}>
                                        <span style={{ fontWeight: '800' }}>Miễn phí vận chuyển</span>
                                        <span>Cho đơn hàng từ 800k</span>
                                    </div>
                                </div>

                                <div className={cx('box')}>
                                    <img
                                        src="https://i0.wp.com/peaksport.vn/wp-content/uploads/2023/11/icon.png?resize=40%2C41&ssl=1"
                                        alt=""
                                    />
                                    <div id={cx('info')}>
                                        <span style={{ fontWeight: '800' }}>Bảo hành 6 tháng</span>
                                        <span>15 ngày đổi trả</span>
                                    </div>
                                </div>

                                <div className={cx('box')}>
                                    <img
                                        src="https://i0.wp.com/peaksport.vn/wp-content/uploads/2023/11/icon-1-1.png?resize=40%2C41&ssl=1"
                                        alt=""
                                    />
                                    <div id={cx('info')}>
                                        <span style={{ fontWeight: '800' }}>Thanh toán COD</span>
                                        <span>Yên tâm mua sắm</span>
                                    </div>
                                </div>

                                <div className={cx('box')}>
                                    <img
                                        src="https://i0.wp.com/peaksport.vn/wp-content/uploads/2023/11/icon-2-1.png?resize=40%2C41&ssl=1"
                                        alt=""
                                    />
                                    <div id={cx('info')}>
                                        <span style={{ fontWeight: '800' }}>Hotline: 0866550286</span>
                                        <span>Hỗ trợ bạn 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {dataProduct.map((item) => (
                    <div className={cx('description')}>
                        <div>
                            <h2>THÔNG TIN SẢN PHẨM</h2>
                        </div>
                        <div key={item._id} dangerouslySetInnerHTML={{ __html: item?.description }} />
                    </div>
                ))}

                <div>
                    <div>
                        <h4>SẢN PHẨM TƯƠNG TỰ</h4>
                    </div>
                    <div>
                        <Slider {...settings}>
                            {similarProduct.slice(0, 8).map((item) => (
                                <div key={item?._id}>
                                    <div>
                                        <CardBody item={item} />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default DetailProducts;
