import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../Config/api';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalEditOrder({ show, setShow, id, address, onSuccess }) {
    const handleClose = () => setShow(false);

    const [valueOption, setValueOption] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditOrder = async () => {
        try {
            setIsSubmitting(true);
            const res = await request.post('/api/editorder', { valueOption, id });
            toast.success(res.data.message);
            handleClose();
            // Gọi callback để refresh dữ liệu
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng');
        } finally {
            setIsSubmitting(false);
            setValueOption(0);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh Sửa Trạng Thái Đơn Hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Địa chỉ giao hàng: {address}</span>
                    <select
                        className="form-select mt-3"
                        aria-label="Chọn trạng thái đơn hàng"
                        onChange={(e) => setValueOption(e.target.value)}
                        value={valueOption}
                        disabled={isSubmitting}
                    >
                        <option value={0}>Đang vận chuyển</option>
                        <option value={1}>Đã Giao Hàng</option>
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditOrder} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Lưu lại'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalEditOrder;
