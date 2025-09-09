import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
    newReviewReducer,
    productReviewsReducer,
    reviewReducer
} from './reducers/reviewReducers';
import { authReducer } from './reducers/userReducers';
import { myOrdersReducer, orderDetailsReducer } from './reducers/orderReducers';

const reducer = combineReducers({
    newReview: newReviewReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    auth: authReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store; 