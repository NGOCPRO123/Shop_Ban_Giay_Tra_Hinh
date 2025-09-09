import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions';
import { Rating } from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader';
import ProductReviews from './ProductReviews';

const ProductDetails = ({ match }) => {
    const dispatch = useDispatch();
    const { loading, product } = useSelector(state => state.productDetails);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));
    }, [dispatch, match.params.id]);

    const addToCart = () => {
        dispatch(addItemToCart(match.params.id, quantity));
        toast.success('Sản phẩm đã được thêm vào giỏ hàng');
    };

    const increaseQty = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hình ảnh sản phẩm */}
                <div>
                    <img
                        src={product.images && product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Thông tin sản phẩm */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <div className="flex items-center mb-4">
                        <Rating
                            value={product.ratings}
                            precision={0.5}
                            readOnly
                        />
                        <span className="ml-2 text-gray-600">
                            ({product.numOfReviews} đánh giá)
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                        {product.price?.toLocaleString('vi-VN')}đ
                    </p>
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={decreaseQty}
                            className="px-3 py-1 border rounded-lg"
                        >
                            -
                        </button>
                        <span className="text-xl">{quantity}</span>
                        <button
                            onClick={increaseQty}
                            className="px-3 py-1 border rounded-lg"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={addToCart}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded-lg text-white font-semibold ${
                            product.stock > 0
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                    </button>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    <div className="mt-4">
                        <p className="text-gray-600">
                            Trạng thái: {' '}
                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Phần đánh giá sản phẩm */}
            <ProductReviews productId={match.params.id} />
        </div>
    );
};

export default ProductDetails; 