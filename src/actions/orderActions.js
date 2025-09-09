import axios from 'axios';

export const getMyOrders = () => async (dispatch) => {
    try {
        dispatch({ type: 'MY_ORDERS_REQUEST' });

        const { data } = await axios.get('/api/getallorder');

        dispatch({
            type: 'MY_ORDERS_SUCCESS',
            payload: data
        });
    } catch (error) {
        dispatch({
            type: 'MY_ORDERS_FAIL',
            payload: error.response.data.message
        });
    }
};

export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'ORDER_DETAILS_REQUEST' });

        const { data } = await axios.get(`/api/order/${id}`);

        dispatch({
            type: 'ORDER_DETAILS_SUCCESS',
            payload: data
        });
    } catch (error) {
        dispatch({
            type: 'ORDER_DETAILS_FAIL',
            payload: error.response.data.message
        });
    }
}; 