import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews } from '../../actions/reviewActions';
import ReviewsList from '../Review/ReviewsList';
import Loader from '../layout/Loader';

const ProductReviews = ({ productId }) => {
    const dispatch = useDispatch();
    const { loading, reviews } = useSelector(state => state.productReviews);

    useEffect(() => {
        if (productId) {
            dispatch(getProductReviews(productId));
        }
    }, [dispatch, productId]);

    if (loading) return <Loader />;

    return (
        <div className="mt-8">
            <ReviewsList reviews={reviews} />
        </div>
    );
};

export default ProductReviews; 