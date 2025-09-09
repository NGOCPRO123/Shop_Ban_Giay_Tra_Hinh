import axios from 'axios';
import {
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    CLEAR_ERRORS
} from '../constants/reviewConstants';

// Tạo đánh giá mới
export const createReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_REVIEW_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post('/api/v1/review/new', reviewData, config);

        dispatch({
            type: CREATE_REVIEW_SUCCESS,
            payload: data.review
        });

    } catch (error) {
        dispatch({
            type: CREATE_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
};

// Lấy danh sách đánh giá của sản phẩm
export const getProductReviews = (productId) => async (dispatch) => {
    try {
        dispatch({ type: GET_REVIEWS_REQUEST });

        const { data } = await axios.get(`/api/v1/reviews?productId=${productId}`);

        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        });

    } catch (error) {
        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        });
    }
};

// Xóa đánh giá
export const deleteReview = (reviewId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });

        const { data } = await axios.delete(`/api/v1/review?reviewId=${reviewId}`);

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        });

    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
}; 