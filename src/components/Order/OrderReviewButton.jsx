import React, { useState } from 'react';
import { Button, Dialog } from '@mui/material';
import ReviewForm from '../Review/ReviewForm';

const OrderReviewButton = ({ productId, orderId, isDelivered }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!isDelivered) {
        return null;
    }

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                size="small"
                className="mt-2"
            >
                Đánh giá sản phẩm
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <ReviewForm
                    productId={productId}
                    orderId={orderId}
                    onClose={handleClose}
                />
            </Dialog>
        </>
    );
};

export default OrderReviewButton; 