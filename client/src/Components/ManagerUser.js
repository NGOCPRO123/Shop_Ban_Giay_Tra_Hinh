import { useEffect, useState } from 'react';
import request from '../Config/api';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import classNames from 'classnames/bind';
import styles from '../Styles/ManagerUser.module.scss';

import Pagination from './Pagination';
import ModalDeleteUser from '../utils/Modal/ModalDeleteUser';
import ModalUpdateUser from '../utils/Modal/UpdateUser';

const cx = classNames.bind(styles);

function ManagerUser() {
    const [dataAllUser, setDataAllUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [dataOneUser, setDataOneUser] = useState({});

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const [page, setPage] = useState(1);
    const productsPerPage = 10;
    const startIndex = (page - 1) * productsPerPage;

    useEffect(() => {
        const filtered = dataAllUser.filter(user => {
            const userPhone = user.phone ? user.phone.toString() : '';
            const searchTermCleaned = searchTerm.replace(/^0+/, ''); // Bỏ số 0 ở đầu nếu có
            return userPhone.includes(searchTermCleaned);
        });
        setFilteredUsers(filtered);
        setPage(1);
    }, [searchTerm, dataAllUser]);

    const totalPages = Math.ceil(filteredUsers.length / productsPerPage);
    const currentProducts = filteredUsers.slice(startIndex, startIndex + productsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await request.get('/api/getalluser');
            setDataAllUser(res.data);
            setFilteredUsers(res.data);
        };
        fetchData();
    }, [show, show2]);

    const showModalDeleteUser = (user) => {
        setShow(true);
        setDataOneUser(user);
    };

    const showModalEditUser = (user) => {
        setShow2(true);
        setDataOneUser(user);
    };

    return (
        <div className="table-responsive">
            <h4>Quản Lý Người Dùng</h4>
            <ToastContainer />
            
            <div className="d-flex justify-content-end mb-3">
                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => {
                            // Chỉ cho phép nhập số
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setSearchTerm(value);
                        }}
                    />
                    {searchTerm && (
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <table className="table table-bordered border-primary table-hover mt-3">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tên Người Dùng</th>
                        <th scope="col">Email</th>
                        <th scope="col">Số Điện Thoại</th>
                        <th scope="col">Chức Vụ</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((user) => (
                        <tr key={user._id}>
                            <th scope="row">{user._id.slice(0, 5)}</th>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>0{user.phone}</td>
                            <td>{user.isAdmin ? 'Quản Trị Viên' : 'Người Dùng'}</td>
                            <td>
                                <button
                                    style={{ marginRight: '10px' }}
                                    onClick={() => showModalEditUser(user)}
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    Chỉnh sửa quyền
                                </button>
                                <button 
                                    onClick={() => showModalDeleteUser(user)} 
                                    type="button" 
                                    className="btn btn-danger"
                                >
                                    Xóa Người Dùng
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredUsers.length === 0 && (
                <div className="text-center mt-3">
                    <p>Không tìm thấy người dùng nào</p>
                </div>
            )}
            <div className={cx('pagination')}>
                <Pagination page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
                <ModalDeleteUser show={show} setShow={setShow} dataOneUser={dataOneUser} />
                <ModalUpdateUser show={show2} setShow={setShow2} dataOneUser={dataOneUser} />
            </div>
        </div>
    );
}

export default ManagerUser;
