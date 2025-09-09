import React from 'react';
import { Rating } from '@mui/material';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

const ReviewsList = ({ reviews }) => {
    return (
        <div className="reviews-list">
            <h3 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h3>
            {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center mb-2">
                                <img
                                    src={review.user.avatar || '/default-avatar.png'}
                                    alt={review.user.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <h4 className="font-medium">{review.user.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        {moment(review.createdAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-2">
                                <Rating value={review.rating} readOnly size="small" />
                            </div>
                            
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                            
                            {review.images && review.images.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {review.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Review ${index + 1}`}
                                            className="h-24 w-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">
                    Chưa có đánh giá nào cho sản phẩm này
                </p>
            )}
        </div>
    );
};

export default ReviewsList; 