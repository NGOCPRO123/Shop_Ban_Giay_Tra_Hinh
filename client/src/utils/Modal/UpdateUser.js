import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request, { requestEditUser } from '../../Config/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalUpdateUser({ show, setShow, dataOneUser }) {
    const handleClose = () => setShow(false);

    const [type, setType] = useState('0');

    const handleEditUser = async () => {
        try {
            const data = {
                type,
                id: dataOneUser._id,
            };
            const res = await requestEditUser(data);
            toast.success(res.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select
                        onChange={(e) => setType(e.target.value)}
                        class="form-select"
                        aria-label="Default select example"
                    >
                        <option selected value="0">
                            Admin
                        </option>
                        <option value="1">Người dùng</option>
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleEditUser}>
                        Chỉnh sửa Người Dùng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUpdateUser;
