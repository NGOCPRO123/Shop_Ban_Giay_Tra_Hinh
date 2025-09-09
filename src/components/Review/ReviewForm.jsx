import React, { useState } from 'react';
import { Rating } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createReview } from '../../actions/reviewActions';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, orderId, onClose }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((old) => [...old, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        const reviewData = {
            rating,
            comment,
            productId,
            orderId,
            images
        };

        dispatch(createReview(reviewData))
            .then(() => {
                toast.success('Đánh giá sản phẩm thành công');
                onClose();
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="review-form bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm</h2>
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Đánh giá</label>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="large"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nhận xét</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Hình ảnh (không bắt buộc)</label>
                    <input
                        type="file"
                        className="w-full"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Preview ${index + 1}`}
                                className="h-20 w-20 object-cover rounded"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm; 