import {
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAIL,
    CREATE_REVIEW_RESET,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    DELETE_REVIEW_RESET,
    CLEAR_ERRORS
} from '../constants/reviewConstants';

export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            };

        case CREATE_REVIEW_SUCCESS:
            return {
                loading: false,
                success: true,
                review: action.payload
            };

        case CREATE_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_REVIEW_RESET:
            return {
                ...state,
                success: false
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export const productReviewsReducer = (state = { reviews: [] }, action) => {
    switch (action.type) {
        case GET_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case GET_REVIEWS_SUCCESS:
            return {
                loading: false,
                reviews: action.payload
            };

        case GET_REVIEWS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export const reviewReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            };

        case DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            };

        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case DELETE_REVIEW_RESET:
            return {
                ...state,
                isDeleted: false
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}; 